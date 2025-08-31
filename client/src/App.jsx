import { createContext, useState, useEffect, useCallback } from 'react';
import ClassRoutineOrganizer from './components/ClassRoutineOrganizer';

export const GlobalContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function App() {
  const [loadedSettings, setLoadedSettings] = useState(false);
  const [loadedRoutine, setLoadedRoutine] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [routineData, setRoutineData] = useState([]);


  /// FETCH INITIAL VALUES ////////////////////////////
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/settings`);
        if (!res.ok) throw new Error('Failed');
        setLoadedSettings(true);
        const data = await res.json();
        setTeachers(data.teachers);
        setCourses(data.courses);
        setRooms(data.rooms);
      } catch {
        console.log("Failed to fetch settings data");
        
      }
    };
    const fetchRoutine = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/routine`);
        if (!res.ok) throw new Error('Failed');
        setLoadedRoutine(true);
        const data = await res.json();
        setRoutineData(data.routineData);
      } catch {
        console.log("Failed to fetch routine data");
        
      }
    };
    fetchSettings();
    fetchRoutine();
  }, []);

  /// /////////////////////////////////////


  // SAVING //////////

  const saveAllStates = useCallback(async () => {
    if(!loadedRoutine || !loadedSettings) return;
    try {
      const res1 = await fetch(`${SERVER_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teachers, courses, rooms })
      });
      if (!res1.ok) {
        console.error('Settings save failed:', res1.status, await res1.text());
      }
    } catch (err) {
      console.error('Settings save error:', err);
    }
    try {
      const res2 = await fetch(`${SERVER_URL}/api/routine`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routineData })
      });
      if (!res2.ok) {
        console.error('Routine save failed:', res2.status, await res2.text());
      }
    } catch (err) {
      console.error('Routine save error:', err);
    }
  }, [teachers, courses, rooms, routineData]);



  // Save states to backend every 5 seconds
  useEffect(() => {
    if(!loadedRoutine || !loadedSettings) return;
    const interval = setInterval(() => {
      saveAllStates();
    }, 5000);
    return () => clearInterval(interval);
  });


  /// ////////////////////




  /// GLOBAL STATES ////// 

  const contextValue = {
    teachers,
    setTeachers,
    courses,
    setCourses,
    rooms,
    setRooms,
    routineData,
    setRoutineData,
    saveAllStates,
  };

  /// //////////////////



  return (
    <GlobalContext.Provider value={contextValue}>

      <ClassRoutineOrganizer />

    </GlobalContext.Provider>
  );
}

export default App;