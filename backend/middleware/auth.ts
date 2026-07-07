import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'workquest_secret_token_key';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Employee';
    employeeId: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }
};

export const requireRole = (roles: ('Admin' | 'Manager' | 'Employee')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied. Insufficient administrative privileges.' });
    }
    next();
  };
};
