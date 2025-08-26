import React from 'react';
import { AlertTriangle } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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
                onChange={e => setModalData(prev => ({ ...prev, subject: e.target.value }))}
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
                onChange={e => setModalData(prev => ({ ...prev, teacher: e.target.value }))}
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
                onChange={e => setModalData(prev => ({ ...prev, room: e.target.value }))}
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
                onChange={e => setModalData(prev => ({ ...prev, type: e.target.value }))}
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
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!modalData.subject.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
