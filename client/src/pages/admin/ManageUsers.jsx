import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Shield, ShieldOff, Trash2, Search, CheckCircle, Ban } from 'lucide-react';
import { fetchAdminUsers, updateUserStatus, deleteUser } from '../../redux/slices/adminSlice';
import Pagination from '../../components/Pagination';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, usersPage, usersTotalPages, loading } = useSelector(
    (state) => state.admin
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search: searchTerm,
        role: roleFilter,
        page: 1,
        limit: 10
      })
    );
  }, [searchTerm, roleFilter, dispatch]);

  const handleToggleBlock = (user) => {
    if (user._id === userInfo._id) {
      toast.error('You cannot block your own admin account');
      return;
    }

    const newBlockedState = !user.isBlocked;
    dispatch(updateUserStatus({ userId: user._id, isBlocked: newBlockedState }))
      .unwrap()
      .then(() => {
        toast.success(`User ${newBlockedState ? 'blocked' : 'unblocked'} successfully`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to update user');
      });
  };

  const handleToggleRole = (user) => {
    if (user._id === userInfo._id) {
      toast.error('You cannot change your own role');
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    dispatch(updateUserStatus({ userId: user._id, role: newRole }))
      .unwrap()
      .then(() => {
        toast.success(`User role updated to ${newRole}`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to update user role');
      });
  };

  const handleDeleteUser = (userId, name) => {
    if (userId === userInfo._id) {
      toast.error('You cannot delete your own admin account');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          toast.success('User account deleted');
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete user');
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            User Accounts Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer profiles, security privileges, and account status
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Roles</option>
          <option value="user">Customers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12">
            <Loader message="Loading users..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700 text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-600"
                        />
                        <span className="font-bold text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={u._id === userInfo?._id}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-300'
                        } ${u._id !== userInfo?._id ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                        title="Click to toggle role"
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          u.isBlocked
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u._id !== userInfo?._id && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleBlock(u)}
                            className={`p-1.5 rounded-lg ${
                              u.isBlocked
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-amber-400 hover:bg-amber-500/10'
                            }`}
                            title={u.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {u.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        page={usersPage}
        pages={usersTotalPages}
        onPageChange={(p) =>
          dispatch(fetchAdminUsers({ search: searchTerm, role: roleFilter, page: p, limit: 10 }))
        }
      />
    </div>
  );
};

export default ManageUsers;
