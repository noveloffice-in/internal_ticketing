import { useFrappeAuth } from "frappe-react-sdk";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const RequireAuth = ({ children }) => {
    const { currentUser, updateCurrentUser } = useFrappeAuth();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        updateCurrentUser().finally(() => setLoading(false));
    }, [updateCurrentUser]);

    if (loading) {
        return <div>Loading...</div>; // Prevent flickering
    }

    if(!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;

    // return currentUser ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;



