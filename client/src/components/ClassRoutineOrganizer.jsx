import React, { useState, useRef, useCallback } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Copy, AlertTriangle } from 'lucide-react';

const ClassRoutineOrganizer = () => {
  const [draggedItem, setDraggedItem] = useState(null);
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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '8:00-8:50', '8:50-9:40', '9:40-10:30', '10:50-11:40', '11:40-12:30',
    '12:30-1:20', '2:20-3:10', '3:10-4:00', '4:00-4:50'
  ];
  const batches = Array.from({ length: 15 }, (_, i) => `Batch ${Math.floor(i / 3) + 1} - Section ${String.fromCharCode(65 + (i % 3))}`);

  // Initialize grid data
  const [gridData, setGridData] = useState(() => {
    return Array(15).fill(null).map(() =>
      Array(5).fill(null).map(() =>
        Array(9).fill(null)
      )
    );
  });

  const scrollContainerRef = useRef(null);

  // Check for conflicts (same teacher or room in same time slot)
  const getConflicts = useCallback((batchIndex, dayIndex, timeIndex, currentClass) => {
    const conflicts = [];
    const currentTimeSlot = timeIndex;
    
    // Check all batches for the same time slot
    for (let b = 0; b < gridData.length; b++) {
      if (b === batchIndex) continue; // Skip current batch
      
      const classAtSameTime = gridData[b][dayIndex][currentTimeSlot];
      if (classAtSameTime && currentClass) {
        if (classAtSameTime.teacher === currentClass.teacher && classAtSameTime.teacher.trim()) {
          conflicts.push({ type: 'teacher', batch: b, class: classAtSameTime });
        }
        if (classAtSameTime.room === currentClass.room && classAtSameTime.room.trim()) {
          conflicts.push({ type: 'room', batch: b, class: classAtSameTime });
        }
      }
    }
    
    return conflicts;
  }, [gridData]);

  const handleDragStart = useCallback((e, batchIndex, dayIndex, timeIndex) => {
    const classDetail = gridData[batchIndex][dayIndex][timeIndex];
    if (!classDetail) return;

    setDraggedItem({
      batchIndex,
      dayIndex,
      timeIndex,
      classDetail
    });

    e.dataTransfer.effectAllowed = 'move';
  }, [gridData]);

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

    setGridData(prev => {
      const newData = prev.map(batch => batch.map(day => [...day]));
      
      // Remove from original position
      newData[draggedItem.batchIndex][draggedItem.dayIndex][draggedItem.timeIndex] = null;
      
      // Add to new position
      newData[batchIndex][dayIndex][timeIndex] = draggedItem.classDetail;
      
      return newData;
    });

    setDraggedItem(null);
  }, [draggedItem]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverCell(null);
  }, []);

  const openModal = (batchIndex, dayIndex, timeIndex) => {
    const existingClass = gridData[batchIndex][dayIndex][timeIndex];
    
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
      id: modalData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setGridData(prev => {
      const newData = prev.map(batch => batch.map(day => [...day]));
      newData[editingCell.batch][editingCell.day][editingCell.time] = classDetail;
      return newData;
    });

    closeModal();
  };

  const duplicateClassDetail = (batchIndex, dayIndex, timeIndex) => {
    const classDetail = gridData[batchIndex][dayIndex][timeIndex];
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
    setGridData(prev => {
      const newData = prev.map(batch => batch.map(day => [...day]));
      newData[batchIndex][dayIndex][timeIndex] = null;
      return newData;
    });
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
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-auto"
        >
          <table className="border-collapse">
            <thead>
              {/* Day Names Row */}
              <tr className="sticky top-0 z-20">
                <th className="w-48 h-12 bg-gray-800 text-white font-semibold text-sm border border-gray-300 sticky left-0 z-30">
                  Batch / Section
                </th>
                {days.map((day, dayIndex) => (
                  <th 
                    key={day}
                    colSpan={9}
                    className={`h-12 font-semibold text-gray-700 border border-gray-300 ${getDayColor(dayIndex)} ${dayIndex < 4 ? 'border-r-4 border-r-gray-400' : ''}`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
              
              {/* Time Slots Row */}
              <tr className="sticky top-12 z-20">
                <th className="w-48 h-12 bg-gray-700 text-white font-medium text-xs border border-gray-300 sticky left-0 z-30">
                  Time Slots
                </th>
                {days.map((_, dayIndex) =>
                  timeSlots.map((time, timeIndex) => (
                    <th
                      key={`${dayIndex}-${timeIndex}`}
                      className={`w-32 h-12 text-xs text-gray-600 font-medium border border-gray-200 ${getTimeSlotColor(timeIndex)} ${getDayColor(dayIndex)} ${timeIndex === 8 && dayIndex < 4 ? 'border-r-4 border-r-gray-400' : ''}`}
                    >
                      <div className="px-1 text-center">
                        {time}
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            
            <tbody>
              {batches.map((batch, batchIndex) => (
                <tr key={batchIndex}>
                  {/* Batch Name Cell */}
                  <td className={`w-48 h-16 bg-gray-50 text-sm font-medium text-gray-700 border border-gray-200 sticky left-0 z-10 ${(batchIndex + 1) % 3 === 0 ? 'border-b-4 border-b-gray-400' : ''}`}>
                    <div className="px-4 py-2">
                      {batch}
                    </div>
                  </td>
                  
                  {/* Class Cells */}
                  {days.map((_, dayIndex) =>
                    timeSlots.map((_, timeIndex) => {
                      const classDetail = gridData[batchIndex][dayIndex][timeIndex];
                      const conflicts = classDetail ? getConflicts(batchIndex, dayIndex, timeIndex, classDetail) : [];
                      const isDragOver = dragOverCell?.batch === batchIndex && 
                                       dragOverCell?.day === dayIndex && 
                                       dragOverCell?.time === timeIndex;
                      
                      return (
                        <td
                          key={`${batchIndex}-${dayIndex}-${timeIndex}`}
                          className={`w-32 h-16 ${getBorderClasses(batchIndex, dayIndex, timeIndex)} ${getTimeSlotColor(timeIndex)} relative group cursor-pointer transition-all duration-200 ${
                            isDragOver ? 'bg-blue-100 border-blue-400' : ''
                          } ${classDetail ? 'hover:shadow-md' : 'hover:bg-gray-100'} ${conflicts.length > 0 ? 'bg-red-50' : ''}`}
                          onClick={() => openModal(batchIndex, dayIndex, timeIndex)}
                          onDragOver={(e) => handleDragOver(e, batchIndex, dayIndex, timeIndex)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, batchIndex, dayIndex, timeIndex)}
                        >
                          {classDetail ? (
                            <div
                              className={`h-full p-1 flex flex-col justify-between cursor-move bg-white rounded-sm shadow-sm border hover:shadow-md transition-shadow duration-200 m-0.5 ${conflicts.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, batchIndex, dayIndex, timeIndex)}
                              onDragEnd={handleDragEnd}
                            >
                              {conflicts.length > 0 && (
                                <div className="absolute -top-1 -right-1 z-10">
                                  <AlertTriangle className="w-3 h-3 text-red-500" />
                                </div>
                              )}
                              <div className="flex-1 min-h-0">
                                <div className="text-xs font-semibold text-gray-800 truncate">
                                  {classDetail.subject}
                                </div>
                                <div className="text-xs text-gray-600 truncate">
                                  {classDetail.teacher}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{classDetail.room}</span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                                  <GripVertical className="w-3 h-3 text-gray-400" />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateClassDetail(batchIndex, dayIndex, timeIndex);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                    title="Duplicate class"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteClassDetail(batchIndex, dayIndex, timeIndex);
                                    }}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                    title="Delete class"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Plus className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingCell ? 'Edit Class' : 'Add Class'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {editingCell && (() => {
                  const conflicts = getConflicts(editingCell.batch, editingCell.day, editingCell.time, modalData);
                  return conflicts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Conflicts Detected</span>
                      </div>
                      <div className="text-xs text-red-600 space-y-1">
                        {conflicts.map((conflict, index) => (
                          <div key={index}>
                            {conflict.type === 'teacher' ? 'Teacher' : 'Room'} conflict with {batches[conflict.batch]}: {conflict.class.subject}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={modalData.subject}
                    onChange={(e) => setModalData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <input
                    type="text"
                    value={modalData.teacher}
                    onChange={(e) => setModalData(prev => ({ ...prev, teacher: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter teacher name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    value={modalData.room}
                    onChange={(e) => setModalData(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter room number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={modalData.type}
                    onChange={(e) => setModalData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveClassDetail}
                  disabled={!modalData.subject.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {editingCell ? 'Update' : 'Add'} Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRoutineOrganizer;