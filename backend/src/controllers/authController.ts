import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/store.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, AuthPayload } from '../types/index.js';

export const login = (req: Request, res: Response): void => {
  const { email, password, role } = req.body;

  let user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  // Allow quick role login if specified
  if (!user && role) {
    user = db.users.find((u) => u.role === role);
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

