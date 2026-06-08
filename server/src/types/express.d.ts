import type { PublicUser } from './user.js';

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
      file?: Express.Multer.File;
    }
  }
}

export {};
