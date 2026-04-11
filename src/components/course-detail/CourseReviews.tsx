/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

interface CourseReviewsProps {
  courseId: string;
  averageRating?: number;
  totalReviews?: number;
  reviews?: Review[];
}

export const CourseReviews = ({
  averageRating = 4.5,
  totalReviews = 127,
  reviews,
}: CourseReviewsProps) => {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  // Mock data if no reviews provided
  const defaultReviews: Review[] = [
    {
      id: '1',
      userName: 'Nguyễn Văn A',
      userAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0f172a&color=fff',
      rating: 5,
      comment:
        'Khóa học rất chi tiết và thực tế. Giảng viên giải thích rất dễ hiểu, đặc biệt phần về Microservices và Message Queue. Tôi đã áp dụng được ngay vào dự án công ty.',
      createdAt: '2026-04-05',
      helpful: 24,
    },
    {
      id: '2',
      userName: 'Trần Thị B',
      userAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=3b82f6&color=fff',
      rating: 4,
      comment:
        'Nội dung hay nhưng hơi nhanh ở phần Caching. Mong có thêm bài tập thực hành về Redis.',
      createdAt: '2026-04-03',
      helpful: 12,
    },
    {
      id: '3',
      userName: 'Lê Văn C',
      userAvatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=10b981&color=fff',
      rating: 5,
      comment:
        'Xuất sắc! Đây là khóa học System Design tốt nhất tôi từng học. Case study thực tế rất bổ ích.',
      createdAt: '2026-04-01',
      helpful: 18,
    },
  ];

  const displayReviews = reviews || defaultReviews;

  // Rating distribution (mock data)
  const ratingDistribution = [
    { stars: 5, count: 85, percentage: 67 },
    { stars: 4, count: 28, percentage: 22 },
    { stars: 3, count: 10, percentage: 8 },
    { stars: 2, count: 3, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-sm';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star ${sizeClass} ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <section id="reviews" className="scroll-mt-20">
      <h2 className="mb-6 text-lg font-bold text-slate-800">Đánh giá từ học viên</h2>

      <div className="card border border-gray-200 p-6">
        {/* Rating Summary */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
          {/* Overall Rating */}
          <div className="flex flex-col items-center rounded-lg bg-slate-50 p-6 md:w-64">
            <div className="mb-2 text-5xl font-bold text-slate-800">{averageRating}</div>
            {renderStars(Math.round(averageRating), 'lg')}
            <div className="mt-2 text-sm text-slate-500">{totalReviews} đánh giá</div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="mb-2 flex items-center gap-3">
                <div className="flex w-16 items-center gap-1 text-sm font-medium text-slate-700">
                  {renderStars(item.stars, 'sm')}
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-xs text-slate-500">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between border-t border-gray-200 pt-6">
          <h3 className="text-sm font-bold text-slate-800">Tất cả đánh giá</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                sortBy === 'recent'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mới nhất
            </button>
            <button
              onClick={() => setSortBy('helpful')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                sortBy === 'helpful'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hữu ích nhất
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayReviews.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Chưa có đánh giá nào cho khóa học này
            </div>
          ) : (
            displayReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="mb-3 flex items-start gap-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800">{review.userName}</h4>
                      <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                    </div>
                    {renderStars(review.rating, 'sm')}
                  </div>
                </div>

                <p className="mb-3 text-[13px] leading-relaxed text-slate-600">{review.comment}</p>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-700">
                    <i className="fa-regular fa-thumbs-up"></i>
                    Hữu ích ({review.helpful})
                  </button>
                  <button className="text-xs text-slate-500 transition-colors hover:text-slate-700">
                    Báo cáo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {displayReviews.length > 0 && (
          <div className="mt-6 text-center">
            <button className="text-primary hover:bg-primary-bg rounded-lg px-6 py-2 text-sm font-semibold transition-colors">
              Xem thêm đánh giá
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
