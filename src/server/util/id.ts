import * as crypto from 'node:crypto';

export const getNewId = () => crypto.randomBytes(10).toString('hex');
