export function decodeJwt(token) {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); // Get the payload part of the JWT
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

export function isTokenExpired(token) {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
}