import crypto from 'crypto';
import { env } from '../config/env';

const key = env.ENCRYPTION_KEY ? Buffer.from(env.ENCRYPTION_KEY, 'base64') : null;

if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte base64 value.');
}

const ALGO = 'aes-256-gcm';

export const encrypt = (plaintext: string): string => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `enc:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
};

export const decrypt = (value: string): string => {
    if (!value.startsWith('enc:')) {
        return value;
    }
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
