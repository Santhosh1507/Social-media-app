import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the path accordingly
import { Loader } from 'lucide-react';

const LoginForm = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(username, password);
            // Reload the page on successful login
            window.location.reload();
        } catch (error) {
            console.error('Login failed:', error);
            // Optionally, handle login error (e.g., show an error message)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
            <input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='input input-bordered w-full'
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered w-full'
                required
            />

            <button type='submit' className='btn btn-primary w-full'>
                {isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
            </button>
        </form>
    );
};

export default LoginForm;
