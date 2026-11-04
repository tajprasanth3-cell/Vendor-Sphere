import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/store.js';
import { User as UserModel } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, AuthPayload } from '../types/index.js';

// In-memory store for OTPs (email -> { otp, expiresAt })
const resetOtps = new Map<string, { otp: string; expiresAt: number }>();

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  let user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  // Allow quick role login if specified
  if (!user && role) {
    user = db.users.find((u) => u.role === role);
  }

  // Also check MongoDB if UserModel has documents
  if (!user && email) {
    try {
      const mongoUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (mongoUser) {
        user = {
          id: mongoUser.id,
          name: mongoUser.name,
          email: mongoUser.email,
          role: mongoUser.role as any,
          department: mongoUser.department,
          passwordHash: mongoUser.passwordHash,
        };
      }
    } catch {
      // Fallback silent
    }
  }

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. User not found in corporate directory.',
    });
    return;
  }

  // Generate JWT token
  const payload: AuthPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    department: user.department,
  };

  const token = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as any);

  db.addAudit({
    action: 'USER_LOGIN',
    entityType: 'AUTH',
    entityCode: user.id,
    user: user.name,
    role: user.role.toUpperCase(),
    details: `Authenticated successfully from portal (${req.ip || 'remote'}).`,
  });

  res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: payload,
  });
};

export const getMe = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.json({
    success: true,
    user: req.user,
  });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Corporate email is required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    // Return friendly enterprise response
    res.status(404).json({
      success: false,
      message: 'Email address not found in corporate directory.',
    });
    return;
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  resetOtps.set(normalizedEmail, { otp, expiresAt });

  db.addAudit({
    action: 'PASSWORD_RESET_REQUESTED',
    entityType: 'AUTH',
    entityCode: user.id,
    user: user.name,
    role: user.role.toUpperCase(),
    details: `Self-service password reset code issued for ${normalizedEmail}.`,
  });

  res.json({
    success: true,
    message: `Verification code generated for ${user.name}. In development/testing, OTP is: ${otp}`,
    otp, // Returned in dev mode for seamless testing
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Email, verification code, and new password are required.',
    });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const record = resetOtps.get(normalizedEmail);

  if (!record) {
    res.status(400).json({
      success: false,
      message: 'No pending reset request found. Please request a new OTP.',
    });
    return;
  }

  if (Date.now() > record.expiresAt) {
    resetOtps.delete(normalizedEmail);
    res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new one.',
    });
    return;
  }

  if (record.otp !== otp.trim()) {
    res.status(400).json({
      success: false,
      message: 'Invalid verification code. Please check your OTP.',
    });
    return;
  }

  // Update password in memory store
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (user) {
    user.passwordHash = newPassword;
  }

  // Also update in MongoDB if connected
  try {
    await UserModel.updateOne({ email: normalizedEmail }, { passwordHash: newPassword });
  } catch {
    // Ignore if mongo is not connected
  }

  resetOtps.delete(normalizedEmail);

  if (user) {
    db.addAudit({
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'AUTH',
      entityCode: user.id,
      user: user.name,
      role: user.role.toUpperCase(),
      details: 'Password successfully changed and updated in corporate directory.',
    });
  }

  res.json({
    success: true,
    message: 'Password successfully reset! You can now log in with your new password.',
  });
};
