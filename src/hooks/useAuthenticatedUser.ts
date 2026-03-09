import React, { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const isSessionExpired = (): boolean | null => {
    const lastReLoginTimestamp = localStorage.getItem("reLoginTimestamp");
    if (!lastReLoginTimestamp) return null;
    const diff = Date.now() - new Date(lastReLoginTimestamp).getTime();
    return diff >= 24 * 60 * 60 * 1000;
};

export const useAuthenticatedUser = () => {
    const context = React.useContext(AuthContext);
    const navigate = useNavigate();
    if (!context) {
        throw new Error("useAuthenticatedUser must be used within a AuthProvider");
    }

    useEffect(() => {
        const expired = isSessionExpired();

        if (expired === true) {
            const alreadyHandled = sessionStorage.getItem("sessionHandled");
            if (alreadyHandled === "true") return;

            sessionStorage.setItem("sessionHandled", "true");

            context.setAuth(null);
            localStorage.removeItem("user");
            localStorage.removeItem("reLoginTimestamp");

            alert("Session expired. Please log in again.");
            navigate("/");
        } 
        else if (expired === null) {
            context.setAuth(null);
            localStorage.removeItem("user");
            localStorage.removeItem("reLoginTimestamp");
        }
    }, [navigate]);

    return context;
};
