import React from 'react';

const DoctorSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Section - Doctor Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* Avatar skeleton */}
            <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0"></div>

            <div className="flex-1 space-y-3">
              {/* Name skeleton */}
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>

              {/* Specialty skeleton */}
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>

              {/* Rating, time, location skeleton */}
              <div className="flex flex-wrap gap-3">
                <div className="h-3.5 bg-gray-200 rounded w-24"></div>
                <div className="h-3.5 bg-gray-200 rounded w-20"></div>
                <div className="h-3.5 bg-gray-200 rounded w-28"></div>
              </div>

              {/* Diseases skeleton */}
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Fee & Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="text-right w-full sm:w-auto">
            <div className="h-3 bg-gray-200 rounded w-20 mx-auto sm:mx-0 mb-1"></div>
            <div className="h-7 bg-gray-200 rounded w-24 mx-auto sm:mx-0"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-full sm:w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSkeleton;