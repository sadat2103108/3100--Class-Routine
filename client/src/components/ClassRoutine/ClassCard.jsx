import React from 'react';
import { GripVertical, Trash2, AlertTriangle } from 'lucide-react';

const ClassCard = ({
  classDetail,
  conflicts,
  batchIndex,
  dayIndex,
  timeIndex,
  onDragStart,
  onDragEnd,
  deleteClassDetail
}) => (
  <div
    className={`h-full p-1 flex flex-col justify-between cursor-move bg-white rounded-sm shadow-sm border hover:shadow-md transition-shadow duration-200 m-0.5 ${conflicts.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
    draggable
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
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
          onClick={e => {
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
);

export default ClassCard;
