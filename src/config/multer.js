import multer from 'multer';
import { extname, resolve } from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);
        return cb(null, hash.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
