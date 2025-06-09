import React from 'react';

const StudentCard = ({ student, onEdit, onDelete, onScheduleMeeting }) => {
  const { name, email, course, profileImage, createdAt, documents = [] } = student;

  // Default avatar if no profile image
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=100`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="student-card bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6 fade-in hover:shadow-xl transition-all duration-300">
      {/* Header with Avatar and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={profileImage || defaultAvatar}
            alt={`${name}'s profile`}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <p className="text-gray-600 text-sm">{email}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(student)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors duration-200"
            title="Edit Student"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {onScheduleMeeting && (
            <button
              onClick={onScheduleMeeting}
              className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors duration-200"
              title="Schedule Meeting"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors duration-200"
            title="Delete Student"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Course Information */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📚 {course}
          </span>
          {documents.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              📎 {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
            </span>
          )}
        </div>
      </div>

      {/* Footer with Join Date */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Joined: {formatDate(createdAt)}</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard; 