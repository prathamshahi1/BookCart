import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, text, numReviews, interactive = false, onRatingChange, size = 'sm' }) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex items-center space-x-0.5">
        {stars.map((star) => {
          const isFilled = value >= star;
          const isHalf = value >= star - 0.5 && value < star;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'
              }`}
            >
              <Star
                className={`${starSize} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {text && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {text}
        </span>
      )}

      {numReviews !== undefined && (
        <span className="text-xs text-slate-400">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default Rating;
