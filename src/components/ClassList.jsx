import React, { useState } from 'react';
import { useClasses } from '../context/ClassContext';
import ConfirmationModal from './ConfirmationModal';
import Loader from './Loader';

const ClassList = ({ onEdit, onSchedule }) => {
  const { classes, deleteClass, loading, error } = useClasses();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, class: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByCourse, setFilterByCourse] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // Get unique courses for filter dropdown
  const uniqueCourses = [...new Set(classes.map(cls => cls.course))];

  // Filter and search classes
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterByCourse === '' || cls.course === filterByCourse;
    
    return matchesSearch && matchesCourse;
  });

  // Sort classes
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'course':
        return a.course.localeCompare(b.course);
      case 'instructor':
        return a.instructor.localeCompare(b.instructor);
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'enrollment':
        return b.enrolledStudents - a.enrolledStudents;
      default:
        return 0;
    }
  });

  const handleDelete = (cls) => {
    setDeleteModal({ isOpen: true, class: cls });
  };

  const confirmDelete = async () => {
    if (deleteModal.class) {
      await deleteClass(deleteModal.class.id);
      setDeleteModal({ isOpen: false, class: null });
    }
  };

  const getEnrollmentColor = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterByCourse('');
    setSortBy('title');
  };

  if (loading) {
    return <Loader text="Loading classes..." />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl shadow-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Classes</h3>
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
              🎓 Classes ({classes.length})
            </h2>
            <p className="text-gray-600">
              {filteredClasses.length !== classes.length && 
                `Showing ${filteredClasses.length} of ${classes.length} classes`
              }
            </p>
          </div>
          
          {classes.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-orange-600 hover:text-orange-800 border border-orange-200 hover:border-orange-300 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Course Filter */}
          <select
            value={filterByCourse}
            onChange={(e) => setFilterByCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="title">Sort by Title</option>
            <option value="course">Sort by Course</option>
            <option value="instructor">Sort by Instructor</option>
            <option value="date">Sort by Created Date</option>
            <option value="enrollment">Sort by Enrollment</option>
          </select>

          {/* Add New Class Button */}
          <button
            onClick={() => onEdit && onEdit(null)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      {sortedClasses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {classes.length === 0 ? 'No Classes Yet' : 'No Classes Found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {classes.length === 0 
              ? 'Create your first class to get started with NavGurukul education.' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {classes.length === 0 && (
            <button
              onClick={() => onEdit && onEdit(null)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200"
            >
              Create First Class
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {sortedClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              class={cls}
              onEdit={onEdit}
              onDelete={handleDelete}
              onSchedule={onSchedule}
              getEnrollmentColor={getEnrollmentColor}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        type="danger"
        title="Delete Class"
        message={`Are you sure you want to delete "${deleteModal.class?.title}"? This action cannot be undone and will also remove all associated schedules.`}
        confirmText="Delete Class"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, class: null })}
      />
    </div>
  );
};

// Individual Class Card Component
const ClassCard = ({ class: cls, onEdit, onDelete, onSchedule, getEnrollmentColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{cls.title}</h3>
          <p className="text-sm text-orange-600 font-medium">{cls.course}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit && onEdit(cls)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Class"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete && onDelete(cls)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Class"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Instructor */}
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-sm text-gray-600">{cls.instructor}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cls.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{cls.duration}m</div>
          <div className="text-xs text-gray-500">Duration</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold px-2 py-1 rounded-lg ${getEnrollmentColor(cls.enrolledStudents, cls.maxStudents)}`}>
            {cls.enrolledStudents}/{cls.maxStudents}
          </div>
          <div className="text-xs text-gray-500">Students</div>
        </div>
      </div>

      {/* Tags */}
      {cls.tags && cls.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {cls.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {cls.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              +{cls.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Materials Count */}
      {cls.materials && cls.materials.length > 0 && (
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-gray-600">{cls.materials.length} materials</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onSchedule && onSchedule(cls)}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          📅 Schedule
        </button>
        <button
          onClick={() => onEdit && onEdit(cls)}
          className="flex-1 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
};

export default ClassList; 