import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserMain as User } from './dbController.js';

/**
 * Get all users with optional search filter
 */
export const getUsers = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    let filter = {};

    if (search && search.trim()) {
      // When searching: search across ALL users (working and non-working)
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      filter = {
        $or: [
          { name: regex },
          { username: regex },
          { emp_code: regex },
          { emp_id: regex },
          { email: regex },
          { eng_name: regex },
          { kh_name: regex },
          { dept_name: regex },
          { job_title: regex },
          { working_status: regex },
        ],
      };
    } else {
      // DEFAULT: only display users with status 'WORKING'
      filter = {
        $or: [
          { working_status: { $regex: /^working$/i } },
          { status: { $regex: /^working$/i } },
          { working_status: { $exists: false } },
          { working_status: null },
          { working_status: '' },
        ],
      };
    }

    // Pagination for high performance (prevents browser freeze on 10,000+ records)
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-password')
        .sort({ created_at: -1, _id: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: err.message,
    });
  }
};

/**
 * Get single user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving user.', error: err.message });
  }
};

/**
 * Create a new user
 */
export const createUser = async (req, res) => {
  try {
    const {
      name,
      username,
      eng_name,
      kh_name,
      email,
      phone_number,
      gender,
      dob,
      emp_code,
      emp_id,
      supervisor_code,
      job_title,
      dept_name,
      sect_name,
      role_keyword,
      default_password,
      password,
      working_status,
      roles,
      face_photo,
    } = req.body;

    const displayName = name || username;
    const finalPassword = password || default_password || '123456';

    if (!displayName) {
      return res.status(400).json({ success: false, message: 'Name/Username is required.' });
    }

    // Check if emp_code already exists
    if (emp_code) {
      const existing = await User.findOne({ emp_code: String(emp_code).trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: `Employee Code ${emp_code} is already registered.` });
      }
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const newUser = new User({
      name: displayName,
      username: username || displayName,
      eng_name: eng_name || displayName,
      kh_name: kh_name || '',
      email: email || '',
      phone_number: phone_number || '',
      gender: gender || 'Male',
      dob: dob || null,
      emp_code: emp_code ? String(emp_code).trim() : '',
      emp_id: emp_id ? String(emp_id).trim() : (emp_code || ''),
      supervisor_code: supervisor_code || '',
      job_title: job_title || '',
      dept_name: dept_name || '',
      sect_name: sect_name || '',
      role_keyword: role_keyword || '',
      working_status: (working_status || 'Working').toUpperCase(),
      roles: Array.isArray(roles) ? roles : [],
      face_photo: face_photo || '',
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newUser.save();

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: safeUser,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user.',
      error: err.message,
    });
  }
};

/**
 * Update existing user
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password reset requested
    if (updateData.reset_password && updateData.new_password) {
      updateData.password = await bcrypt.hash(updateData.new_password, 10);
    } else {
      delete updateData.password;
    }
    delete updateData.reset_password;
    delete updateData.new_password;

    updateData.updated_at = new Date();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updatedUser,
    });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user.',
      error: err.message,
    });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
      error: err.message,
    });
  }
};

/**
 * Get available system roles from role_managements collection
 */
export const getRoles = async (req, res) => {
  try {
    let rolesData = [];

    // Check possible role collection names
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const roleCol = collections.find((c) =>
      ['role_managements', 'rolemanagement', 'role_management', 'roles'].includes(c.name.toLowerCase())
    );

    if (roleCol) {
      rolesData = await db.collection(roleCol.name).find({}).toArray();
    }

    // Default fallback roles matching the screenshots and modules config
    const defaultRoleNames = [
      'Superadmin',
      'Super Admin',
      'Admin',
      'Head Department',
      'Assistant: Support Ticket',
      'Dashboard',
      'Tuya',
      'YAI',
      'GA Main',
      'Energy',
      'MR Clerk',
      'Document Translation',
      'Legacy TP',
      'Color Bank',
      'Translator',
      'Production Clerk',
    ];

    let extractedRoles = [];
    if (rolesData.length > 0) {
      rolesData.forEach((item) => {
        if (item.role) extractedRoles.push(item.role);
        else if (item.name) extractedRoles.push(item.name);
      });
    }

    // Merge and deduplicate
    const finalRoles = Array.from(new Set([...extractedRoles, ...defaultRoleNames])).filter(Boolean);

    return res.status(200).json({
      success: true,
      data: finalRoles,
      roleManagement: rolesData,
    });
  } catch (err) {
    console.error('Error fetching roles:', err);
    return res.status(200).json({
      success: true,
      data: [
        'Superadmin',
        'Admin',
        'Head Department',
        'Assistant: Support Ticket',
        'Dashboard',
        'Tuya',
        'YAI',
        'GA Main',
        'Energy',
        'MR Clerk',
        'Document Translation',
        'Legacy TP',
        'Color Bank',
        'Translator',
      ],
    });
  }
};

