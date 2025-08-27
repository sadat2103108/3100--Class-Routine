import React, { useContext, useRef } from 'react';
import { GlobalContext } from '../App';
import { Trash2 } from 'lucide-react';

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
    setTimeout(() => teacherRefs.current[teachers.length]?.focus(), 0);
  };
  const addRoom = () => {
    setRooms([...rooms, '']);
    setTimeout(() => roomRefs.current[rooms.length]?.focus(), 0);
  };
  const addCourse = () => {
    setCourses([...courses, '']);
    setTimeout(() => courseRefs.current[courses.length]?.focus(), 0);
  };

  const deleteTeacher = idx => setTeachers(teachers.filter((_, i) => i !== idx));
  const deleteRoom = idx => setRooms(rooms.filter((_, i) => i !== idx));
  const deleteCourse = idx => setCourses(courses.filter((_, i) => i !== idx));

  const saveSettings = async () => {
    setTeachers(prev => [...prev].filter(t => t.trim() !== '').sort((a, b) => a.localeCompare(b)));
    setRooms(prev => [...prev].filter(r => r.trim() !== '').sort((a, b) => a.localeCompare(b)));
    setCourses(prev => [...prev].filter(c => c.trim() !== '').sort((a, b) => a.localeCompare(b)));

    await saveAllStates();
    alert('Settings saved!');
  };

  return (
    <div className="h-screen bg-white flex flex-col text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-gray-800 shadow p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-2xl font-semibold tracking-wide text-white">Settings</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-wrap gap-6 mb-8">

          {/* Teachers */}
          <div className="flex-1 min-w-[250px] bg-gray-300 p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Teacher Names</h3>
            {teachers.map((teacher, idx) => (
              <div key={idx} className="flex items-center mb-3">
                <input
                  ref={el => (teacherRefs.current[idx] = el)}
                  value={teacher}
                  onChange={e => handleTeachersChange(e, idx)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTeacher())}
                  className="p-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md flex-1 focus:ring-1 focus:ring-blue-400 focus:outline-none transition"
                  placeholder={`Teacher ${idx + 1}`}
                />
                <button
                  onClick={() => deleteTeacher(idx)}
                  className="px-2 py-2 ml-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md transition flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addTeacher}
              className="mt-2 w-full py-2 bg-blue-300 hover:bg-blue-500 text-gray-800 font-semibold rounded-lg transition"
            >
              Add Teacher
            </button>
          </div>


          {/* Rooms */}
          <div className="flex-1 min-w-[250px] bg-gray-300 p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Room Names</h3>
            {rooms.map((room, idx) => (
              <div key={idx} className="flex items-center mb-3">
                <input
                  ref={el => (roomRefs.current[idx] = el)}
                  value={room}
                  onChange={e => handleRoomsChange(e, idx)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRoom())}
                  className="p-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md flex-1 focus:ring-1 focus:ring-blue-400 focus:outline-none transition"
                  placeholder={`Room ${idx + 1}`}
                />
                <button
                  onClick={() => deleteRoom(idx)}
                  className="px-2 py-2 ml-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md transition flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addRoom}
              className="mt-2 w-full py-2 bg-blue-300 hover:bg-blue-500 text-gray-800 font-semibold rounded-lg transition"
            >
              Add Room
            </button>
          </div>

          {/* Courses */}
          <div className="flex-1 min-w-[250px] bg-gray-300 p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Courses</h3>
            {courses.map((course, idx) => (
              <div key={idx} className="flex items-center mb-3">
                <input
                  ref={el => (courseRefs.current[idx] = el)}
                  value={course}
                  onChange={e => handleCoursesChange(e, idx)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                  className="p-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md flex-1 focus:ring-1 focus:ring-purple-400 focus:outline-none transition"
                  placeholder={`Course ${idx + 1}`}
                />
                <button
                  onClick={() => deleteCourse(idx)}
                  className="px-2 py-2 ml-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md transition flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addCourse}
              className="mt-2 w-full py-2 bg-blue-300 hover:bg-blue-500 text-gray-800 font-semibold rounded-lg transition"
              
            >
              Add Course
            </button>
          </div>

        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="mt-4 w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
