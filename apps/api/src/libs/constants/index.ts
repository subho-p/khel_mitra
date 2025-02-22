import { CookieOptions } from 'express';

export const TOKEN_EXPIRATION = {
    ACCESS: '15m',
    REFRESH: '15d',
};

export const COOKIE_SETTINGS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
};

export const REFRESH_TOKEN_EXPIRATION = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15);

export const CORS_URLS =
    process.env.CORS_URLS === '*' ? '*' : (process.env.CORS_URLS?.split(',') ?? '*');
