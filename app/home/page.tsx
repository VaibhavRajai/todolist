"use client"
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
interface Task {
  id: string;
  name: string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
}
const initialState: TaskState = {
  tasks: [],
};
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        name: action.payload,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});
const { addTask, removeTask } = taskSlice.actions;
const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
const Navigation: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'History', id: 'history' },
    { name: 'Profile', id: 'profile' },
  ];
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">TaskApp</h1>
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
          </div>
          <div className="md:hidden flex items-center">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
const TaskForm: React.FC = () => {
  const [taskName, setTaskName] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      dispatch(addTask(taskName.trim()));
      setTaskName('');
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};
const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
const handleRemoveTask = (taskId: string) => {
    dispatch(removeTask(taskId));
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        All Tasks ({tasks.length})
      </h2>    
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No tasks added yet</p>
          <p className="text-gray-400 text-sm mt-2">Add your first task using the form above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">{task.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {formatDate(task.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleRemoveTask(task.id)}
                className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const HomeTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Task Manager</h1>
        <p className="text-lg text-gray-600">
          Organize your tasks efficiently with our simple task management system
        </p>
      </div>
      
      <TaskForm />
      <TaskList />
    </div>
  );
};
const HistoryTab: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Task History</h1>
        <p className="text-lg text-gray-600">
          View all your tasks and their creation timeline
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Task Timeline ({tasks.length} total)
        </h2>      
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No task history available</p>
            <p className="text-gray-400 text-sm mt-2">Start by adding some tasks on the home page</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">{task.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Created on {formatDate(task.createdAt)}
                    </p>
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
  const getTotalTasks = () => tasks.length;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Profile</h1>
        <p className="text-lg text-gray-600">
          Your task management statistics and information
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
              <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-600">{getTotalTasks()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Today</h3>
              <p className="text-3xl font-bold text-green-600">{getTasksToday()}</p>
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
              <h3 className="text-lg font-medium text-gray-900">This Week</h3>
              <p className="text-3xl font-bold text-purple-600">{getTasksThisWeek()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <p className="text-lg text-gray-900">John Doe</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-lg text-gray-900">john.doe@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <p className="text-lg text-gray-900">January 2024</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
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
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};
const TaskManagementApp: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default TaskManagementApp;