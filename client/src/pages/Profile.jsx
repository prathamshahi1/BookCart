import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, MapPin, Trash2, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { updateProfile, addAddress, removeAddress } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrFullName, setAddrFullName] = useState(userInfo?.name || '');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostal, setAddrPostal] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setAvatar(userInfo.avatar || '');
    }
  }, [userInfo]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const payload = { name, email, avatar };
    if (password) {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      payload.password = password;
    }

    dispatch(updateProfile(payload))
      .unwrap()
      .then(() => {
        toast.success('Profile details updated successfully');
        setPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        toast.error(err || 'Failed to update profile');
      });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrFullName || !addrPhone || !addrLine || !addrCity || !addrState || !addrPostal) {
      toast.error('Please fill in all address fields');
      return;
    }

    dispatch(
      addAddress({
        fullName: addrFullName,
        phone: addrPhone,
        addressLine: addrLine,
        city: addrCity,
        state: addrState,
        postalCode: addrPostal,
        country: 'India'
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Address saved');
        setIsAddingAddress(false);
        setAddrLine('');
        setAddrCity('');
        setAddrState('');
        setAddrPostal('');
      })
      .catch((err) => {
        toast.error(err || 'Failed to add address');
      });
  };

  const handleDeleteAddress = (id) => {
    dispatch(removeAddress(id))
      .unwrap()
      .then(() => {
        toast.success('Address removed');
      });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal information, security credentials, and shipping addresses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Profile Update Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-brand-200/80 shadow-xs space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-300 shadow-md"
            />
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">{name}</h2>
              <span className="text-xs text-slate-400 block">{email}</span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-100 text-brand-800">
                {userInfo?.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-brand-50/50 border border-brand-200 rounded-xl text-xs"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-brand-50/50 border border-brand-200 rounded-xl text-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-brand-50/50 border border-brand-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-brand-50/50 border border-brand-200 rounded-xl text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {password && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-brand-50/50 border border-brand-200 rounded-xl text-xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-all"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Shipping Addresses */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-brand-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-brand-700" />
              <h2 className="font-serif font-bold text-base text-slate-900">Saved Addresses</h2>
            </div>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {/* Add Address Form */}
          {isAddingAddress && (
            <form onSubmit={handleAddAddress} className="p-4 bg-brand-50/50 rounded-2xl border border-brand-200 space-y-3">
              <h3 className="font-bold text-xs text-slate-800">Add New Shipping Address</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={addrFullName}
                  onChange={(e) => setAddrFullName(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Street Address / House No."
                required
                value={addrLine}
                onChange={(e) => setAddrLine(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-xs"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={addrState}
                  onChange={(e) => setAddrState(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  required
                  value={addrPostal}
                  onChange={(e) => setAddrPostal(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-700 text-white rounded-lg text-xs font-bold hover:bg-brand-800"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List Saved Addresses */}
          <div className="space-y-3">
            {userInfo?.addresses && userInfo.addresses.length > 0 ? (
              userInfo.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{addr.fullName}</span>
                    <p className="text-xs text-slate-600 mt-0.5">{addr.addressLine}</p>
                    <p className="text-xs text-slate-600">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Phone: {addr.phone}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No saved addresses yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
