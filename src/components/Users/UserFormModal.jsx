import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';
import { createUser, updateUser, fetchRoles } from '../../api/users';

export default function UserFormModal({ isOpen, onClose, userToEdit, onSuccess }) {
  const isEdit = Boolean(userToEdit?._id || userToEdit?.id);
  const fileInputRef = useRef(null);

  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    eng_name: '',
    kh_name: '',
    email: '',
    phone_number: '',
    gender: 'Male',
    dob: '',
    emp_code: '',
    emp_id: '',
    supervisor_code: '',
    job_title: '',
    dept_name: '',
    sect_name: '',
    working_status: 'WORKING',
    role_keyword: '',
    password: '',
    confirm_password: '',
    reset_password: false,
    new_password: '',
    roles: [],
    face_photo: '',
  });

  // Load available system roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await fetchRoles();
        if (Array.isArray(res.data)) {
          setAvailableRoles(res.data);
        }
      } catch (err) {
        console.error('Failed to load system roles:', err);
      }
    };
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  // Populate form when editing or clear when adding
  useEffect(() => {
    if (userToEdit && isEdit) {
      setFormData({
        name: userToEdit.name || userToEdit.username || '',
        eng_name: userToEdit.eng_name || '',
        kh_name: userToEdit.kh_name || '',
        email: userToEdit.email || '',
        phone_number: userToEdit.phone_number || '',
        gender: userToEdit.gender || 'Male',
        dob: userToEdit.dob ? userToEdit.dob.substring(0, 10) : '',
        emp_code: userToEdit.emp_code || '',
        emp_id: userToEdit.emp_id || userToEdit.emp_code || '',
        supervisor_code: userToEdit.supervisor_code || '',
        job_title: userToEdit.job_title || '',
        dept_name: userToEdit.dept_name || '',
        sect_name: userToEdit.sect_name || '',
        working_status: (userToEdit.working_status || 'WORKING').toUpperCase(),
        role_keyword: userToEdit.role_keyword || '',
        password: '',
        confirm_password: '',
        reset_password: false,
        new_password: '',
        roles: Array.isArray(userToEdit.roles) ? userToEdit.roles : [],
        face_photo: userToEdit.face_photo || '',
      });
    } else {
      setFormData({
        name: '',
        eng_name: '',
        kh_name: '',
        email: '',
        phone_number: '',
        gender: 'Male',
        dob: '',
        emp_code: '',
        emp_id: '',
        supervisor_code: '',
        job_title: '',
        dept_name: '',
        sect_name: '',
        working_status: 'WORKING',
        role_keyword: '',
        password: '',
        confirm_password: '',
        reset_password: false,
        new_password: '',
        roles: [],
        face_photo: '',
      });
    }
  }, [userToEdit, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      const updatedRoles = exists
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles: updatedRoles };
    });
  };

  // Picture handling (Convert to base64)
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, face_photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setFormData((prev) => ({ ...prev, face_photo: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter Name / Username.' });
      return;
    }
    if (!formData.emp_code.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter Employee Code.' });
      return;
    }

    if (!isEdit) {
      if (!formData.password) {
        Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter Default Password.' });
        return;
      }
      if (formData.password !== formData.confirm_password) {
        Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match.' });
        return;
      }
    } else {
      if (formData.reset_password && !formData.new_password) {
        Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter a New Password.' });
        return;
      }
    }

    setLoading(true);
    try {
      if (isEdit) {
        const userId = userToEdit._id || userToEdit.id;
        await updateUser(userId, formData);
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'User profile and role assignments updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createUser(formData);
        Swal.fire({
          icon: 'success',
          title: 'User Created',
          text: 'New user added successfully to the database.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: isEdit ? 'Update Failed' : 'Creation Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {isEdit ? 'Update User' : 'Add User'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto space-y-8">
          {/* Employee Photo Section */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Employee Photo
            </span>
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-md flex items-center justify-center mb-4">
                {formData.face_photo ? (
                  <img
                    src={formData.face_photo}
                    alt="Employee"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center rounded-full text-slate-400">
                    <svg
                      className="w-16 h-16 text-amber-500/80"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  Select Picture
                </button>
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Clear Photo
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields: 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isEdit ? 'Name' : 'Username'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                English Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eng_name"
                value={formData.eng_name}
                onChange={handleChange}
                placeholder="Enter English name"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Khmer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kh_name"
                value={formData.kh_name}
                onChange={handleChange}
                placeholder="Enter Khmer name"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Phone Number (optional)
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Gender (optional)
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Date of Birth (optional)
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Employee Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emp_code"
                value={formData.emp_code}
                onChange={handleChange}
                placeholder="00000"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emp_id"
                value={formData.emp_id}
                onChange={handleChange}
                placeholder="TL01"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Supervisor Code (optional)
              </label>
              <input
                type="text"
                name="supervisor_code"
                value={formData.supervisor_code}
                onChange={handleChange}
                placeholder="00000"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Job Title (optional)
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Department Name (optional)
              </label>
              <input
                type="text"
                name="dept_name"
                value={formData.dept_name}
                onChange={handleChange}
                placeholder="Enter department name"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Row 5 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Section Name (optional)
              </label>
              <input
                type="text"
                name="sect_name"
                value={formData.sect_name}
                onChange={handleChange}
                placeholder="Enter section name"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {isEdit ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Working Status (optional)
                </label>
                <select
                  name="working_status"
                  value={formData.working_status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="WORKING">WORKING</option>
                  <option value="RESIGNED">RESIGNED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Role Keyword (optional)
                </label>
                <input
                  type="text"
                  name="role_keyword"
                  value={formData.role_keyword}
                  onChange={handleChange}
                  placeholder="Add New Keyword"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {isEdit ? (
              <div className="flex flex-col justify-end">
                <div className="flex items-center gap-3 py-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="reset_password"
                      checked={formData.reset_password}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Reset Password
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Default Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Conditional Password Fields */}
          {isEdit && formData.reset_password && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full max-w-sm px-3.5 py-2.5 text-xs rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Enter confirm password"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Working Status (optional)
                </label>
                <select
                  name="working_status"
                  value={formData.working_status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="WORKING">WORKING</option>
                  <option value="RESIGNED">RESIGNED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>
          )}

          {/* Role Checkboxes Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
              Role <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {availableRoles.map((roleName) => {
                const checked = formData.roles.includes(roleName);
                return (
                  <label
                    key={roleName}
                    className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleRoleToggle(roleName)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    />
                    <span className={checked ? 'font-bold text-blue-600 dark:text-blue-400' : ''}>
                      {roleName}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

