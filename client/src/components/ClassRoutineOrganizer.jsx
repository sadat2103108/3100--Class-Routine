import React, { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { Settings as SettingsIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import SettingsPage from './Settings';
import ClassRoutineTable from './ClassRoutine/ClassRoutineTable';
import ClassModal from './ClassRoutine/ClassModal';
import { GlobalContext } from '../App';

const ClassRoutineOrganizer = () => {
  const {
    routineData,
    setRoutineData,
    teachers,
    setTeachers,
    courses,
    setCourses,
    rooms,
    setRooms,
    saveAllStates,
  } = useContext(GlobalContext);

  // Status: 'saved', 'unsaved', 'syncing'
  const [saveStatus, setSaveStatus] = useState('saved');

  // Track changes to global state
  useEffect(() => {
    setSaveStatus('unsaved');
  }, [routineData, teachers, courses, rooms]);

  // Sync every 10s and on settings save
  useEffect(() => {
    const interval = setInterval(async () => {
      setSaveStatus('syncing');
      await saveAllStates();
      setSaveStatus('saved');
    }, 10000);
    return () => clearInterval(interval);
  }, [saveAllStates]);

  // Expose manual save for settings page
  const handleManualSave = async () => {
    setSaveStatus('syncing');
    await saveAllStates();
    setSaveStatus('saved');
  };

  const [draggedItem, setDraggedItem] = useState(null);
  const [dropChoice, setDropChoice] = useState(null); // {batchIndex, dayIndex, timeIndex}
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [modalData, setModalData] = useState({
    id: '',
    course: '',
    teacher: '',
    room: '',
    type: 'Lecture'
  });

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
  const timeSlots = [
    '8:00-8:50', '8:50-9:40', '9:40-10:30', '10:50-11:40', '11:40-12:30',
    '12:30-1:20', '2:30-3:20', '3:20-4:10', '4:10-5:00'
  ];
  const batches = Array.from({ length: 15 }, (_, i) => `Series ${20 + Math.floor(i / 3)} - Section ${String.fromCharCode(65 + (i % 3))}`);

  // Remove localStorage gridData and routineData
  // Use global state for routineData

  const scrollContainerRef = useRef(null);

  // Check for conflicts (same teacher or room in same time slot)
  const getConflicts = useCallback((batchIndex, dayIndex, timeIndex, currentClass) => {
    const conflicts = [];
    routineData.forEach(cls => {
      if (
        cls.batchIndex === batchIndex &&
        cls.dayIndex === dayIndex &&
        cls.timeIndex === timeIndex
      ) return; // skip current cell
      if (cls.dayIndex === dayIndex && cls.timeIndex === timeIndex) {
        if (cls.teacher === currentClass.teacher && cls.teacher.trim()) {
          conflicts.push({ type: 'teacher', batch: cls.batchIndex, class: cls });
        }
        if (cls.room === currentClass.room && cls.room.trim()) {
          conflicts.push({ type: 'room', batch: cls.batchIndex, class: cls });
        }
      }
    });
    return conflicts;
  }, [routineData]);

  // Global auto-scroll handler
  const autoScrollOnDrag = (e) => {
    const container = scrollContainerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY;
      const scrollSpeed = 30;
      if (mouseY - rect.top < 40) {
        container.scrollTop -= scrollSpeed;
      } else if (rect.bottom - mouseY < 40) {
        container.scrollTop += scrollSpeed;
      }
    }
  };

  const handleDragStart = useCallback((e, batchIndex, dayIndex, timeIndex) => {
    const classDetail = routineData.find(
      cls => cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
    );
    if (!classDetail) return;
    setDraggedItem({ batchIndex, dayIndex, timeIndex, classDetail });
    e.dataTransfer.effectAllowed = 'move';
    // Add global dragover listener
    document.addEventListener('dragover', autoScrollOnDrag);
  }, [routineData]);

  const handleDragOver = useCallback((e, batchIndex, dayIndex, timeIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ batch: batchIndex, day: dayIndex, time: timeIndex });
    // No local auto-scroll logic needed; handled globally
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverCell(null);
  }, []);

  const handleDrop = useCallback((e, batchIndex, dayIndex, timeIndex) => {
    e.preventDefault();
    setDragOverCell(null);
    if (!draggedItem) return;
    const isCopy = e.ctrlKey || e.metaKey;
    setRoutineData(prev => {
      let newData = [...prev];
      // Remove any class in the target cell
      newData = newData.filter(cls =>
        !(cls.batchIndex === batchIndex &&
          cls.dayIndex === dayIndex &&
          cls.timeIndex === timeIndex)
      );
      if (isCopy) {
        // Add a copy to new position
        newData.push({
          ...draggedItem.classDetail,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          batchIndex,
          dayIndex,
          timeIndex
        });
      } else {
        // Remove from original position
        newData = newData.filter(cls =>
          !(cls.batchIndex === draggedItem.batchIndex &&
            cls.dayIndex === draggedItem.dayIndex &&
            cls.timeIndex === draggedItem.timeIndex)
        );
        // Add to new position
        newData.push({ ...draggedItem.classDetail, batchIndex, dayIndex, timeIndex });
      }
      return newData;
    });
    setDraggedItem(null);
    setDropChoice(null);
    setIsDropModalOpen(false);
  }, [draggedItem, setRoutineData]);

  const handleDropAction = (action) => {
    if (!draggedItem || !dropChoice) {
      setIsDropModalOpen(false);
      setDraggedItem(null);
      setDropChoice(null);
      setDragOverCell(null);
      return;
    }
    setRoutineData(prev => {
      let newData = [...prev];
      // Remove any class in the target cell
      newData = newData.filter(cls =>
        !(cls.batchIndex === dropChoice.batchIndex &&
          cls.dayIndex === dropChoice.dayIndex &&
          cls.timeIndex === dropChoice.timeIndex)
      );
      if (action === 'move') {
        // Remove from original position
        newData = newData.filter(cls =>
          !(cls.batchIndex === draggedItem.batchIndex &&
            cls.dayIndex === draggedItem.dayIndex &&
            cls.timeIndex === draggedItem.timeIndex)
        );
        // Add to new position
        newData.push({ ...draggedItem.classDetail, batchIndex: dropChoice.batchIndex, dayIndex: dropChoice.dayIndex, timeIndex: dropChoice.timeIndex });
      } else if (action === 'copy') {
        // Add a copy to new position
        newData.push({
          ...draggedItem.classDetail,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          batchIndex: dropChoice.batchIndex,
          dayIndex: dropChoice.dayIndex,
          timeIndex: dropChoice.timeIndex
        });
      }
      return newData;
    });
    setIsDropModalOpen(false);
    setDraggedItem(null);
    setDropChoice(null);
    setDragOverCell(null);
  };

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverCell(null);
    // Remove global dragover listener
    document.removeEventListener('dragover', autoScrollOnDrag);
  }, []);

  const openModal = (batchIndex, dayIndex, timeIndex) => {
    const existingClass = routineData.find(
      cls => cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
    );
    setEditingCell({ batch: batchIndex, day: dayIndex, time: timeIndex });
    setModalData(existingClass || {
      id: '',
      course: '',
      teacher: '',
      room: '',
      type: 'Lecture'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCell(null);
    setModalData({ id: '', course: '', teacher: '', room: '', type: 'Lecture' });
  };

  const saveClassDetail = () => {
    if (!editingCell) return;
    const classDetail = {
      ...modalData,
      id: modalData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      batchIndex: editingCell.batch,
      dayIndex: editingCell.day,
      timeIndex: editingCell.time
    };
    setRoutineData(prev => {
      // Remove any existing class in this cell
      const filtered = prev.filter(cls =>
        !(cls.batchIndex === editingCell.batch && cls.dayIndex === editingCell.day && cls.timeIndex === editingCell.time)
      );
      return [...filtered, classDetail];
    });
    closeModal();
  };

  const duplicateClassDetail = (batchIndex, dayIndex, timeIndex) => {
    const classDetail = routineData.find(
      cls => cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
    );
    if (!classDetail) return;
    const duplicatedClass = {
      ...classDetail,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setModalData(duplicatedClass);
    setEditingCell(null); // Set to null to indicate this is a new class
    setIsModalOpen(true);
  };

  const deleteClassDetail = (batchIndex, dayIndex, timeIndex) => {
    setRoutineData(prev => prev.filter(cls =>
      !(cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex)
    ));
  };

  // Color for each group of 3 columns (sections)
  const getDayColor = (dayIndex) => {
    const groupColors = [
      'bg-blue-50 border-blue-200',
      'bg-green-50 border-green-200',
      'bg-purple-50 border-purple-200',
      'bg-orange-50 border-orange-200',
      'bg-pink-50 border-pink-200'
    ];
    // Each day is a group, but you can alternate for more contrast if needed
    return groupColors[dayIndex % groupColors.length];
  };

  const getBorderClasses = (batchIndex, dayIndex, timeIndex) => {
    let classes = 'border border-gray-200';
    // Add thicker borders for day separations (every 9 columns)
    if (timeIndex === 8) {
      classes += ' border-r-4 border-r-gray-400';
    }
    // Add thicker borders for batch group separations (every 3 rows)
    if ((batchIndex + 1) % 3 === 0) {
      classes += ' border-b-4 border-b-gray-400';
    }
    return classes;
  };

  // Simple navigation state for settings page
  const [showSettings, setShowSettings] = useState(false);

  // Listen for Ctrl+S to trigger manual save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave]);

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} onManualSave={handleManualSave} />;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class Routine Organizer</h1>
          <p className="text-gray-600">Drag and drop classes between time slots. Click cells to add or edit classes.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          {saveStatus === 'syncing' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" title="Syncing..." />}
          {saveStatus === 'saved' && <CheckCircle2 className="w-5 h-5 text-green-500" title="Saved" />}
          {saveStatus === 'unsaved' && <AlertCircle className="w-5 h-5 text-yellow-500" title="Unsaved changes" />}
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Settings"
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-auto">
          <ClassRoutineTable
            batches={batches}
            days={days}
            timeSlots={timeSlots}
            routineData={routineData}
            getConflicts={getConflicts}
            dragOverCell={dragOverCell}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            openModal={openModal}
            duplicateClassDetail={duplicateClassDetail}
            deleteClassDetail={deleteClassDetail}
            getDayColor={getDayColor}
            getBorderClasses={getBorderClasses}
          />
        </div>
      </div>

      <ClassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveClassDetail}
        modalData={modalData}
        setModalData={setModalData}
        editingCell={editingCell}
        getConflicts={getConflicts}
        batches={batches}
      />
    </div>
  );
};

export default ClassRoutineOrganizer;