import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, ShoppingBag, Heart, PackageX, SearchX, ArrowRight } from 'lucide-react';

const icons = {
  books: BookX,
  cart: ShoppingBag,
  wishlist: Heart,
  orders: PackageX,
  search: SearchX
};

const EmptyState = ({
  type = 'books',
  title = 'No items found',
  description = 'We could not find anything matching your request.',
  actionText = 'Explore Books',
  actionLink = '/books',
  onActionClick
}) => {
  const IconComponent = icons[type] || BookX;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-brand-100/70 border border-brand-200 flex items-center justify-center text-brand-600 mb-5 shadow-inner">
        <IconComponent className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="font-serif font-bold text-xl text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-700/20 transition-all hover:scale-105"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            onClick={onActionClick}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-700/20 transition-all hover:scale-105"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
