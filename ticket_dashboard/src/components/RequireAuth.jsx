import { useFrappeAuth } from "frappe-react-sdk";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RequireAuth = ({ children }) => {
    const { currentUser, updateCurrentUser } = useFrappeAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateCurrentUser().finally(() => setLoading(false)); // Force re-fetch auth state
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Prevent flickering
    }

    return currentUser ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
