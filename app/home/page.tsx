"use client"
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

interface Task {
  id: string;
  name: string;
  createdAt: string;
  taskDueDate: string;
  isCompleted: boolean;
}

interface TaskState {
  tasks: Task[];
  language: 'en' | 'hi';
}

const initialState: TaskState = {
  tasks: [],
  language: 'en',
};

const translations = {
  en: {
    taskApp: 'TaskApp',
    home: 'Home',
    history: 'History',
    profile: 'Profile',
    taskManager: 'Task Manager',
    // organizeEfficiently: 'Organize your tasks efficiently with our simple task management system',
    addNewTask: 'Add New Task',
    enterTaskName: 'Enter task name...',
    addTask: 'Add Task',
    allTasks: 'All Tasks',
    noTasksYet: 'No tasks added yet',
    addFirstTask: 'Add your first task using the form above',
    dueDate: 'Due Date',
    created: 'Created',
    done: 'Done',
    delete: 'Delete',
    taskHistory: 'Task History',
    viewAllTasks: 'View all your tasks and their creation timeline',
    taskTimeline: 'Task Timeline',
    total: 'total',
    noHistoryAvailable: 'No task history available',
    startAddingTasks: 'Start by adding some tasks on the home page',
    userProfile: 'User Profile',
    taskStatistics: 'Your task management statistics and information',
    totalTasks: 'Total Tasks',
    today: 'Today',
    thisWeek: 'This Week',
    userInformation: 'User Information',
    name: 'Name',
    email: 'Email',
    memberSince: 'Member Since',
    status: 'Status',
    active: 'Active',
    completedTasks: 'Completed Tasks',
    pendingTasks: 'Pending Tasks',
    loginRequired: 'Login Required',
    pleaseLogin: 'Please login to access this page',
    redirectingToLogin: 'Redirecting to login page...',
    logout: 'Logout'
  },
  hi: {
    taskApp: 'टास्क ऐप',
    home: 'होम',
    history: 'इतिहास',
    profile: 'प्रोफाइल',
    taskManager: 'टास्क मैनेजर',
    // organizeEfficiently: 'हमारे सरल टास्क मैनेजमेंट सिस्टम के साथ अपने कार्यों को कुशलता से व्यवस्थित करें',
    addNewTask: 'नया टास्क जोड़ें',
    enterTaskName: 'टास्क का नाम दर्ज करें...',
    addTask: 'टास्क जोड़ें',
    allTasks: 'सभी टास्क',
    noTasksYet: 'अभी तक कोई टास्क नहीं जोड़ा गया',
    addFirstTask: 'ऊपर दिए गए फॉर्म का उपयोग करके अपना पहला टास्क जोड़ें',
    dueDate: 'देय तिथि',
    created: 'बनाया गया',
    done: 'पूर्ण',
    delete: 'हटाएं',
    taskHistory: 'टास्क इतिहास',
    viewAllTasks: 'अपने सभी टास्क और उनकी निर्माण समयरेखा देखें',
    taskTimeline: 'टास्क समयरेखा',
    total: 'कुल',
    noHistoryAvailable: 'कोई टास्क इतिहास उपलब्ध नहीं',
    startAddingTasks: 'होम पेज पर कुछ टास्क जोड़कर शुरुआत करें',
    userProfile: 'उपयोगकर्ता प्रोफाइल',
    taskStatistics: 'आपकी टास्क मैनेजमेंट की आंकड़े और जानकारी',
    totalTasks: 'कुल टास्क',
    today: 'आज',
    thisWeek: 'इस सप्ताह',
    userInformation: 'उपयोगकर्ता जानकारी',
    name: 'नाम',
    email: 'ईमेल',
    memberSince: 'सदस्य बने',
    status: 'स्थिति',
    active: 'सक्रिय',
    completedTasks: 'पूर्ण टास्क',
    pendingTasks: 'लंबित टास्क',
    loginRequired: 'लॉगिन आवश्यक',
    pleaseLogin: 'इस पेज तक पहुंचने के लिए कृपया लॉगिन करें',
    redirectingToLogin: 'लॉगिन पेज पर रीडायरेक्ट कर रहे हैं...',
    logout: 'लॉगआउट'
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ name: string; dueDate: string }>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
        taskDueDate: action.payload.dueDate,
        isCompleted: false,
      };
      state.tasks.push(newTask);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.isCompleted = !task.isCompleted;
      }
    },
    setLanguage: (state, action: PayloadAction<'en' | 'hi'>) => {
      state.language = action.payload;
    },
  },
});

const { addTask, removeTask, toggleTaskCompletion, setLanguage } = taskSlice.actions;

const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

// Authentication check component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/'; // Assuming your login page is at root
        }, 2000);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated - show login required message
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full mx-4">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.loginRequired}</h2>
            <p className="text-gray-600 mb-4">{t.pleaseLogin}</p>
            <p className="text-sm text-gray-500">{t.redirectingToLogin}</p>
          </div>
          <div className="animate-pulse bg-gray-200 h-2 rounded-full">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
};

const LanguageSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.tasks.language);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => dispatch(setLanguage('en'))}
        className={`px-3 py-1 text-sm rounded ${
          language === 'en'
            ? 'bg-blue-700 text-white'
            : 'text-blue-100 hover:bg-blue-500'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => dispatch(setLanguage('hi'))}
        className={`px-3 py-1 text-sm rounded ${
          language === 'hi'
            ? 'bg-blue-700 text-white'
            : 'text-blue-100 hover:bg-blue-500'
        }`}
      >
        हिं
      </button>
    </div>
  );
};

const Navigation: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = '/'; // Redirect to login page
  };
  
  const navItems = [
    { name: t.home, id: 'home' },
    { name: t.history, id: 'history' },
    { name: t.profile, id: 'profile' },
  ];
  
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">{t.taskApp}</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              {t.logout}
            </button>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 bg-red-600 text-white rounded-md text-base font-medium hover:bg-red-700 transition-colors"
              >
                {t.logout}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const TaskForm: React.FC = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() && taskDate) {
      dispatch(addTask({ name: taskName.trim(), dueDate: taskDate }));
      setTaskName('');
      setTaskDate('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.addNewTask}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder={t.enterTaskName}
          className="flex-1 px-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
<input
  type="date"
  value={taskDate}
  onChange={(e) => setTaskDate(e.target.value)}
  min={new Date().toISOString().split("T")[0]}
  className="flex-1 px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
  required
/>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {t.addTask}
        </button>
      </form>
    </div>
  );
};

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];
  const dispatch = useDispatch();

  const handleRemoveTask = (taskId: string) => {
    dispatch(removeTask(taskId));
  };

  const handleToggleTask = (taskId: string) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t.allTasks} ({tasks.length})
      </h2>    
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">{t.noTasksYet}</p>
          <p className="text-gray-400 text-sm mt-2">{t.addFirstTask}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                task.isCompleted ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${task.isCompleted ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                  {task.name}
                </h3>
                <h3 className={`text-lg font-medium ${task.isCompleted ? 'text-green-600' : 'text-gray-800'}`}>
                  {t.dueDate}: {formatDueDate(task.taskDueDate)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t.created}: {formatDate(task.createdAt)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`px-3 py-1 rounded-md focus:ring-2 focus:ring-offset-2 transition-colors text-sm font-medium ${
                    task.isCompleted
                      ? 'bg-green-200 text-green-800 hover:bg-green-300 focus:ring-green-500'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                  }`}
                >
                  {t.done}
                </button>
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HomeTab: React.FC = () => {
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.taskManager}</h1>
        <p className="text-lg text-gray-600">
          {/* {t.organizeEfficiently} */}
        </p>
      </div>
      
      <TaskForm />
      <TaskList />
    </div>
  );
};

const HistoryTab: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.taskHistory}</h1>
        <p className="text-lg text-gray-600">
          {t.viewAllTasks}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t.taskTimeline} ({tasks.length} {t.total})
        </h2>      
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">{t.noHistoryAvailable}</p>
            <p className="text-gray-400 text-sm mt-2">{t.startAddingTasks}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-start space-x-4 p-4 border-l-4 rounded-r-lg ${
                    task.isCompleted 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium ${
                    task.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${task.isCompleted ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {task.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t.created} {formatDate(task.createdAt)}
                    </p>
                    {task.isCompleted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        {t.done}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileTab: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const language = useSelector((state: RootState) => state.tasks.language);
  const t = translations[language];
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  
  const getTotalTasks = () => tasks.length;
  const getCompletedTasks = () => tasks.filter(task => task.isCompleted).length;
  const getPendingTasks = () => tasks.filter(task => !task.isCompleted).length;
  
  const getTasksToday = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => new Date(task.createdAt).toDateString() === today).length;
  };
  
  const getTasksThisWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return tasks.filter(task => new Date(task.createdAt) >= oneWeekAgo).length;
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.userProfile}</h1>
        <p className="text-lg text-gray-600">
          {t.taskStatistics}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{t.totalTasks}</h3>
              <p className="text-3xl font-bold text-blue-600">{getTotalTasks()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{t.completedTasks}</h3>
              <p className="text-3xl font-bold text-green-600">{getCompletedTasks()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{t.pendingTasks}</h3>
              <p className="text-3xl font-bold text-orange-600">{getPendingTasks()}</p>
            </div>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{t.today}</h3>
              <p className="text-3xl font-bold text-purple-600">{getTasksToday()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{t.thisWeek}</h3>
              <p className="text-3xl font-bold text-indigo-600">{getTasksThisWeek()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.userInformation}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
            <p className="text-lg text-gray-900">{username || 'User'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
            <p className="text-lg text-gray-900">user@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberSince}</label>
            <p className="text-lg text-gray-900">January 2024</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.status}</label>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {t.active}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'history':
        return <HistoryTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
          {renderActiveTab()}
        </main>
      </div>
    </AuthGuard>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <TaskApp />
    </Provider>
  );
};

export default App;