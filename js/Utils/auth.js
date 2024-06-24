function encodeToBase64(loginInfo) {
    const jsonStr = JSON.stringify(loginInfo);
    return btoa(jsonStr);
}


function decodeFromBase64(base64Str) {
    const jsonStr = atob(base64Str);
    return JSON.parse(jsonStr);
}

export function saveLoginInfo(loginInfo) {
    const encodedInfo = encodeToBase64(loginInfo);
    localStorage.setItem('loginInfo', encodedInfo);
}

export function parseJWTPayload(token) {
    if (!token) {
        throw new Error('Token is required');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token format');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



export function getLoginInfo() {
    const encodedInfo = localStorage.getItem('loginInfo');
    if (!encodedInfo) {
        return null;
    }
    
    const data = decodeFromBase64(encodedInfo);
    const token = data.token;
    // console.log(token);
    try {
        const { exp } = parseJWTPayload(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > exp) {
            // Login information has expired
            localStorage.removeItem('loginInfo');
            return null;
        }
    } catch (error) {
        return null;
    }

    return data;
}


