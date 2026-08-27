import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FolderTree, Plus, Edit2, Trash2, BookOpen, Save, X } from 'lucide-react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../redux/slices/adminSlice';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, actionLoading } = useSelector((state) => state.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('BookOpen');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'BookOpen');
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      dispatch(
        updateCategory({
          id: editingCategory._id,
          data: { name: name.trim(), description, icon }
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Category updated');
          setIsModalOpen(false);
          dispatch(fetchCategories());
        })
        .catch((err) => {
          toast.error(err || 'Failed to update category');
        });
    } else {
      dispatch(
        createCategory({
          name: name.trim(),
          description,
          icon
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Category created successfully');
          setIsModalOpen(false);
          dispatch(fetchCategories());
        })
        .catch((err) => {
          toast.error(err || 'Failed to create category');
        });
    }
  };

  const handleDeleteCategory = (id, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      dispatch(deleteCategory(id))
        .unwrap()
        .then(() => {
          toast.success('Category removed');
          dispatch(fetchCategories());
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete category');
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Manage Book Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize book catalog genres and customer navigation tags
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <Loader message="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-white">{cat.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-700 text-amber-300 text-[11px] font-bold">
                    {cat.bookCount || 0} books
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fiction"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of books in this genre..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-full transition-all"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
