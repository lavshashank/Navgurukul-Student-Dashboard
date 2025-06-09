import React, { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import DocumentUpload from './DocumentUpload';

const StudentForm = ({ editingStudent, onCancel, onSubmit }) => {
  const { courses, addStudent, updateStudent, addDocument, removeDocument } = useStudents();
  
  // 🔹 CONTROLLED FORM STATE - React Hook demonstration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    profileImage: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        course: editingStudent.course || '',
        profileImage: editingStudent.profileImage || ''
      });
    }
  }, [editingStudent]);

  // 🔹 EMAIL VALIDATION using Regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 🔹 FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Course validation
    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    // Profile image validation (optional but if provided, should be valid URL)
    if (formData.profileImage && !isValidUrl(formData.profileImage)) {
      newErrors.profileImage = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle input changes - Controlled Components
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await addStudent(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        course: '',
        profileImage: ''
      });
      
      // Call parent callback
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      course: '',
      profileImage: ''
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
        </h2>
        {editingStudent && (
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Cancel Edit"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`
              form-input w-full px-4 py-3 border rounded-lg
              ${errors.name ? 'border-red-300' : 'border-gray-300'}
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            `}
            placeholder="Enter student's full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`
              form-input w-full px-4 py-3 border rounded-lg
              ${errors.email ? 'border-red-300' : 'border-gray-300'}
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            `}
            placeholder="student@university.edu"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Course Selection */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={`
              form-input w-full px-4 py-3 border rounded-lg
              ${errors.course ? 'border-red-300' : 'border-gray-300'}
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            `}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.name}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.course}
            </p>
          )}
        </div>

        {/* Profile Image URL */}
        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image URL (Optional)
          </label>
          <input
            type="url"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            className={`
              form-input w-full px-4 py-3 border rounded-lg
              ${errors.profileImage ? 'border-red-300' : 'border-gray-300'}
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            `}
            placeholder="https://example.com/profile-image.jpg"
          />
          {errors.profileImage && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.profileImage}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to use a generated avatar based on the student's name
          </p>
        </div>

        {/* Document Upload Section */}
        {editingStudent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documents
            </label>
            <DocumentUpload
              studentId={editingStudent.id}
              documents={editingStudent.documents || []}
              onDocumentAdd={addDocument}
              onDocumentRemove={removeDocument}
            />
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200
              ${isSubmitting 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              editingStudent ? 'Update Student' : 'Add Student'
            )}
          </button>
          
          {editingStudent && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm; 