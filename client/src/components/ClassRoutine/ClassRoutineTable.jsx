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
  getBorderClasses
}) => {
  // Helper for column group color (light matte aesthetic, with soft dark for columns 4,5,6)
  const groupColors = [
    'bg-gray-100',    // columns 1-3
    'bg-gray-300', // columns 4-6
    'bg-blue-300',  // columns 7-9
    'bg-purple-50', // extra
    'bg-pink-50',   // extra
  ];
  const getColumnGroupColor = (timeIndex) => {
    const group = Math.floor(timeIndex / 3);
    return groupColors[group % groupColors.length];
  };

  // Helper for batch/section row color
  const getBatchRowColor = (batchIndex) => {
    // Every 3 rows, alternate color
    const group = Math.floor(batchIndex / 3);
    return group % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };

  // Colors for day name heading row
  const dayHeadingColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100'
  ];
  // Colors for series name heading column (group of 3)
  const batchHeadingColors = [
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-purple-50',
    'bg-pink-50'
  ];

  return (
    <table className="border-separate border-spacing-0 w-full text-xs">
      <thead>
        {/* Day Names Row */}
        <tr className="sticky top-0 z-20">
          <th className="w-48 h-12 bg-gray-100 text-gray-800 font-semibold text-sm border border-r-gray-500 sticky left-0 z-30">
            Days
          </th>
          {days.map((day, dayIndex) => (
            <th
              key={day}
              colSpan={9}
              className={` h-12 font-semibold text-lg text-gray-500 border border-gray-300 ${dayHeadingColors[dayIndex % dayHeadingColors.length]} ${dayIndex < 4 ? 'border-r-4 border-r-red-500' : ''}`}
            >
              {day}
            </th>
          ))}
        </tr>
        {/* Time Slots Row */}
        <tr className="sticky top-12 z-20">
          <th className="w-48 h-12 bg-gray-200 text-gray-800 font-medium text-sm border border-gray-300 sticky left-0 z-30">
            Time Slots
          </th>
          {days.map((_, dayIndex) =>
            timeSlots.map((time, timeIndex) => (
              <th
                key={`${dayIndex}-${timeIndex}`}
                className={`w-38 h-12 text-sm text-gray-600 font-medium border border-gray-500 ${getColumnGroupColor(timeIndex)} ${timeIndex === 8 && dayIndex < 4 ? 'border-r-4 border-r-red-500' : ''}`}
              >
                <div className="px-4 text-center">
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
            <td
              className={
                `w-48 h-16 text-sm font-bold text-gray-800 border-2 
                border-gray-300 sticky left-0 z-10  
                ${batchHeadingColors[Math.floor(batchIndex / 3) % batchHeadingColors.length]} 
                ${(batchIndex + 1) % 3 === 0 ? 'border-b-4 border-b-gray-300' : ''} 
                whitespace-nowrap overflow-hidden text-ellipsis`
              }
            >
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
                // Apply group color to all cells
                const cellColor = `${getColumnGroupColor(timeIndex)} ${getBatchRowColor(batchIndex)}`;
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
                    borderClasses={getBorderClasses(batchIndex, timeIndex)}
                    timeSlotColor={cellColor}
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
