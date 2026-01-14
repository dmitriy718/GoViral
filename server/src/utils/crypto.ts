import crypto from 'crypto';
import { env } from '../config/env';

const primaryKey = env.ENCRYPTION_KEY ? Buffer.from(env.ENCRYPTION_KEY, 'base64') : null;
const oldKey = env.ENCRYPTION_KEY_OLD ? Buffer.from(env.ENCRYPTION_KEY_OLD, 'base64') : null;

if (!primaryKey || primaryKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte base64 value.');
}
if (oldKey && oldKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY_OLD must be a 32-byte base64 value.');
}

const ALGO = 'aes-256-gcm';

export const encrypt = (plaintext: string): string => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, primaryKey, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `enc:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
};

const decryptWithKey = (value: string, key: Buffer): string => {
    const parts = value.split(':');
    if (parts.length !== 4) {
        throw new Error('Invalid encrypted payload format.');
    }
    const iv = Buffer.from(parts[1], 'base64');
    const tag = Buffer.from(parts[2], 'base64');
    const encrypted = Buffer.from(parts[3], 'base64');
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
};

export const decrypt = (value: string): string => {
    if (!value.startsWith('enc:')) {
        return value;
    }
    try {
        return decryptWithKey(value, primaryKey);
    } catch (error) {
        if (!oldKey) {
            throw error;
        }
        return decryptWithKey(value, oldKey);
    }
};
