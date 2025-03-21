import React, { useState, useEffect } from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const { currentUser, login, logout, updateCurrentUser, error, isLoading, getUserCookie } = useFrappeAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            await login({
                username: email.trim(), // Trim whitespace
                password: password
            });
            // Clear sensitive data
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            setLoginError(err?.message || 'Login Failed');
        }
    };

    useEffect(() => {
        if (!isLoading && currentUser) {
            navigate(from);
            console.log('currentUser', currentUser);
        }
    }, [currentUser, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        !currentUser ? (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded shadow-md border border-gray-200 w-96">
                    <h1 className="text-2xl font-bold mb-4">Login</h1>

                    {loginError && <p className="text-red-500 mb-4">{loginError}</p>}

                    <div className="mb-4">
                        <label className="block text-gray-700">
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="jane@example.com"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="absolute right-2 top-2 text-gray-600"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800" disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                </form>
            </div>
        ) : (
            <div>
                <h1>Welcome {currentUser.name}</h1>
            </div>
        )
    );
};

export default Login;


