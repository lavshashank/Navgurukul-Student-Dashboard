import React, { createContext, useContext, useState, useEffect } from 'react';

const ClassContext = createContext();

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};

export const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    const mockClasses = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        course: "Full Stack Web Development",
        instructor: "Priya Sharma",
        description: "Introduction to JavaScript programming, variables, functions, and basic DOM manipulation",
        duration: 90, // minutes
        maxStudents: 25,
        enrolledStudents: 18,
        tags: ["beginner", "javascript", "programming"],
        materials: [
          { id: 1, name: "JavaScript Basics.pdf", type: "pdf", url: "#" },
          { id: 2, name: "Code Examples.zip", type: "zip", url: "#" }
        ],
        createdAt: "2024-02-15T10:00:00.000Z"
      },
      {
        id: 2,
        title: "React Components Deep Dive",
        course: "Full Stack Web Development",
        instructor: "Arjun Kumar",
        description: "Advanced React components, hooks, state management, and best practices",
        duration: 120,
        maxStudents: 20,
        enrolledStudents: 15,
        tags: ["advanced", "react", "components"],
        materials: [
          { id: 3, name: "React Hooks Guide.pdf", type: "pdf", url: "#" }
        ],
        createdAt: "2024-02-16T14:00:00.000Z"
      },
      {
        id: 3,
        title: "Python Data Structures",
        course: "Python Programming",
        instructor: "Sneha Gupta",
        description: "Lists, dictionaries, sets, tuples and their practical applications",
        duration: 75,
        maxStudents: 30,
        enrolledStudents: 22,
        tags: ["intermediate", "python", "data-structures"],
        materials: [],
        createdAt: "2024-02-17T09:30:00.000Z"
      }
    ];

    const mockSchedules = [
      {
        id: 1,
        classId: 1,
        date: "2024-12-20",
        startTime: "10:00",
        endTime: "11:30",
        status: "scheduled",
        attendees: 18,
        room: "Virtual Room A",
        meetingLink: "https://meet.navgurukul.org/js-fundamentals"
      },
      {
        id: 2,
        classId: 2,
        date: "2024-12-21",
        startTime: "14:00",
        endTime: "16:00",
        status: "scheduled",
        attendees: 15,
        room: "Virtual Room B",
        meetingLink: "https://meet.navgurukul.org/react-deep-dive"
      },
      {
        id: 3,
        classId: 3,
        date: "2024-12-22",
        startTime: "09:30",
        endTime: "10:45",
        status: "scheduled",
        attendees: 22,
        room: "Lab 1, Bangalore Campus",
        meetingLink: "https://meet.navgurukul.org/python-data"
      },
      {
        id: 4,
        classId: 1,
        date: "2024-12-18",
        startTime: "10:00",
        endTime: "11:30",
        status: "completed",
        attendees: 17,
        room: "Virtual Room A",
        meetingLink: "https://meet.navgurukul.org/js-fundamentals"
      }
    ];

    setClasses(mockClasses);
    setSchedules(mockSchedules);
  }, []);

  const addClass = async (classData) => {
    setLoading(true);
    try {
      const newClass = {
        id: Date.now(),
        ...classData,
        enrolledStudents: 0,
        createdAt: new Date().toISOString()
      };
      setClasses(prev => [...prev, newClass]);
      return { success: true, class: newClass };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (classId, updates) => {
    setLoading(true);
    try {
      setClasses(prev => prev.map(cls => 
        cls.id === classId ? { ...cls, ...updates } : cls
      ));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (classId) => {
    setLoading(true);
    try {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
      setSchedules(prev => prev.filter(schedule => schedule.classId !== classId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const scheduleClass = async (scheduleData) => {
    setLoading(true);
    try {
      const newSchedule = {
        id: Date.now(),
        ...scheduleData,
        status: 'scheduled',
        attendees: 0
      };
      setSchedules(prev => [...prev, newSchedule]);
      return { success: true, schedule: newSchedule };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (scheduleId, updates) => {
    setLoading(true);
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
      ));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    setLoading(true);
    try {
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addClassMaterial = (classId, material) => {
    setClasses(prev => prev.map(cls => 
      cls.id === classId 
        ? { ...cls, materials: [...(cls.materials || []), material] }
        : cls
    ));
  };

  const removeClassMaterial = (classId, materialId) => {
    setClasses(prev => prev.map(cls => 
      cls.id === classId 
        ? { ...cls, materials: cls.materials?.filter(m => m.id !== materialId) || [] }
        : cls
    ));
  };

  const value = {
    classes,
    schedules,
    loading,
    error,
    addClass,
    updateClass,
    deleteClass,
    scheduleClass,
    updateSchedule,
    deleteSchedule,
    addClassMaterial,
    removeClassMaterial
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}; 