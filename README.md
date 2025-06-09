# 🎓 NavGurukul Student Management Dashboard

A comprehensive React application for managing NavGurukul students with authentication, class scheduling, document management, and analytics. Built with modern React practices and responsive design.

## ✨ Features

### 🔐 Authentication System
- **Login/Signup** with role-based access (Admin, Teacher, Student)
- **Campus Selection** from real NavGurukul locations
- **Session Management** with localStorage persistence
- **Password Reset** functionality

### 👥 Student Management
- **Add/Edit/Delete Students** with comprehensive forms
- **Advanced Search & Filter** by name, email, course, campus, batch
- **Document Upload** with drag-drop interface and file management
- **Progress Tracking** for course modules
- **Profile Images** and contact information

### 🎓 Class Management
- **Create/Edit Classes** with materials upload
- **Class Scheduling** with conflict detection
- **Instructor Assignment** and duration management
- **Enrollment Tracking** and capacity management
- **Tags and Categories** for organization

### 📊 Dashboard & Analytics
- **Live Statistics** with real-time data
- **Course Distribution** visualization
- **Recent Activity** tracking
- **Document Management** overview
- **Mobile-Responsive** design

### 📚 Document System
- **Upload Documents** with drag-drop
- **View Documents** in browser
- **File Type Support** (PDF, images, documents)
- **Organization** by student and class

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lavshashank/Navgurukul-Student-Dashboard.git
   cd "Student Dashbaord"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**

   **Option 1: Start both servers simultaneously**
   ```bash
   npm run dev
   ```

   **Option 2: Start servers separately (recommended for development)**
   
   **Terminal 1 - Start JSON Server (Backend API)**
   ```bash
   npm run server
   # Runs on http://localhost:3001
   # API endpoints available at /students, /courses, /classes, /schedules
   ```

   **Terminal 2 - Start React Development Server (Frontend)**
   ```bash
   npm start
   # Runs on http://localhost:3000
   # Will automatically open in your browser
   ```

4. **Access the application**
   - **Frontend Dashboard**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001 (shows available endpoints)

## 🔑 Demo Credentials

### Admin Access
- **Email**: admin@navgurukul.org
- **Password**: admin123
- **Campus**: Bangalore Campus
- **Role**: Administrator

### Teacher Access
- **Email**: teacher@navgurukul.org
- **Password**: teacher123
- **Campus**: Delhi Campus
- **Role**: Teacher

## 🏗️ Project Structure

```
Student Dashbaord/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.jsx      # Authentication wrapper
│   │   │   ├── Login.jsx         # Login form
│   │   │   └── Signup.jsx        # Registration form
│   │   ├── forms/
│   │   │   ├── StudentForm.jsx   # Student creation/editing
│   │   │   ├── ClassForm.jsx     # Class management
│   │   │   └── ScheduleForm.jsx  # Class scheduling
│   │   ├── lists/
│   │   │   ├── StudentList.jsx   # Student grid/table view
│   │   │   ├── ClassList.jsx     # Class management view
│   │   │   └── DocumentUpload.jsx # File management
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── Header.jsx        # Page header
│   │   │   └── Dashboard.jsx     # Main layout
│   │   └── ui/
│   │       ├── StatCard.jsx      # Statistics display
│   │       ├── Loader.jsx        # Loading states
│   │       └── ConfirmationModal.jsx # Action confirmations
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── StudentContext.jsx    # Student management
│   │   └── ClassContext.jsx      # Class & schedule management
│   ├── pages/
│   │   └── Dashboard.jsx         # Main application page
│   ├── App.jsx                   # Root component with routing
│   ├── index.js                  # Application entry point
│   └── index.css                 # Tailwind CSS styles
├── db.json                       # Mock database with NavGurukul data
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

## 🎯 Key Features

### 📱 Mobile-First Responsive Design
- **Hamburger Menu** for mobile navigation
- **Responsive Grid** layouts for all screen sizes
- **Touch-Friendly** buttons and interactions
- **Optimized** text sizes and spacing

### 🔍 Advanced Search & Filtering
- **Real-time Search** with 300ms debouncing
- **Multiple Filters** (course, campus, batch, status)
- **Smart Sorting** by various criteria
- **Live Results** as you type

### 📊 Real-Time Statistics
- **Student Count** with growth percentages
- **Course Enrollment** tracking
- **Recent Activity** monitoring
- **Document Management** stats

### 🗓️ Class Scheduling System
- **Conflict Detection** for room bookings
- **Auto-calculated** end times
- **Meeting Link** generation
- **Calendar Integration** ready

## 📖 API Endpoints

### Students
- `GET /students` - Retrieve all students
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Remove student

### Courses
- `GET /courses` - Get all courses
- `POST /courses` - Create new course

### Classes
- `GET /classes` - Retrieve all classes
- `POST /classes` - Create new class
- `PUT /classes/:id` - Update class
- `DELETE /classes/:id` - Remove class

### Schedules
- `GET /schedules` - Get all schedules
- `POST /schedules` - Create new schedule
- `PUT /schedules/:id` - Update schedule
- `DELETE /schedules/:id` - Remove schedule

## 🎨 UI/UX Features

### 🎯 Modern Design
- **NavGurukul Branding** with orange/red gradients
- **Card-based** layouts with shadows and hover effects
- **Smooth Animations** and transitions
- **Loading States** for better UX

### 📱 Mobile Optimization
- **Collapsible Sidebar** with overlay
- **Touch-friendly** buttons and forms
- **Responsive Tables** that adapt to small screens
- **Optimized Typography** for readability

### 🔄 Smooth Interactions
- **Optimistic Updates** for immediate feedback
- **Error Handling** with user-friendly messages
- **Confirmation Dialogs** for destructive actions
- **Auto-save** functionality where appropriate

## 🔧 Available Scripts

```bash
# Development
npm start          # Start React development server (port 3000)
npm run server     # Start JSON server API (port 3001)
npm run dev        # Start both servers simultaneously

# Production
npm run build      # Build optimized production bundle
npm run preview    # Preview production build locally

# Testing & Quality
npm test           # Run test suite
npm run test:watch # Run tests in watch mode
npm run lint       # Check code quality
```

## 🎓 Educational Value

This project demonstrates:

### ⚛️ Advanced React Patterns
- **Context API** for global state management
- **Custom Hooks** for reusable logic
- **Compound Components** for flexible APIs
- **Error Boundaries** for graceful failure handling

### 🚀 Modern JavaScript
- **Async/Await** patterns with proper error handling
- **ES6+ Features** (destructuring, spread, modules)
- **Event Handling** and form management
- **Array Methods** for data manipulation

### 🎨 Professional UI Development
- **Responsive Design** with Tailwind CSS
- **Component Architecture** with separation of concerns
- **State Management** patterns
- **Performance Optimization** techniques

## 📚 Learning Resources

For detailed explanations and mentoring guidance, see:
- [**Mentoring Guide**](./MENTORING_GUIDE.md) - Comprehensive learning resource
- [**Component Documentation**](./docs/COMPONENTS.md) - Individual component guides
- [**API Reference**](./docs/API.md) - Backend integration details

## 🌐 Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🎯 Perfect For

- **React Learning** and advanced concepts
- **Full-Stack Development** understanding
- **UI/UX Design** implementation
- **Student Portfolio** projects
- **Mentoring & Teaching** React development
- **Code Reviews** and best practices demonstration

---

**Built with ❤️ for NavGurukul students and educators** 