import React, { useState, useEffect } from 'react';
import { useClasses } from '../context/ClassContext';

const ScheduleForm = ({ class: cls, onCancel, onSubmit, isOpen = false }) => {
  const { scheduleClass, updateSchedule, schedules } = useClasses();
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    room: '',
    meetingLink: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cls && isOpen) {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      setFormData({
        date: nextWeek.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: calculateEndTime('10:00', cls.duration),
        room: 'Virtual Room A',
        meetingLink: `https://meet.navgurukul.org/${cls.title.toLowerCase().replace(/\s+/g, '-')}`,
        notes: ''
      });
    }
  }, [cls, isOpen]);

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return endDate.toTimeString().slice(0, 5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newFormData = {
      ...formData,
      [name]: value
    };

    // Auto-calculate end time when start time or duration changes
    if (name === 'startTime' && cls) {
      newFormData.endTime = calculateEndTime(value, cls.duration);
    }

    setFormData(newFormData);
    
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

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'Room or location is required';
    }

    if (!formData.meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required';
    } else if (!isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL';
    }

    // Check for scheduling conflicts
    const conflictingSchedule = schedules.find(schedule => 
      schedule.date === formData.date &&
      schedule.room === formData.room &&
      isTimeOverlap(
        { start: schedule.startTime, end: schedule.endTime },
        { start: formData.startTime, end: formData.endTime }
      )
    );

    if (conflictingSchedule) {
      newErrors.room = `Room is already booked at this time for "${conflictingSchedule.classTitle}"`;
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

  const isTimeOverlap = (time1, time2) => {
    const start1 = timeToMinutes(time1.start);
    const end1 = timeToMinutes(time1.end);
    const start2 = timeToMinutes(time2.start);
    const end2 = timeToMinutes(time2.end);

    return start1 < end2 && start2 < end1;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const scheduleData = {
      classId: cls.id,
      ...formData
    };

    const result = await scheduleClass(scheduleData);

    if (result.success) {
      onSubmit && onSubmit(result.schedule);
    }

    setIsSubmitting(false);
  };

  const getRoomOptions = () => [
    'Virtual Room A',
    'Virtual Room B', 
    'Virtual Room C',
    'Lab 1, Bangalore Campus',
    'Lab 2, Bangalore Campus',
    'Conference Room, Delhi Campus',
    'Main Hall, Pune Campus',
    'Computer Lab, Mumbai Campus'
  ];

  if (!isOpen || !cls) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📅 Schedule Class</h2>
              <p className="text-gray-600 mt-1">Schedule "{cls.title}"</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Class Info */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{cls.course}</p>
                <p className="text-sm text-gray-600">
                  Instructor: {cls.instructor} • Duration: {cls.duration} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
              </div>
            </div>

            {/* End Time (auto-calculated) */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time * (Auto-calculated)
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50 ${
                  errors.endTime ? 'border-red-300' : 'border-gray-300'
                }`}
                readOnly
              />
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
            </div>

            {/* Room/Location */}
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                Room/Location *
              </label>
              <select
                id="room"
                name="room"
                required
                value={formData.room}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.room ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a room</option>
                {getRoomOptions().map((room) => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
              {errors.room && <p className="mt-1 text-sm text-red-600">{errors.room}</p>}
            </div>

            {/* Meeting Link */}
            <div>
              <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link *
              </label>
              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                required
                value={formData.meetingLink}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.meetingLink ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://meet.navgurukul.org/class-name"
              />
              {errors.meetingLink && <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Any additional notes for this class session..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>
                  {isSubmitting ? 'Scheduling...' : 'Schedule Class'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm; 