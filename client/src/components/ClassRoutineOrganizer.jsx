import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { Settings as SettingsIcon, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import SettingsPage from './Settings';
import ClassRoutineTable from './ClassRoutine/ClassRoutineTable';
import ClassModal from './ClassRoutine/ClassModal';
import { GlobalContext } from '../App';
import { downloadRoutinePDF } from '../utils/download';
import { days, sections, semesters, timeSlots } from '../utils/changables';




const ClassRoutineOrganizer = () => {


  /// LOAD CONTEXTS 

  const {
    routineData,
    setRoutineData,
    teachers,
    courses,
    rooms,
    saveAllStates,
  } = useContext(GlobalContext);

  /// /////////////////////

  const batches = semesters.flatMap(s =>
      sections.map(sec => `${s} - Section ${sec}`)
    );



  /// AUTO SAVING /////////////////

  const [saveStatus, setSaveStatus] = useState('saved');

  useEffect(() => {
    setSaveStatus('unsaved');
  }, [routineData, teachers, courses, rooms]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (saveStatus !== 'saved') { 
        setSaveStatus('syncing');
        await saveAllStates();
        setSaveStatus('saved');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [saveStatus, saveAllStates]);

  const handleManualSave = async () => {
    setSaveStatus('syncing');
    await saveAllStates();
    setSaveStatus('saved');
  };

  /// ////////////////////////////





  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [modalData, setModalData] = useState({
    id: '',
    course: '',
    teacher: '',
    room: ''
  });

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
  }, [draggedItem, setRoutineData]);


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
      room: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCell(null);
    setModalData({ id: '', course: '', teacher: '', room: '' });
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


  const getBorderClasses = (batchIndex, timeIndex) => {
    let classes = 'border border-gray-500';
    // Add thicker borders for day separations (every 9 columns)
    if (timeIndex === 8) {
      classes += ' border-r-4 border-r-red-400';
    }
    // Add thicker borders for batch group separations (every 3 rows)
    if ((batchIndex + 1) % 3 === 0) {
      classes += ' border-b-4 border-b-yellow-400';
    }
    return classes;
  };

  const handleDownload = async () => {


    try {

      await downloadRoutinePDF(batches, timeSlots);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
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
    <div className="h-screen bg-gray-50 flex flex-col">


      <div className="bg-gray-900 shadow-sm border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 object-contain" />

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold font-rubik text-white">ROUTINE PLANNER</h1>
            {/* Optional description */}
            {/* <p className="text-gray-400">Drag & drop classes. CTRL+Drag to duplicate</p> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Icon */}
          {saveStatus === 'syncing' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" title="Syncing..." />}
          {saveStatus === 'saved' && <CheckCircle2 className="w-5 h-5 text-green-400" title="Saved" />}
          {saveStatus === 'unsaved' && <AlertCircle className="w-5 h-5 text-yellow-400" title="Unsaved changes" />}

          {/* Download button */}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors border border-gray-700"
            title="Download Routine"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5 text-gray-200" />
          </button>

          {/* Settings button */}
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-800 transition-colors border border-gray-700"
            title="Settings"
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="w-6 h-6 text-gray-200" />
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