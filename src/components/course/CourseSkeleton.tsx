import React from 'react';

export const CourseSkeleton = () => {
  return (
    <div className="card flex h-[300px] flex-col p-4">
      <div className="skeleton mb-4 h-[120px] w-full flex-shrink-0 rounded-lg"></div>
      <div className="skeleton mb-3 h-3 w-16 rounded"></div>
      <div className="skeleton mb-2 h-4 w-full rounded"></div>
      <div className="skeleton mb-4 h-4 w-3/4 rounded"></div>
      <div className="skeleton mt-auto mb-1.5 h-2 w-full rounded"></div>
      <div className="skeleton mb-4 h-2 w-5/6 rounded"></div>
      <div className="my-2 h-px w-full bg-gray-100"></div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-6 rounded-full"></div>
          <div className="skeleton h-2 w-14 rounded"></div>
        </div>
        <div className="skeleton h-2 w-10 rounded"></div>
      </div>
    </div>
  );
};
