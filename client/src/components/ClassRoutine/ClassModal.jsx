import React, { useContext } from 'react';
import { AlertTriangle } from 'lucide-react';
import { GlobalContext } from '../../App';

const ClassModal = ({
  isOpen,
  onClose,
  onSave,
  modalData,
  setModalData,
  editingCell,
  getConflicts,
  batches
}) => {
  if (!isOpen) return null;

  // Use global state for dropdowns
  const { teachers, rooms, courses } = useContext(GlobalContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingCell ? 'Edit Class' : 'Add Class'}
            </h3>
            <button
              onClick={onClose}
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
                        {conflict.type === 'teacher' ? 'Teacher' : 'Room'} conflict with {batches[conflict.batch]}: {conflict.class.course}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                value={modalData.course}
                onChange={e => setModalData(prev => ({ ...prev, course: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
              >
                <option value="">Select course</option>
                {courses.map((course, idx) => (
                  <option key={idx} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher
              </label>
              <select
                value={modalData.teacher}
                onChange={e => setModalData(prev => ({ ...prev, teacher: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
              >
                <option value="">Select teacher</option>
                {teachers.map((teacher, idx) => (
                  <option key={idx} value={teacher}>{teacher}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <select
                value={modalData.room}
                onChange={e => setModalData(prev => ({ ...prev, room: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
              >
                <option value="">Select room</option>
                {rooms.map((room, idx) => (
                  <option key={idx} value={room}>{room}</option>
                ))}
              </select>
            </div>

            {/* Type option removed as requested */}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!modalData.course.trim()}
              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {editingCell ? 'Update' : 'Add'} Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
