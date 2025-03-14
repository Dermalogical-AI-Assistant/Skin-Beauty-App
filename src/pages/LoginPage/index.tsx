// LoginComponent.tsx
import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from "../../providers/AuthProvider.tsx";

const LoginPage: React.FC = () => {
    const { token, setToken } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('your-api-endpoint/login', {
                username,
                password
            });

            setToken(response.data.token);
            setToken('your-token');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            {token ? (
                <div>Bạn đã đăng nhập!</div>
            ) : (
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button type="submit">Đăng nhập</button>
                </form>
            )}
        </div>
    );
};

export default LoginPage;