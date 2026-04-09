const AUTH_STORAGE_KEY = "user";

export const getStoredUser = () => {
    const savedUser =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_STORAGE_KEY);

    return savedUser ? JSON.parse(savedUser) : null;
};

export const storeUserSession = (userData, rememberMe) => {
    clearStoredUser();

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
};

export const clearStoredUser = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
};
