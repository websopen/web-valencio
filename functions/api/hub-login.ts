/**
 * Hub Login Function - Pages Function to handle JWT from Hub
 */

const JWT_SECRET = 'hub-jwt-secret-change-in-production-2025';
const COOKIE_NAME = 'valencio_admin';
const COOKIE_SECRET = 'valencio-cookie-secret-2025';

// Simple JWT decode (no signature verification needed for Edge)
function decodeJwt(token: string): any {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}

// Simple cookie signing (HMAC-like)
function signCookie(value: string): string {
    // Simple encoding - in production use HMAC
    return btoa(`${value}:${COOKIE_SECRET.substring(0, 8)}`);
}

export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);
    const hubToken = url.searchParams.get('hub_token');

    if (!hubToken) {
        return new Response(JSON.stringify({ error: 'Token required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Decode JWT
    const payload = decodeJwt(hubToken);
    if (!payload || !payload.role) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
        return new Response(JSON.stringify({ error: 'Token expired' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Map role to cookie value
    const roleValue = payload.role === 'admin' ? 'admin_active' : `role_${payload.role}`;

    // Create session cookie (NO Max-Age = expires when browser closes)
    const cookieValue = signCookie(roleValue);
    const setCookie = `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Lax`;

    console.log(`[Hub Login] User authenticated with role: ${payload.role}`);

    // Determine redirect based on role
    // Admin goes to /admin, other roles go to home
    const redirectPath = payload.role === 'admin' ? '/admin' : '/';
    return new Response(null, {
        status: 302,
        headers: {
            'Location': redirectPath,
            'Set-Cookie': setCookie
        }
    });
};
