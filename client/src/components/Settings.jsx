import React, { useContext, useRef, useEffect } from 'react';
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

  // store refs for auto-focusing last input
  const teacherRefs = useRef([]);
  const roomRefs = useRef([]);
  const courseRefs = useRef([]);

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

  const addTeacher = () => {
    setTeachers([...teachers, '']);
    setTimeout(() => {
      teacherRefs.current[teachers.length]?.focus();
    }, 0);
  };
  const addRoom = () => {
    setRooms([...rooms, '']);
    setTimeout(() => {
      roomRefs.current[rooms.length]?.focus();
    }, 0);
  };
  const addCourse = () => {
    setCourses([...courses, '']);
    setTimeout(() => {
      courseRefs.current[courses.length]?.focus();
    }, 0);
  };

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
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        <button onClick={onBack} className="p-2 rounded hover:bg-gray-100 border border-gray-200 text-gray-600">Back</button>
      </div>
      <div className="flex-1 p-6 overflow-auto">

        {/* Teachers */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Teacher Names</h3>
          {teachers.map((teacher, idx) => (
            <div key={idx} className="flex items-center mb-2 max-w-md">
              <input
                ref={el => (teacherRefs.current[idx] = el)}
                value={teacher}
                onChange={e => handleTeachersChange(e, idx)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTeacher();
                  }
                }}
                className="p-2 border border-gray-200 bg-white text-gray-800 rounded flex-1 focus:ring-2 focus:ring-blue-400"
                placeholder={`Teacher ${idx + 1}`}
              />
              <button onClick={() => deleteTeacher(idx)} className="ml-2 px-2 py-1 text-red-400 hover:text-red-600">Delete</button>
            </div>
          ))}
          <button onClick={addTeacher} className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Add Teacher</button>
        </div>

        {/* Rooms */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-green-600">Room Numbers</h3>
          {rooms.map((room, idx) => (
            <div key={idx} className="flex items-center mb-2 max-w-md">
              <input
                ref={el => (roomRefs.current[idx] = el)}
                value={room}
                onChange={e => handleRoomsChange(e, idx)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRoom();
                  }
                }}
                className="p-2 border border-gray-200 bg-white text-gray-800 rounded flex-1 focus:ring-2 focus:ring-green-400"
                placeholder={`Room ${idx + 1}`}
              />
              <button onClick={() => deleteRoom(idx)} className="ml-2 px-2 py-1 text-red-400 hover:text-red-600">Delete</button>
            </div>
          ))}
          <button onClick={addRoom} className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Add Room</button>
        </div>

        {/* Courses */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">Courses</h3>
          {courses.map((course, idx) => (
            <div key={idx} className="flex items-center mb-2 max-w-md">
              <input
                ref={el => (courseRefs.current[idx] = el)}
                value={course}
                onChange={e => handleCoursesChange(e, idx)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCourse();
                  }
                }}
                className="p-2 border border-gray-200 bg-white text-gray-800 rounded flex-1 focus:ring-2 focus:ring-purple-400"
                placeholder={`Course ${idx + 1}`}
              />
              <button onClick={() => deleteCourse(idx)} className="ml-2 px-2 py-1 text-red-400 hover:text-red-600">Delete</button>
            </div>
          ))}
          <button onClick={addCourse} className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Add Course</button>
        </div>

        <button onClick={saveSettings} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded font-semibold hover:bg-indigo-200">Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
