import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import ChronosLogo from '../components/ChronosLogo';
import Input from '../components/Input';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import Dropdown from '../components/Dropdown';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const toast = useToast();
    const { isDark } = useTheme();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student',
        department: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            toast.success('Registration successful! Please login to continue.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>

                        {/* Row 2 */}
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>

                        {/* Row 3 */}
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
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
                                Create Account
                            </h1>
                            <p
                                className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                    }`}
                            >
                                Join to start managing schedules
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Kim"
                                    icon={<User className="w-5 h-5" />}
                                    required
                                />

                                <Input
                                    label="Last Name"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Namjoon"
                                    icon={<User className="w-5 h-5" />}
                                    required
                                />
                            </div>

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Dropdown
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'student', label: 'Student' },
                                        { value: 'lecturer', label: 'Lecturer' },
                                        { value: 'admin', label: 'Admin' }
                                    ]}
                                    required
                                />

                                <Input
                                    label="Department"
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Computer Science"
                                    icon={<Building className="w-5 h-5" />}
                                />
                            </div>

                            <Button type="submit" variant="primary" fullWidth disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div
                            className={`mt-6 text-center text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className={`font-medium transition-smooth ${isDark
                                    ? 'text-indigo-light hover:text-indigo'
                                    : 'text-sage hover:text-sage-dark'
                                    }`}
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;