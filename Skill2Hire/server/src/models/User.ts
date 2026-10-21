import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  targetRole?: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    targetRole: { type: String, default: 'Software Engineer' },
    skills: [{ type: String, trim: true }]
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
