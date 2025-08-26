import React from 'react';
import ClassCell from './ClassCell';

const ClassRoutineTable = ({
  batches,
  days,
  timeSlots,
  routineData = [],
  getConflicts,
  dragOverCell,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  openModal,
  duplicateClassDetail,
  deleteClassDetail,
  getDayColor,
  getTimeSlotColor,
  getBorderClasses
}) => {
  return (
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
                const classDetail = routineData.find(
                  cls => cls.batchIndex === batchIndex && cls.dayIndex === dayIndex && cls.timeIndex === timeIndex
                );
                const conflicts = classDetail ? getConflicts(batchIndex, dayIndex, timeIndex, classDetail) : [];
                const isDragOver = dragOverCell?.batch === batchIndex &&
                  dragOverCell?.day === dayIndex &&
                  dragOverCell?.time === timeIndex;
                return (
                  <ClassCell
                    key={`${batchIndex}-${dayIndex}-${timeIndex}`}
                    classDetail={classDetail}
                    conflicts={conflicts}
                    isDragOver={isDragOver}
                    onClick={() => openModal(batchIndex, dayIndex, timeIndex)}
                    onDragStart={e => handleDragStart(e, batchIndex, dayIndex, timeIndex)}
                    onDragEnd={handleDragEnd}
                    onDragOver={e => handleDragOver(e, batchIndex, dayIndex, timeIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, batchIndex, dayIndex, timeIndex)}
                    duplicateClassDetail={duplicateClassDetail}
                    deleteClassDetail={deleteClassDetail}
                    batchIndex={batchIndex}
                    dayIndex={dayIndex}
                    timeIndex={timeIndex}
                    borderClasses={getBorderClasses(batchIndex, dayIndex, timeIndex)}
                    timeSlotColor={getTimeSlotColor(timeIndex)}
                  />
                );
              })
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClassRoutineTable;
