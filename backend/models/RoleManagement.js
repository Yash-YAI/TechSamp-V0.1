import mongoose from 'mongoose';

export const RoleManagementSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitles: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
    },
  },
  {
    collection: 'role_managements',
    strict: false,
    timestamps: true,
  }
);

/**
 * Factory function to bind RoleManagementSchema to a specific connection
 */
export const createRoleManagementModel = (connection) => {
  return connection.models.RoleManagement || connection.model('RoleManagement', RoleManagementSchema);
};

const RoleManagement =
  mongoose.models.RoleManagement || mongoose.model('RoleManagement', RoleManagementSchema);

export default RoleManagement;
