import React, { useState, useRef, useCallback, useEffect } from 'react';
import ClassRoutineTable from './ClassRoutine/ClassRoutineTable';
import ClassModal from './ClassRoutine/ClassModal';

const ClassRoutineOrganizer = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropChoice, setDropChoice] = useState(null); // {batchIndex, dayIndex, timeIndex}
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [modalData, setModalData] = useState({
    id: '',
    subject: '',
    teacher: '',
    room: '',
    type: 'Lecture'
  });

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
  const timeSlots = [
    '8:00-8:50', '8:50-9:40', '9:40-10:30', '10:50-11:40', '11:40-12:30',
    '12:30-1:20', '2:30-3:20', '3:20-4:10', '4:10-5:00'
  ];
  const batches = Array.from({ length: 15 }, (_, i) => `Batch ${Math.floor(i / 3) + 1} - Section ${String.fromCharCode(65 + (i % 3))}`);

  // Initialize grid data from localStorage or default
  const [gridData, setGridData] = useState(() => {
    const saved = localStorage.getItem('classRoutineGridData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to default if corrupted
      }
    }
    return Array(15).fill(null).map(() =>
      Array(5).fill(null).map(() =>
        Array(9).fill(null)
      )
    );
  });

  // Save gridData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classRoutineGridData', JSON.stringify(gridData));
  }, [gridData]);

  const scrollContainerRef = useRef(null);

  // Check for conflicts (same teacher or room in same time slot)
  const [routineData, setRoutineData] = useState(() => {
    const saved = localStorage.getItem('classRoutineFlatData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem('classRoutineFlatData', JSON.stringify(routineData));
  }, [routineData]);

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

  const handleDragStart = useCallback((e, batchIndex, dayIndex, timeIndex) => {
    const classDetail = routineData.find(
      cls => cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
    );
    if (!classDetail) return;
    setDraggedItem({ batchIndex, dayIndex, timeIndex, classDetail });
    e.dataTransfer.effectAllowed = 'move';
  }, [routineData]);

  const handleDragOver = useCallback((e, batchIndex, dayIndex, timeIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ batch: batchIndex, day: dayIndex, time: timeIndex });
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
  }, [draggedItem]);

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
  }, []);

  const openModal = (batchIndex, dayIndex, timeIndex) => {
    const existingClass = routineData.find(
      cls => cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
    );
    setEditingCell({ batch: batchIndex, day: dayIndex, time: timeIndex });
    setModalData(existingClass || {
      id: '',
      subject: '',
      teacher: '',
      room: '',
      type: 'Lecture'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCell(null);
    setModalData({ id: '', subject: '', teacher: '', room: '', type: 'Lecture' });
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

  const getDayColor = (dayIndex) => {
    const colors = [
      'bg-blue-50 border-blue-200',
      'bg-green-50 border-green-200',
      'bg-purple-50 border-purple-200',
      'bg-orange-50 border-orange-200',
      'bg-pink-50 border-pink-200'
    ];
    return colors[dayIndex];
  };

  const getTimeSlotColor = (timeIndex) => {
    if (timeIndex === 3) return 'bg-yellow-50'; // Break time highlight
    return timeIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white';
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

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Class Routine Organizer</h1>
        <p className="text-gray-600">Drag and drop classes between time slots. Click cells to add or edit classes.</p>
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
            getTimeSlotColor={getTimeSlotColor}
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

      {/* Move/Copy Modal for drag and drop is commented out for testing */}
      {/*
      {isDropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Move or Copy?</h3>
            <p className="mb-6 text-gray-600">Do you want to move or copy the class to the new cell?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDropAction('move')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Move
              </button>
              <button
                onClick={() => handleDropAction('copy')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default ClassRoutineOrganizer;