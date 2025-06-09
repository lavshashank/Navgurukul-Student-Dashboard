import React, { useState, useEffect, useCallback } from 'react';
import { useStudents } from '../context/StudentContext';
import StudentCard from './StudentCard';
import Loader from './Loader';
import ConfirmationModal from './ConfirmationModal';
import MeetScheduler from './MeetScheduler';

const StudentList = ({ onEdit }) => {
  const { students, deleteStudent, loading, error } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterByCourse, setFilterByCourse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });
  const [meetingModal, setMeetingModal] = useState({ isOpen: false, student: null });
  const [meetings, setMeetings] = useState([]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterByCourse, sortBy]);

  // Get unique courses for filter dropdown
  const uniqueCourses = [...new Set(students.map(student => student.course))];

  // Filter and search students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesCourse = filterByCourse === '' || student.course === filterByCourse;
    
    return matchesSearch && matchesCourse;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'course':
        return a.course.localeCompare(b.course);
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, endIndex);

  const handleDelete = (student) => {
    setDeleteModal({ isOpen: true, student });
  };

  const confirmDelete = async () => {
    if (deleteModal.student) {
      await deleteStudent(deleteModal.student.id);
      setDeleteModal({ isOpen: false, student: null });
    }
  };

  const handleScheduleMeeting = (student) => {
    setMeetingModal({ isOpen: true, student });
  };

  const scheduleMeeting = (meeting) => {
    setMeetings(prev => [...prev, meeting]);
    setMeetingModal({ isOpen: false, student: null });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFilterByCourse('');
    setSortBy('name');
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            currentPage === i
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return (
      <div className="flex items-center justify-center space-x-1 mt-8">
        {pages}
      </div>
    );
  };

  if (loading) {
    return <Loader text="Loading students..." />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl shadow-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Students</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              👥 Students ({students.length})
            </h2>
            <p className="text-gray-600">
              {filteredStudents.length !== students.length && 
                `Showing ${filteredStudents.length} of ${students.length} students`
              }
            </p>
          </div>
          
          {students.length > 0 && (
            <button
              onClick={clearFilters}
              className="lg:self-start px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search and Filter Controls */}
        {students.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students by name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <div className="absolute right-3 top-2.5 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {searchTerm !== debouncedSearchTerm ? 'Typing...' : 'Searching'}
                  </div>
                )}
              </div>
            </div>

            {/* Course Filter */}
            <div className="md:w-48">
              <select
                value={filterByCourse}
                onChange={(e) => setFilterByCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="course">Sort by Course</option>
                <option value="date">Sort by Date Added</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Students Grid */}
      {students.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Students Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Get started by adding your first student using the form above. You can track their information, courses, and more.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-blue-800 text-sm font-medium">
                💡 Tip: Use the "Add New Student" form to create your first entry
              </p>
            </div>
          </div>
        </div>
      ) : sortedStudents.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-500 mb-4">
            No students match your current search and filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {paginatedStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={onEdit}
                onDelete={() => handleDelete(student)}
                onScheduleMeeting={() => handleScheduleMeeting(student)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}

      {/* Results Summary */}
      {students.length > 0 && sortedStudents.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            {searchTerm || filterByCourse ? (
              <>
                Showing {Math.min(itemsPerPage, sortedStudents.length - startIndex)} of {sortedStudents.length} students
                {searchTerm && ` matching "${searchTerm}"`}
                {filterByCourse && ` in ${filterByCourse}`}
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </>
            ) : (
              <>
                Showing {Math.min(itemsPerPage, students.length - startIndex)} of {students.length} students
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </>
            )}
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, student: null })}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteModal.student?.name}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Meeting Scheduler Modal */}
      {meetingModal.isOpen && (
        <MeetScheduler
          student={meetingModal.student}
          onClose={() => setMeetingModal({ isOpen: false, student: null })}
          onSchedule={scheduleMeeting}
        />
      )}
    </div>
  );
};

export default StudentList; 