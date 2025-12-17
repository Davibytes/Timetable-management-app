import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import ChronosLogo from '../components/ChronosLogo';
import Input from '../components/Input';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();
    const { isDark } = useTheme();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            toast.success('Login successful! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 200);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div
                className={`lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'
                    }`}
            >
                <div className="max-w-md w-full text-center">
                    <ChronosLogo size="hero" showTagline={true} />

                    {/* Decorative Large Grid Blocks */}
                    <div className="mt-16 grid grid-cols-5 gap-3 max-w-xs mx-auto">
                        {/* Row 1 */}
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>

                        {/* Row 2 */}
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>

                        {/* Row 3 */}
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div
                className={`lg:w-1/2 flex flex-col ${isDark ? 'bg-dark-surface' : 'bg-light-surface'
                    }`}
            >
                {/* Theme Toggle & Back Button */}
                <div className="flex justify-between items-center p-6">
                    <Link
                        to="/"
                        className={`flex items-center gap-2 text-small transition-smooth ${isDark
                                ? 'text-text-dark-secondary hover:text-text-dark-primary'
                                : 'text-text-light-secondary hover:text-text-light-primary'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <ThemeToggle />
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h1
                                className={`text-h1 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                    }`}
                            >
                                Welcome Back
                            </h1>
                            <p
                                className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                    }`}
                            >
                                Sign in to continue to Chronos
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className={`text-small transition-smooth ${isDark
                                            ? 'text-indigo-light hover:text-indigo'
                                            : 'text-sage hover:text-sage-dark'
                                        }`}
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button type="submit" variant="primary" fullWidth disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        <div
                            className={`mt-6 text-center text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className={`font-medium transition-smooth ${isDark
                                        ? 'text-indigo-light hover:text-indigo'
                                        : 'text-sage hover:text-sage-dark'
                                    }`}
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;