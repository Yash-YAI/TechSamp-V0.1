import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { RoleManagement, UserMain as User } from './dbController.js';

const JWT_SECRET = config.jwtSecret || 'techsamp_secret_key_2026';

/**
 * Get all roles from TTS database (role_management collection)
 */
export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleManagement.find({}).lean();
    return res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching role management:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch roles', error: error.message });
  }
};

/**
 * Search roles in role_management
 */
export const searchRoles = async (req, res) => {
  try {
    const { query = '', type = 'role' } = req.query;
    if (!query.trim()) {
      const all = await RoleManagement.find({}).lean();
      return res.status(200).json(all);
    }

    const regex = new RegExp(query.trim(), 'i');
    let filter = {};

    switch (type) {
      case 'role':
        filter = { role: regex };
        break;
      case 'emp_id':
        filter = { 'users.emp_id': regex };
        break;
      case 'name':
        filter = {
          $or: [
            { 'users.name': regex },
            { 'users.eng_name': regex },
            { 'users.kh_name': regex },
          ],
        };
        break;
      case 'job_title':
        filter = {
          $or: [
            { jobTitles: regex },
            { 'users.job_title': regex },
          ],
        };
        break;
      default:
        filter = {
          $or: [
            { role: regex },
            { jobTitles: regex },
            { 'users.emp_id': regex },
            { 'users.name': regex },
            { 'users.eng_name': regex },
          ],
        };
    }

    const matched = await RoleManagement.find(filter).lean();
    return res.status(200).json(matched);
  } catch (error) {
    console.error('Error searching role management:', error);
    return res.status(500).json({ success: false, message: 'Failed to search roles', error: error.message });
  }
};

/**
 * Save or update role assignment
 */
export const saveRoleAssignment = async (req, res) => {
  try {
    const { role, jobTitles = [], selectedUsers = [] } = req.body;

    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const cleanRole = role.trim();
    const normalizedRole = cleanRole.toLowerCase();

    // Admin user CANNOT assign another admin or super admin!
    // Admin and Super Admin roles can ONLY be assigned by Super Admin!
    if (normalizedRole === 'admin' || normalizedRole === 'super admin') {
      let isCallerSuperAdmin = false;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET);
          if (decoded && decoded.id) {
            const caller = await User.findById(decoded.id).lean();
            if (caller) {
              const callerRoles = [
                ...(Array.isArray(caller.roles) ? caller.roles : []),
                caller.role,
              ]
                .filter(Boolean)
                .map((r) => String(r).toLowerCase());

              isCallerSuperAdmin = callerRoles.some(
                (r) => r === 'super admin' || r.includes('super admin') || r.includes('superadmin') || r.includes('developer')
              );
            }
          }
        } catch (err) {
          console.warn('Caller token verification failed in saveRoleAssignment:', err.message);
        }
      }

      if (!isCallerSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only Super Admin can assign or modify Admin and Super Admin roles.',
        });
      }
    }

    // 1. Fetch user details from UserMain database for selectedUsers emp_ids
    const usersInDb = await User.find({
      $or: [
        { emp_code: { $in: selectedUsers } },
        { emp_id: { $in: selectedUsers } },
      ],
    }).lean();

    // Also look up users by selected jobTitles if needed
    let jobTitleUsers = [];
    if (jobTitles.length > 0) {
      jobTitleUsers = await User.find({
        job_title: { $in: jobTitles },
        $or: [
          { working_status: { $regex: /^working$/i } },
          { status: { $regex: /^working$/i } },
          { working_status: { $exists: false } },
          { working_status: null },
        ],
      }).lean();
    }

    // Merge and deduplicate by emp_id
    const userMap = new Map();
    [...usersInDb, ...jobTitleUsers].forEach((u) => {
      const empId = u.emp_code || u.emp_id || String(u._id);
      if (selectedUsers.includes(empId) || jobTitles.includes(u.job_title)) {
        userMap.set(empId, {
          emp_id: empId,
          name: u.name || u.username || '',
          eng_name: u.eng_name || u.name || '',
          kh_name: u.kh_name || '',
          job_title: u.job_title || '',
          dept_name: u.dept_name || '',
          sect_name: u.sect_name || '',
          working_status: u.working_status || 'Working',
          phone_number: u.phone_number || '',
          face_photo: u.face_photo || '',
        });
      }
    });

    const populatedUsers = Array.from(userMap.values());

    // 2. Save or update role in TTS database (role_management collection)
    const updatedRoleDoc = await RoleManagement.findOneAndUpdate(
      { role: cleanRole },
      {
        role: cleanRole,
        jobTitles: Array.isArray(jobTitles) ? jobTitles : [],
        users: populatedUsers,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 3. Sync role back to User collection (users database)
    const targetEmpCodes = populatedUsers.map((u) => u.emp_id);

    // Add role to assigned users
    if (targetEmpCodes.length > 0) {
      await User.updateMany(
        {
          $or: [
            { emp_code: { $in: targetEmpCodes } },
            { emp_id: { $in: targetEmpCodes } },
          ],
        },
        { $addToSet: { roles: cleanRole } }
      );
    }

    // Remove role from users who had this role previously but are no longer in this role
    await User.updateMany(
      {
        roles: cleanRole,
        emp_code: { $nin: targetEmpCodes },
        emp_id: { $nin: targetEmpCodes },
      },
      { $pull: { roles: cleanRole } }
    );

    return res.status(200).json({
      success: true,
      message: 'Role assignment saved successfully',
      data: updatedRoleDoc,
    });
  } catch (error) {
    console.error('Error saving role assignment:', error);
    return res.status(500).json({ success: false, message: 'Failed to save role assignment', error: error.message });
  }
};

