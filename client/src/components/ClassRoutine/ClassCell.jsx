import React from 'react';
import { Plus } from 'lucide-react';
import ClassCard from './ClassCard';

const ClassCell = ({
  classDetail,
  conflicts,
  isDragOver,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  duplicateClassDetail,
  deleteClassDetail,
  batchIndex,
  dayIndex,
  timeIndex,
  borderClasses,
  timeSlotColor
}) => {
  return (
    <td
      className={`w-32 h-16 ${borderClasses} ${timeSlotColor} relative group cursor-pointer transition-all duration-200
        ${isDragOver ? 'bg-blue-100 border-blue-400' : ''}
        ${classDetail ? 'hover:shadow-md' : 'hover:bg-blue-200'}
        ${conflicts.length > 0 ? 'bg-red-50' : ''}
        ${!classDetail ? 'bg-white' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {classDetail ? (
        <ClassCard
          classDetail={classDetail}
          conflicts={conflicts}
          batchIndex={batchIndex}
          dayIndex={dayIndex}
          timeIndex={timeIndex}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          deleteClassDetail={deleteClassDetail}
        />
      ) : (
        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Plus className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </td>
  );
};

export default ClassCell;
