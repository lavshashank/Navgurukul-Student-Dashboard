import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Student Context
const StudentContext = createContext();

// Custom hook to use the Student Context
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

// Student Provider Component
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📍 ASYNC/AWAIT & ERROR HANDLING DEMONSTRATION
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulating API call with json-server
      const response = await fetch('http://localhost:3001/courses');
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(`Failed to fetch courses: ${err.message}`);
      // Fallback to default courses if API fails
      setCourses([
        { id: 1, name: 'Computer Science', code: 'CS' },
        { id: 2, name: 'Mathematics', code: 'MATH' },
        { id: 3, name: 'Physics', code: 'PHYS' },
        { id: 4, name: 'Chemistry', code: 'CHEM' },
        { id: 5, name: 'Biology', code: 'BIO' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/students');
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(`Failed to fetch students: ${err.message}`);
      // Fallback to empty array if API fails
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new student
  const addStudent = async (studentData) => {
    try {
      const response = await fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...studentData,
          id: Date.now(), // Simple ID generation
          createdAt: new Date().toISOString(),
          documents: [], // Initialize empty documents array
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      const newStudent = await response.json();
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      console.error('Failed to add student:', err);
      // Fallback: add to local state only
      const newStudent = {
        ...studentData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        documents: [], // Initialize empty documents array
      };
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    }
  };

  // Update an existing student
  const updateStudent = async (id, studentData) => {
    try {
      const response = await fetch(`http://localhost:3001/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...studentData,
          id,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      const updatedStudent = await response.json();
      setStudents(prev => 
        prev.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      return updatedStudent;
    } catch (err) {
      console.error('Failed to update student:', err);
      // Fallback: update local state only
      const updatedStudent = {
        ...studentData,
        id,
        updatedAt: new Date().toISOString(),
      };
      setStudents(prev => 
        prev.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      return updatedStudent;
    }
  };

  // Delete a student
  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (err) {
      console.error('Failed to delete student:', err);
      // Fallback: remove from local state only
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  // Add document to student
  const addDocument = async (studentId, document) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const updatedDocuments = [...(student.documents || []), document];
      await updateStudent(studentId, { ...student, documents: updatedDocuments });
    } catch (err) {
      console.error('Failed to add document:', err);
    }
  };

  // Remove document from student
  const removeDocument = async (studentId, documentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const updatedDocuments = (student.documents || []).filter(doc => doc.id !== documentId);
      await updateStudent(studentId, { ...student, documents: updatedDocuments });
    } catch (err) {
      console.error('Failed to remove document:', err);
    }
  };

  // Schedule a meeting
  const scheduleMeeting = async (meetingData) => {
    try {
      const meeting = {
        ...meetingData,
        id: Date.now(),
        scheduledAt: new Date().toISOString(),
        status: 'scheduled'
      };
      setMeetings(prev => [...prev, meeting]);
      return meeting;
    } catch (err) {
      console.error('Failed to schedule meeting:', err);
      throw err;
    }
  };

  // Cancel a meeting
  const cancelMeeting = async (meetingId) => {
    try {
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === meetingId 
            ? { ...meeting, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : meeting
        )
      );
    } catch (err) {
      console.error('Failed to cancel meeting:', err);
    }
  };

  // Complete a meeting
  const completeMeeting = async (meetingId, notes = '') => {
    try {
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === meetingId 
            ? { 
                ...meeting, 
                status: 'completed', 
                completedAt: new Date().toISOString(),
                notes 
              }
            : meeting
        )
      );
    } catch (err) {
      console.error('Failed to complete meeting:', err);
    }
  };

  const value = {
    students,
    courses,
    meetings,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchCourses,
    fetchStudents,
    addDocument,
    removeDocument,
    scheduleMeeting,
    cancelMeeting,
    completeMeeting,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}; 