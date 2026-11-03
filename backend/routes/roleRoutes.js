import express from 'express';
import {
  getAllRoles,
  searchRoles,
  saveRoleAssignment,
  getJobTitles,
  getUsersByJobTitle,
  searchUsersForRoles,
  getUserByEmpId,
  getUserRoles,
  getBuyers,
  getBuyerUsers,
  saveBuyerGroup,
} from '../controllers/roleController.js';

const router = express.Router();

// Role Management routes
router.get('/role-management', getAllRoles);
router.get('/role-management/search', searchRoles);
router.post('/role-management', saveRoleAssignment);

// Supporting routes for roles
router.get('/job-titles', getJobTitles);
router.get('/users-by-job-title', getUsersByJobTitle);
router.get('/users/search', searchUsersForRoles);
router.get('/user-by-emp-id', getUserByEmpId);
router.get('/user-roles/:empId', getUserRoles);

// Buyer groups routes
router.get('/buyer-groups/buyers', getBuyers);
router.get('/buyer-groups/users', getBuyerUsers);
router.post('/buyer-groups/save', saveBuyerGroup);

export default router;

