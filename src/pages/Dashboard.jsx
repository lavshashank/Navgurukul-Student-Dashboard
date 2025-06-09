import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import ClassForm from '../components/ClassForm';
import ClassList from '../components/ClassList';
import ScheduleForm from '../components/ScheduleForm';
import { useStudents } from '../context/StudentContext';
import { useClasses } from '../context/ClassContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [schedulingClass, setSchedulingClass] = useState(null);
  const { students, courses, loading, error } = useStudents();
  const { classes } = useClasses();

  // Statistics calculations
  const totalStudents = students.length;
  const uniqueCourses = [...new Set(students.map(student => student.course))].length;
  const recentStudents = students.filter(student => {
    const createdDate = new Date(student.createdAt);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return createdDate >= lastWeek;
  }).length;

  const totalDocuments = students.reduce((total, student) => {
    return total + (student.documents?.length || 0);
  }, 0);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setActiveTab('students');
  };

  const handleFormSubmit = () => {
    setEditingStudent(null);
  };

  const handleCancel = () => {
    setEditingStudent(null);
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls);
    setActiveTab('classes');
  };

  const handleScheduleClass = (cls) => {
    setSchedulingClass(cls);
  };

  const handleScheduleSubmit = (schedule) => {
    setSchedulingClass(null);
    // Optionally show success message
  };

  const handleScheduleCancel = () => {
    setSchedulingClass(null);
  };

  const handleClassFormSubmit = () => {
    setEditingClass(null);
  };

  const handleClassCancel = () => {
    setEditingClass(null);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview students={students} courses={courses} loading={loading} />;
      case 'students':
        return (
          <div className="space-y-6">
            <StudentForm
              editingStudent={editingStudent}
              onCancel={handleCancel}
              onSubmit={handleFormSubmit}
            />
            <StudentList onEdit={handleEdit} />
          </div>
        );
      case 'courses':
        return <CoursesView courses={courses} students={students} />;
      case 'classes':
        return (
          <div className="space-y-6">
            <ClassForm
              editingClass={editingClass}
              onCancel={handleClassCancel}
              onSubmit={handleClassFormSubmit}
            />
            <ClassList 
              onEdit={handleEditClass} 
              onSchedule={handleScheduleClass}
            />
          </div>
        );
      case 'documents':
        return <DocumentsView students={students} />;
      case 'analytics':
        return <AnalyticsView students={students} />;
      default:
        return <DashboardOverview students={students} courses={courses} loading={loading} />;
    }
  };

  const getTabInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Welcome back! Here\'s what\'s happening with your students.'
        };
      case 'students':
        return {
          title: 'Students',
          subtitle: `Manage your ${totalStudents} students and their information.`
        };
      case 'courses':
        return {
          title: 'Courses',
          subtitle: `Overview of ${uniqueCourses} active courses in your system.`
        };
      case 'classes':
        return {
          title: 'Classes',
          subtitle: `Manage ${classes.length} classes and their schedules.`
        };
      case 'documents':
        return {
          title: 'Documents',
          subtitle: `Manage ${totalDocuments} student documents and files.`
        };
      case 'analytics':
        return {
          title: 'Analytics',
          subtitle: 'Insights and statistics about your students and courses.'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome back! Here\'s what\'s happening with your students.'
        };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header title={tabInfo.title} subtitle={tabInfo.subtitle} activeTab={activeTab} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl shadow-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">API Connection Issue</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      <p className="mt-1">The app will continue to work locally. Start json-server for full functionality.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {getTabContent()}

            {/* Schedule Modal */}
            <ScheduleForm
              class={schedulingClass}
              isOpen={!!schedulingClass}
              onSubmit={handleScheduleSubmit}
              onCancel={handleScheduleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ students, courses, loading }) => {
  const totalStudents = students.length;
  const uniqueCourses = [...new Set(students.map(student => student.course))].length;
  const recentStudents = students.filter(student => {
    const createdDate = new Date(student.createdAt);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return createdDate >= lastWeek;
  }).length;

  const totalDocuments = students.reduce((total, student) => {
    return total + (student.documents?.length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="NavGurukul Students"
          value={loading ? '...' : totalStudents}
          change={15.8}
          trend="up"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Tech Programs"
          value={loading ? '...' : uniqueCourses}
          change={25.0}
          trend="up"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
        
        <StatCard
          title="New Admissions"
          value={loading ? '...' : recentStudents}
          change={32.4}
          trend="up"
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
        
        <StatCard
          title="Documents"
          value={loading ? '...' : totalDocuments}
          change={15.3}
          trend="up"
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Students */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
          </div>
          
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3b82f6&color=ffffff&size=40`}
                  alt={student.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.course}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  {student.documents?.length > 0 && (
                    <span className="text-xs text-gray-500">{student.documents.length} docs</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Distribution</h3>
          
          <div className="space-y-4">
            {courses.slice(0, 6).map((course) => {
              const studentCount = students.filter(s => s.course === course.name).length;
              const percentage = totalStudents > 0 ? (studentCount / totalStudents) * 100 : 0;
              
              return (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{course.name}</span>
                    <span className="text-sm text-gray-500">{studentCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Additional tab components
const CoursesView = ({ courses, students }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">All Courses</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const studentCount = students.filter(s => s.course === course.name).length;
        return (
          <div key={course.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
            <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
            <p className="text-sm text-gray-500 mb-3">{course.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {course.code}
              </span>
              <span className="text-sm text-gray-600">{studentCount} students</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const DocumentsView = ({ students }) => {
  const allDocuments = students.flatMap(student => 
    (student.documents || []).map(doc => ({ ...doc, studentName: student.name, studentId: student.id }))
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">All Documents ({allDocuments.length})</h3>
      {allDocuments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allDocuments.map((doc) => (
            <div key={`${doc.studentId}-${doc.id}`} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <span className="text-lg">📄</span>
              <div>
                <p className="font-medium text-gray-900">{doc.name}</p>
                <p className="text-sm text-gray-500">Uploaded by {doc.studentName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AnalyticsView = ({ students }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Analytics</h3>
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-500">Analytics dashboard coming soon...</p>
      </div>
    </div>
  </div>
);

export default Dashboard; 