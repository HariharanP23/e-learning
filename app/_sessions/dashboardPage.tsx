'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  ChevronDown, 
  User, 
  LogOut, 
  Plus,
} from 'lucide-react';
import LeftSidebar from './leftSidebar';
import CoursesPage from './courses';
import { SessionData } from '@/auth/auth';
import axios from 'axios';

interface DashboardPageProps {
  sessionData: SessionData;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function DashboardPage({ sessionData }: DashboardPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review project proposal', completed: false },
    { id: 2, text: 'Schedule team meeting', completed: true },
    { id: 3, text: 'Update client documentation', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionData?.user?.accessToken}`,
          },
        });
        setAnnouncements(response.data.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []); 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <span className="mr-1">EN</span>
                  <ChevronDown size={16} />
                </button>
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</button>
                  </div>
                )}
              </div>
              
              {/* User Profile */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <span className="text-sm font-medium">{sessionData?.user?.name?.slice(0, 2)}</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{sessionData?.user?.name}</div>
                    <div className="text-xs text-gray-500">{sessionData?.user?.role}</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} className="mr-2" />
                      Your Profile
                    </Link>
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <Link href="/logout" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          <CoursesPage sessionData={sessionData}/>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-80 bg-white border-l border-gray-200 p-5 overflow-y-auto">
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Recent Announcements</h3>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-800">{announcement.title}</h4>
                  <p className="text-xs text-gray-500">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">To-Do List</h3>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 py-1 px-2 rounded">
                  {todos.filter(t => t.completed).length}/{todos.length} Done
                </span>
              </div>
              
              <form onSubmit={addTodo} className="flex mb-4">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="flex-1 border rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 focus:outline-none"
                >
                  <Plus size={18} />
                </button>
              </form>
              
              <div className="space-y-2">
                {todos.map(todo => (
                  <div 
                    key={todo.id} 
                    className={`flex items-center p-3 rounded-lg border ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded mr-3"
                    />
                    <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {todo.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}