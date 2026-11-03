import mongoose from 'mongoose';

const roleManagmentSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    jobTitles: [{ type: String }],
    users: [
      {
        emp_id: { type: String },
        name: { type: String },
        eng_name: { type: String },
        kh_name: { type: String },
        job_title: { type: String },
        dept_name: { type: String },
        sect_name: { type: String },
        working_status: { type: String },
        phone_number: { type: String },
        face_photo: { type: String },
      },
    ],
  },
  {
    collection: 'role_management',
    timestamps: true,
  }
);

// Export factory function for connection binding (TTS / YPM connection)
export const createRoleManagementModel = (connection) =>
  connection.models.RoleManagement ||
  connection.model('RoleManagement', roleManagmentSchema, 'role_management');

// Default export compatible with factory
export default createRoleManagementModel;
