import jwt from 'jsonwebtoken';
import { UserMain as User } from './dbController.js';
import config from '../config/env.js';

const JWT_SECRET = config.jwtSecret || 'techsamp_secret_key_2026';

/**
 * Handle User Login
 * Accepts name or emp_code as username, and password
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username (Name or Employee Code) and password.',
      });
    }

    const cleanUsername = String(username).trim();

    // Query User by exact emp_code, name, or username (case-sensitive)
    const user = await User.findOne({
      $or: [
        { emp_code: cleanUsername },
        { name: cleanUsername },
        { username: cleanUsername },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee Code/Name or password.',
      });
    }

    // Enforce strict case-sensitive matching in JavaScript for username/emp_code
    const isExactUsernameMatch =
      user.emp_code === cleanUsername ||
      user.name === cleanUsername ||
      user.username === cleanUsername;

    if (!isExactUsernameMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee Code/Name or password.',
      });
    }

    // Verify Password (strictly case-sensitive)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee Code/Name or password.',
      });
    }

    // Create JWT Token
    const payload = {
      id: user._id,
      emp_code: user.emp_code,
      name: user.name,
      eng_name: user.eng_name,
      roles: user.roles || [],
      dept_name: user.dept_name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Prepare safe user profile response
    const userProfile = {
      id: user._id,
      emp_code: user.emp_code,
      name: user.name,
      eng_name: user.eng_name,
      kh_name: user.kh_name,
      email: user.email,
      dept_name: user.dept_name,
      sect_name: user.sect_name,
      job_title: user.job_title,
      roles: user.roles || [],
      face_photo: user.face_photo,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('[Auth Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login authentication.',
      error: error.message,
    });
  }
};

/**
 * Get Current Authenticated User (Session verification)
 */
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

