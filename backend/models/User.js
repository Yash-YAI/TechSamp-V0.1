import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    emp_code: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    eng_name: {
      type: String,
    },
    kh_name: {
      type: String,
    },
    dept_name: {
      type: String,
    },
    sect_name: {
      type: String,
    },
    job_title: {
      type: String,
    },
    roles: {
      type: Array,
      default: [],
    },
    working_status: {
      type: String,
    },
    face_photo: {
      type: String,
    },
  },
  {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: false,
  }
);

/**
 * Compare entered password with stored password (supports bcrypt $2y$/$2a$/$2b$ and fallback)
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  try {
    // Standardize $2y$ to $2a$ for bcrypt compatibility if needed
    const normalizedHash = this.password.startsWith('$2y$')
      ? '$2a$' + this.password.slice(4)
      : this.password;

    const isMatch = await bcrypt.compare(candidatePassword, normalizedHash);
    if (isMatch) return true;
  } catch (err) {
    // In case hash format is non-standard
  }

  // Plain-text fallback for development/legacy accounts
  return this.password === candidatePassword;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

