import React from 'react';
import { GripVertical, Trash2, AlertTriangle } from 'lucide-react';

// vibrant matte palette
const colors = [
  { bg: 'bg-sky-100', border: 'border-sky-300', room: 'text-blue-800' },
  { bg: 'bg-amber-100', border: 'border-amber-300', room: 'text-orange-800' },
  { bg: 'bg-yellow-100', border: 'border-yellow-300', room: 'text-indigo-800' },
  { bg: 'bg-orange-100', border: 'border-orange-300', room: 'text-teal-800' },
];

const ClassCard = ({
  classDetail,
  conflicts,
  batchIndex,
  dayIndex,
  timeIndex,
  onDragStart,
  onDragEnd,
  deleteClassDetail
}) => {
  const palette = conflicts.length > 0 
    ? { bg: 'bg-red-100', border: 'border-red-300', room: 'text-red-900' }
    : colors[(batchIndex + dayIndex + timeIndex) % colors.length];

  return (
    <div
      className={`relative h-full p-3 flex flex-col justify-between cursor-move rounded-xl 
        ${palette.bg} ${palette.border} border
        shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
        group`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {conflicts.length > 0 && (
        <div className="absolute -top-1 -right-1 z-10">
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
      )}
      <div className="flex-1 min-h-0">
        <div className="text-sm font-bold truncate text-gray-900">
          {classDetail.course}
        </div>
        <div className="text-xs truncate text-gray-800">
          {classDetail.teacher}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs font-medium ${palette.room}`}>
          {classDetail.room}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
          <GripVertical className="w-4 h-4 text-gray-600" />
          <button
            onClick={e => {
              e.stopPropagation();
              deleteClassDetail(batchIndex, dayIndex, timeIndex);
            }}
            className="text-rose-600 hover:text-rose-800 transition-colors duration-200"
            title="Delete class"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
