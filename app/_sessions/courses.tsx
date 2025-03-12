'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { SessionData } from '@/auth/auth';
import { Star, Heart, MessageSquare, MoreVertical } from 'lucide-react';
import getConsumer from "@/lib/cable";
import { GrAnnounce } from "react-icons/gr";

interface CoursesPageProps {
  sessionData: SessionData;
}

interface Course {
  id: number;
  title: string;
  code: string;
  notifications: boolean;
  color: string;
  category: string;
  starred: boolean;
}

export default function CoursesPage({ sessionData }: CoursesPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionData?.user?.accessToken}`,
          },
        });
        setCourses(response.data.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensures WebSockets only run on the client

    if (!sessionData?.user) return;

    const consumer = getConsumer();
    socketRef.current = consumer.subscriptions.create(
      { channel: "NotificationChannel", course_id: 1 },
      {
        connected() {
          setIsConnected(true);
          console.log("Connected to NotificationChannel");
        },
        disconnected() {
          setIsConnected(false);
          console.log("Disconnected from NotificationChannel");
        },
        received(data: any) {
          console.log("Received:", data);
        },
      }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.unsubscribe();
      }
    };
  }, [sessionData?.user]); // Run only when `sessionData.user` is available

  return (
    <main className="flex-1 px-4">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow">
            {/* Course Header */}
            <div className={`bg-green-500 p-3 relative`}>
              <img
                src="/images.png"
                alt="Course Thumbnail"
                className="w-full h-40 object-cover"
              />
              <button className="absolute top-2 right-2 p-1 bg-white bg-opacity-20 rounded-full text-white">
                {course.starred ? <Star size={16} fill="white" /> : <Star size={16} />}
              </button>
              <div className={`text-xs font-medium text-white mb-1`}>
                {course.category}
              </div>
              <div className={`text-sm bg-green-500`}>
                {course.title}
              </div>
              <div className={`text-xs text-white mt-1`}>
                {course.code}
              </div>
            </div>

            {/* Course Actions */}
            <div className="flex items-center justify-between p-2">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                  <GrAnnounce size={16} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                  <Heart size={16} />
                </button>
              </div>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
