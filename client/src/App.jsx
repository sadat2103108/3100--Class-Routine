
import React, { createContext, useState, useEffect } from 'react';
import ClassRoutineOrganizer from './components/ClassRoutineOrganizer';

export const GlobalContext = createContext();

function App() {
  // Example global state, replace with your actual state and fetching logic
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [routineData, setRoutineData] = useState([]);

  // Example: fetch global arrays from backend here
  useEffect(() => {
    // fetch('/api/settings').then(...)
    // fetch('/api/routine').then(...)
  }, []);

  const contextValue = {
    teachers,
    setTeachers,
    courses,
    setCourses,
    rooms,
    setRooms,
    routineData,
    setRoutineData,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      <ClassRoutineOrganizer />
    </GlobalContext.Provider>
  );
}

export default App;