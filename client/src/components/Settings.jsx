import React, { useContext } from 'react';
import { GlobalContext } from '../App';

const Settings = ({ onBack }) => {
  const {
    teachers,
    setTeachers,
    rooms,
    setRooms,
    courses,
    setCourses,
    saveAllStates,
  } = useContext(GlobalContext);

  const handleTeachersChange = (e, idx) => {
    const newArr = [...teachers];
    newArr[idx] = e.target.value;
    setTeachers(newArr);
  };
  const handleRoomsChange = (e, idx) => {
    const newArr = [...rooms];
    newArr[idx] = e.target.value;
    setRooms(newArr);
  };
  const handleCoursesChange = (e, idx) => {
    const newArr = [...courses];
    newArr[idx] = e.target.value;
    setCourses(newArr);
  };

  const addTeacher = () => setTeachers([...teachers, '']);
  const addRoom = () => setRooms([...rooms, '']);
  const addCourse = () => setCourses([...courses, '']);

  const deleteTeacher = idx => setTeachers(teachers.filter((_, i) => i !== idx));
  const deleteRoom = idx => setRooms(rooms.filter((_, i) => i !== idx));
  const deleteCourse = idx => setCourses(courses.filter((_, i) => i !== idx));

  // SaveSettings syncs with backend
  const saveSettings = async () => {
    await saveAllStates();
    alert('Settings saved!');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        <button onClick={onBack} className="p-2 rounded hover:bg-gray-200">Back</button>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Teacher Names</h3>
          {teachers.map((teacher, idx) => (
            <div key={idx} className="flex items-center mb-2 max-w-md">
              <input
                value={teacher}
                onChange={e => handleTeachersChange(e, idx)}
                className="p-2 border rounded flex-1"
                placeholder={`Teacher ${idx + 1}`}
              />
              <button onClick={() => deleteTeacher(idx)} className="ml-2 px-2 py-1 text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
          <button onClick={addTeacher} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Add Teacher</button>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Room Numbers</h3>
          {rooms.map((room, idx) => (
            <div key={idx} className="flex items-center mb-2 max-w-md">
              <input
                value={room}
                onChange={e => handleRoomsChange(e, idx)}
                className="p-2 border rounded flex-1"
                placeholder={`Room ${idx + 1}`}
              />
              <button onClick={() => deleteRoom(idx)} className="ml-2 px-2 py-1 text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
          <button onClick={addRoom} className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Add Room</button>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Courses</h3>
          {courses.map((course, idx) => (
            <div key={idx} className="flex items-center mb-2 max-w-md">
              <input
                value={course}
                onChange={e => handleCoursesChange(e, idx)}
                className="p-2 border rounded flex-1"
                placeholder={`Course ${idx + 1}`}
              />
              <button onClick={() => deleteCourse(idx)} className="ml-2 px-2 py-1 text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
          <button onClick={addCourse} className="mt-2 px-3 py-1 bg-purple-500 text-white rounded">Add Course</button>
        </div>
        <button onClick={saveSettings} className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold">Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
