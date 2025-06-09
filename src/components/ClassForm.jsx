import React, { useState, useEffect } from 'react';
import { useClasses } from '../context/ClassContext';
import { useStudents } from '../context/StudentContext';
import DocumentUpload from './DocumentUpload';

const ClassForm = ({ editingClass, onCancel, onSubmit }) => {
  const { addClass, updateClass, addClassMaterial, removeClassMaterial } = useClasses();
  const { courses } = useStudents();
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    instructor: '',
    description: '',
    duration: 60,
    maxStudents: 20,
    tags: ''
  });
  const [materials, setMaterials] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingClass) {
      setFormData({
        title: editingClass.title || '',
        course: editingClass.course || '',
        instructor: editingClass.instructor || '',
        description: editingClass.description || '',
        duration: editingClass.duration || 60,
        maxStudents: editingClass.maxStudents || 20,
        tags: editingClass.tags?.join(', ') || ''
      });
      setMaterials(editingClass.materials || []);
    }
  }, [editingClass]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Class title is required';
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Class description is required';
    }

    if (!formData.duration || formData.duration < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
    }

    if (!formData.maxStudents || formData.maxStudents < 1) {
      newErrors.maxStudents = 'Max students must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const classData = {
      ...formData,
      duration: parseInt(formData.duration),
      maxStudents: parseInt(formData.maxStudents),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      materials: materials
    };

    let result;
    if (editingClass) {
      result = await updateClass(editingClass.id, classData);
    } else {
      result = await addClass(classData);
    }

    if (result.success) {
      onSubmit && onSubmit();
    }

    setIsSubmitting(false);
  };

  const handleAddMaterial = (classId, material) => {
    const newMaterial = {
      ...material,
      id: Date.now() + Math.random()
    };
    setMaterials(prev => [...prev, newMaterial]);
    
    if (editingClass) {
      addClassMaterial(editingClass.id, newMaterial);
    }
  };

  const handleRemoveMaterial = (classId, materialId) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    
    if (editingClass) {
      removeClassMaterial(editingClass.id, materialId);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      course: '',
      instructor: '',
      description: '',
      duration: 60,
      maxStudents: 20,
      tags: ''
    });
    setMaterials([]);
    setErrors({});
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingClass ? '✏️ Edit Class' : '➕ Create New Class'}
          </h2>
          <p className="text-gray-600 mt-1">
            {editingClass ? 'Update class information and materials' : 'Add a new class to the NavGurukul curriculum'}
          </p>
        </div>
        
        {editingClass && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Class Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Class Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., JavaScript Fundamentals"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Course Selection */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.course ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
            {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course}</p>}
          </div>

          {/* Instructor */}
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
              Instructor *
            </label>
            <input
              id="instructor"
              name="instructor"
              type="text"
              required
              value={formData.instructor}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.instructor ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Instructor name"
            />
            {errors.instructor && <p className="mt-1 text-sm text-red-600">{errors.instructor}</p>}
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="15"
              max="300"
              required
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.duration ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="60"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
          </div>

          {/* Max Students */}
          <div>
            <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Students *
            </label>
            <input
              id="maxStudents"
              name="maxStudents"
              type="number"
              min="1"
              max="100"
              required
              value={formData.maxStudents}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.maxStudents ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="20"
            />
            {errors.maxStudents && <p className="mt-1 text-sm text-red-600">{errors.maxStudents}</p>}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., beginner, javascript, programming"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Class Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe what students will learn in this class..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Class Materials */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">📚 Class Materials</h3>
          <DocumentUpload
            studentId={editingClass?.id || 'new-class'}
            documents={materials}
            onDocumentAdd={handleAddMaterial}
            onDocumentRemove={handleRemoveMaterial}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {!editingClass && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>
              {isSubmitting 
                ? (editingClass ? 'Updating...' : 'Creating...') 
                : (editingClass ? 'Update Class' : 'Create Class')
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm; 