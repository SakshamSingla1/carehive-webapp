import React, { type FC, useEffect, useMemo, useState } from 'react';

interface AuthProviderType {
    children: React.ReactNode;
}

export interface AuthUserType {
    id: string;
    fullName: string;
    username: string;
    phone: string;
    email: string;
    role: string;
    token: string;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
}

export interface AuthContextType {
    isAuthDialogActive: boolean;
    syncAuthDialogActive: (value?: boolean) => void;
    user: AuthUserType | null;
    setAuth: (user: AuthUserType | null) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
    isAuthDialogActive: false,
    syncAuthDialogActive: () => {},
    user: null,
    setAuth: () => {}
});

export const AuthProvider: FC<AuthProviderType> = ({ children }) => {

    const [isAuthDialogActive, setAuthDialogActive] = useState(false);
    const [user, setAuth] = useState<AuthUserType | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setAuth(JSON.parse(storedUser));
            }
        } catch {
            setAuth(null);
        }
    }, []);

    const syncAuthDialogActive = (value?: boolean) => {
        setAuthDialogActive(value ?? user === null);
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const providerValue = useMemo(() => ({
        isAuthDialogActive,
        syncAuthDialogActive,
        user,
        setAuth
    }), [user, isAuthDialogActive]);

    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
};