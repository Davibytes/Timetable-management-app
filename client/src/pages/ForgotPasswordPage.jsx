import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import ChronosLogo from '../components/ChronosLogo';
import Input from '../components/Input';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';

const ForgotPasswordPage = () => {
    const toast = useToast();
    const { isDark } = useTheme();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authAPI.forgotPassword(email);
            setSent(true);
            toast.success('Reset instructions sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
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
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>

                        {/* Row 2 */}
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-dark-surface' : 'bg-light-elevated'} blur-[2px] opacity-60`}></div>
                        <div className={`h-16 rounded-button ${isDark ? 'bg-indigo/30' : 'bg-sage/20'} blur-[2px] opacity-70`}></div>
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

            {/* Right Side - Form */}
            <div
                className={`lg:w-1/2 flex flex-col ${isDark ? 'bg-dark-surface' : 'bg-light-surface'
                    }`}
            >
                {/* Theme Toggle & Back Button */}
                <div className="flex justify-between items-center p-6">
                    <Link
                        to="/login"
                        className={`flex items-center gap-2 text-small transition-smooth ${isDark
                                ? 'text-text-dark-secondary hover:text-text-dark-primary'
                                : 'text-text-light-secondary hover:text-text-light-primary'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                    <ThemeToggle />
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {!sent ? (
                            <>
                                <div className="mb-8">
                                    <h1
                                        className={`text-h1 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                            }`}
                                    >
                                        Reset Password
                                    </h1>
                                    <p
                                        className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                            }`}
                                    >
                                        Enter your email to receive reset instructions
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        icon={<Mail className="w-5 h-5" />}
                                        required
                                    />

                                    <Button type="submit" variant="primary" fullWidth disabled={loading}>
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-indigo/15' : 'bg-sage/10'
                                        }`}
                                >
                                    <CheckCircle
                                        className={`w-8 h-8 ${isDark ? 'text-indigo-light' : 'text-sage'
                                            }`}
                                    />
                                </div>
                                <h3
                                    className={`text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                        }`}
                                >
                                    Check Your Email
                                </h3>
                                <p
                                    className={`text-body mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                        }`}
                                >
                                    Reset instructions have been sent to{' '}
                                    <span
                                        className={`font-medium ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                            }`}
                                    >
                                        {email}
                                    </span>
                                </p>
                                <Link to="/login">
                                    <Button variant="secondary" fullWidth>
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {!sent && (
                            <div
                                className={`mt-6 text-center text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                    }`}
                            >
                                Remember your password?{' '}
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;