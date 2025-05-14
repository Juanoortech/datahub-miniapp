
export const TOKEN_STORAGE = 'jwt-token'

function getToken() {
    return localStorage.getItem(TOKEN_STORAGE)
}

// Placeholder for Web3 signature-based authentication
async function updateToken(walletAddress: string, signature: string) {
    // Call backend to verify signature and get JWT
    // Example: await tokenApi.generateToken({ walletAddress, signature })
    // Store JWT in localStorage
    return { error: false }
}

function clearToken() {
    localStorage.setItem(TOKEN_STORAGE, '')
}

export const tokenModel = {
    getToken,
    updateToken,
    clearToken,
}