/**
 * Get distinct job titles from users database
 */
export const getJobTitles = async (req, res) => {
  try {
    const titles = await User.distinct('job_title', {
      job_title: { $exists: true, $ne: '' },
    });
    const cleanTitles = titles.filter(Boolean).sort();
    return res.status(200).json(cleanTitles);
  } catch (error) {
    console.error('Error getting job titles:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch job titles' });
  }
};

/**
 * Get users by job title
 */
export const getUsersByJobTitle = async (req, res) => {
  try {
    const { jobTitle } = req.query;
    if (!jobTitle) {
      return res.status(400).json({ success: false, message: 'jobTitle query param required' });
    }

    const users = await User.find({
      job_title: jobTitle,
    })
      .select('-password')
      .lean();

    const formatted = users.map((u) => ({
      emp_id: u.emp_code || u.emp_id,
      name: u.name || u.username,
      eng_name: u.eng_name || u.name,
      kh_name: u.kh_name || '',
      job_title: u.job_title,
      dept_name: u.dept_name,
      sect_name: u.sect_name,
      working_status: u.working_status || 'Working',
      face_photo: u.face_photo || '',
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error getting users by job title:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users by job title' });
  }
};

/**
 * Search users for role assignment
 */
export const searchUsersForRoles = async (req, res) => {
  try {
    const { term = '' } = req.query;
    if (!term.trim()) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(term.trim(), 'i');
    const users = await User.find({
      $or: [
        { name: regex },
        { eng_name: regex },
        { kh_name: regex },
        { emp_code: regex },
        { emp_id: regex },
        { job_title: regex },
      ],
    })
      .select('-password')
      .limit(30)
      .lean();

    const formatted = users.map((u) => ({
      emp_id: u.emp_code || u.emp_id,
      name: u.name || u.username,
      eng_name: u.eng_name || u.name,
      kh_name: u.kh_name || '',
      job_title: u.job_title,
      dept_name: u.dept_name,
      sect_name: u.sect_name,
      working_status: u.working_status || 'Working',
      face_photo: u.face_photo || '',
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error searching users for roles:', error);
    return res.status(500).json({ success: false, message: 'Failed to search users' });
  }
};

/**
 * Get user by employee ID
 */
export const getUserByEmpId = async (req, res) => {
  try {
    const { emp_id } = req.query;
    if (!emp_id) {
      return res.status(400).json({ success: false, message: 'emp_id is required' });
    }

    const u = await User.findOne({
      $or: [{ emp_code: emp_id.trim() }, { emp_id: emp_id.trim() }],
    })
      .select('-password')
      .lean();

    if (!u) {
      return res.status(404).json(null);
    }

    return res.status(200).json({
      emp_id: u.emp_code || u.emp_id,
      name: u.name || u.username,
      eng_name: u.eng_name || u.name,
      kh_name: u.kh_name || '',
      job_title: u.job_title,
      dept_name: u.dept_name,
      sect_name: u.sect_name,
      working_status: u.working_status || 'Working',
      face_photo: u.face_photo || '',
    });
  } catch (error) {
    console.error('Error fetching user by emp_id:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

/**
 * Get roles for a specific user by emp_id
 */
export const getUserRoles = async (req, res) => {
  try {
    const { empId } = req.params;
    const u = await User.findOne({
      $or: [{ emp_code: empId }, { emp_id: empId }],
    }).lean();

    const userRoles = u?.roles || [];
    return res.status(200).json({ emp_id: empId, roles: userRoles });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user roles' });
  }
};

/**
 * Buyer Groups stub endpoints (supports Buyer Groups tab)
 */
export const getBuyers = async (req, res) => {
  return res.status(200).json({
    success: true,
    buyers: ['NIKE', 'ADIDAS', 'PUMA', 'UNDER_ARMOUR', 'LULULEMON', 'DECATHLON', 'GAP'],
  });
};

export const getBuyerUsers = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const filter = search.trim()
      ? {
          $or: [
            { name: new RegExp(search.trim(), 'i') },
            { eng_name: new RegExp(search.trim(), 'i') },
            { emp_code: new RegExp(search.trim(), 'i') },
          ],
        }
      : {};

    const users = await User.find(filter).select('-password').limit(50).lean();
    const formatted = users.map((u) => ({
      emp_id: u.emp_code || u.emp_id,
      name: u.name || u.username,
      eng_name: u.eng_name || u.name,
      job_title: u.job_title || 'N/A',
      dept_name: u.dept_name || 'N/A',
      sect_name: u.sect_name || 'N/A',
      face_photo: u.face_photo || '',
      buyers: u.buyers || [],
    }));

    return res.status(200).json({ success: true, users: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveBuyerGroup = async (req, res) => {
  try {
    const { buyerName, empIds = [] } = req.body;
    if (!buyerName) {
      return res.status(400).json({ success: false, message: 'buyerName is required' });
    }

    // Add buyerName to assigned users
    if (empIds.length > 0) {
      await User.updateMany(
        { $or: [{ emp_code: { $in: empIds } }, { emp_id: { $in: empIds } }] },
        { $addToSet: { buyers: buyerName } }
      );
    }

    // Remove buyerName from unassigned users
    await User.updateMany(
      {
        buyers: buyerName,
        emp_code: { $nin: empIds },
        emp_id: { $nin: empIds },
      },
      { $pull: { buyers: buyerName } }
    );

    return res.status(200).json({ success: true, message: `Buyer ${buyerName} updated successfully` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

