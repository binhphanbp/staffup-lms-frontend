/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  instructor?: string;
  rating?: number;
  totalStudents?: number;
  duration?: string;
  level?: string;
}

interface RelatedCoursesProps {
  courses?: Course[];
}

export const RelatedCourses = ({ courses }: RelatedCoursesProps) => {
  // Mock data if no courses provided
  const defaultCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced Kubernetes Deployment',
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
      instructor: 'Nguyễn Văn A',
      rating: 4.8,
      totalStudents: 234,
      duration: '10h 30m',
      level: 'Advanced',
    },
    {
      id: '2',
      title: 'Microservices với Spring Boot',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
      instructor: 'Trần Thị B',
      rating: 4.6,
      totalStudents: 189,
      duration: '8h 15m',
      level: 'Intermediate',
    },
    {
      id: '3',
      title: 'Redis Caching Strategies',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      instructor: 'Lê Văn C',
      rating: 4.7,
      totalStudents: 156,
      duration: '6h 45m',
      level: 'Intermediate',
    },
    {
      id: '4',
      title: 'Message Queue với Kafka',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      instructor: 'Phạm Thị D',
      rating: 4.9,
      totalStudents: 201,
      duration: '9h 20m',
      level: 'Advanced',
    },
  ];

  const displayCourses = courses || defaultCourses;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star text-xs ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <section className="scroll-mt-20">
      <h2 className="mb-6 text-lg font-bold text-slate-800">Khóa học liên quan</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {displayCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/detail?id=${course.id}`}
            className="card group overflow-hidden border border-gray-200 transition-shadow hover:shadow-lg"
          >
            {/* Thumbnail */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  {course.title}
                </div>
              )}
              {course.level && (
                <div className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                  {course.level}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-sm font-bold text-slate-800 transition-colors">
                {course.title}
              </h3>

              {course.instructor && (
                <div className="mb-2 text-xs text-slate-500">{course.instructor}</div>
              )}

              <div className="mb-3 flex items-center gap-2">
                {course.rating && (
                  <>
                    <span className="text-sm font-bold text-slate-800">{course.rating}</span>
                    {renderStars(Math.round(course.rating))}
                    {course.totalStudents && (
                      <span className="text-xs text-slate-400">({course.totalStudents})</span>
                    )}
                  </>
                )}
              </div>

              {course.duration && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <i className="fa-regular fa-clock"></i>
                  {course.duration}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
