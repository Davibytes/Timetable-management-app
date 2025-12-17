import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle, ArrowRight, Workflow, Zap, Shield, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ChronosLogo from '../components/ChronosLogo';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/Button';

const LandingPage = () => {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'}`}>
            {/* Navigation */}
            <nav
                className={`sticky top-0 z-50 backdrop-blur-nav transition-all duration-300 ${isDark
                    ? 'bg-dark-surface/80 border-b border-dark-border-subtle'
                    : 'bg-light-surface/80 border-b border-light-border-subtle'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <Link to="/">
                        <ChronosLogo />
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <ThemeToggle />
                        <Link to="/login" className="hidden sm:block">
                            <Button variant="secondary" size="small">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="small">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Text Content */}
                    <div>
                        <h1
                            className={`text-4xl sm:text-5xl lg:text-hero font-comfortaa font-bold mb-6 leading-tight ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Automated Timetable Management
                        </h1>
                        <p
                            className={`text-body lg:text-body-lg mb-8 leading-relaxed ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            Create your entire semester schedule in minutes, not days. Chronos automatically checks for conflicts, suggests optimal time slots, and keeps everyone on the same page.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register">
                                <Button variant="primary" size="large" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                                    Try it now
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" size="large">
                                    Sign in
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Timetable Preview */}
                    <div
                        className={`rounded-elevated border overflow-hidden ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark'
                            : 'bg-light-surface border-light-border-subtle shadow-card-light'
                            }`}
                    >
                        {/* Mock Timetable Header */}
                        <div className={`px-6 py-4 border-b ${isDark ? 'bg-dark-elevated border-dark-border-subtle' : 'bg-light-elevated border-light-border-subtle'}`}>
                            <h3 className={`text-body font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'}`}>
                                2nd Semester 2026 - Software Enginneering
                            </h3>
                            <p className={`text-caption mt-1 ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                                6 courses • No conflicts
                            </p>
                        </div>

                        {/* Mock Timetable Grid */}
                        <div className="p-6">
                            <div className="grid grid-cols-6 gap-2 mb-4">
                                {['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                                    <div
                                        key={i}
                                        className={`text-caption font-comfortaa font-semibold text-center py-2 rounded ${isDark ? 'bg-dark-elevated text-text-dark-primary' : 'bg-light-elevated text-text-light-primary'
                                            }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                {/* 08:00 Row */}
                                <div className="grid grid-cols-6 gap-2">
                                    <div className={`text-caption text-center py-3 rounded ${isDark ? 'bg-dark-canvas text-text-dark-muted' : 'bg-light-canvas text-text-light-muted'}`}>
                                        08:00
                                    </div>
                                    <div className={`${isDark ? 'bg-indigo' : 'bg-sage'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">B. Eng</div>
                                        <div className="opacity-90 text-[10px]">Amphi 101</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo-velvet' : 'bg-slate-blue'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">CS Ethics</div>
                                        <div className="opacity-90 text-[10px]">Amphi 101</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo' : 'bg-sage'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">Intro AI</div>
                                        <div className="opacity-90 text-[10px]">Room 5</div>
                                    </div>
                                </div>

                                {/* 10:00 Row */}
                                <div className="grid grid-cols-6 gap-2">
                                    <div className={`text-caption text-center py-3 rounded ${isDark ? 'bg-dark-canvas text-text-dark-muted' : 'bg-light-canvas text-text-light-muted'}`}>
                                        10:00
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo' : 'bg-sage'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">Adv OS</div>
                                        <div className="opacity-90 text-[10px]">Lab 1</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo' : 'bg-sage'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">IT Security</div>
                                        <div className="opacity-90 text-[10px]">Lab 2</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                </div>

                                {/* 12:00 Row */}
                                <div className="grid grid-cols-6 gap-2">
                                    <div className={`text-caption text-center py-3 rounded ${isDark ? 'bg-dark-canvas text-text-dark-muted' : 'bg-light-canvas text-text-light-muted'}`}>
                                        12:00
                                    </div>
                                    <div className={`${isDark ? 'bg-indigo-velvet' : 'bg-slate-blue'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">I. Prog</div>
                                        <div className="opacity-90 text-[10px]">Room 1</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo' : 'bg-sage'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">SW Design</div>
                                        <div className="opacity-90 text-[10px]">Room 3</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-indigo-velvet' : 'bg-slate-blue'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">Research</div>
                                        <div className="opacity-90 text-[10px]">Amphi 201</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                </div>

                                {/* 14:00 Row */}
                                <div className="grid grid-cols-6 gap-2">
                                    <div className={`text-caption text-center py-3 rounded ${isDark ? 'bg-dark-canvas text-text-dark-muted' : 'bg-light-canvas text-text-light-muted'}`}>
                                        14:00
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo-velvet' : 'bg-slate-blue'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">B. French</div>
                                        <div className="opacity-90 text-[10px]">Lab 2</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-dark-elevated border border-dark-border-prominent' : 'bg-light-elevated border border-light-border-prominent'} rounded`}></div>
                                    <div className={`${isDark ? 'bg-indigo' : 'bg-sage'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">Adv CS</div>
                                        <div className="opacity-90 text-[10px]">Room 7</div>
                                    </div>
                                    <div className={`${isDark ? 'bg-indigo-velvet' : 'bg-slate-blue'} text-white rounded p-2 text-caption`}>
                                        <div className="font-comfortaa font-semibold text-xs mb-0.5">Prog Lang C.</div>
                                        <div className="opacity-90 text-[10px]">Room 5</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Chronos Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <h2
                    className={`text-h2 font-comfortaa font-semibold text-center mb-12 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    Why Chronos?
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <WhyCard
                        isDark={isDark}
                        icon={<Zap className="w-8 h-8" />}
                        title="Fast"
                        description="Generate complete timetables in under 1 minute with our optimized algorithms"
                    />
                    <WhyCard
                        isDark={isDark}
                        icon={<Shield className="w-8 h-8" />}
                        title="Conflict-Free"
                        description="Intelligent detection prevents double-bookings and scheduling errors"
                    />
                    <WhyCard
                        isDark={isDark}
                        icon={<TrendingUp className="w-8 h-8" />}
                        title="AI-Powered"
                        description="Smart optimization learns from patterns to improve scheduling efficiency"
                    />
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <h2
                    className={`text-h2 font-comfortaa font-semibold text-center mb-12 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    Everything you need to manage schedules
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        isDark={isDark}
                        icon={<Calendar className="w-8 h-8" />}
                        title="Automated Generation"
                        description="Create complete timetables in seconds with intelligent scheduling"
                    />
                    <FeatureCard
                        isDark={isDark}
                        icon={<Clock className="w-8 h-8" />}
                        title="Conflict Detection"
                        description="Real-time detection of scheduling conflicts and capacity issues"
                    />
                    <FeatureCard
                        isDark={isDark}
                        icon={<Users className="w-8 h-8" />}
                        title="Role Management"
                        description="Multi-role access control for admins, lecturers, and students"
                    />
                    <FeatureCard
                        isDark={isDark}
                        icon={<CheckCircle className="w-8 h-8" />}
                        title="Smart Optimization"
                        description="AI-powered room assignment and load balancing"
                    />
                </div>
            </section>


            {/* Footer */}
            <footer
                className={`border-t mt-24 ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
                    <p className={`text-small ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                        © 2025 Chronos. Automated Timetable Management System.
                    </p>
                </div>
            </footer>
        </div>
    );
};

// Workflow Card Component
const WorkflowCard = ({ isDark, icon, title, description, time }) => (
    <div
        className={`rounded-button p-4 border transition-smooth ${isDark
            ? 'bg-dark-elevated border-dark-border-subtle hover:border-indigo'
            : 'bg-light-elevated border-light-border-subtle hover:border-sage'
            }`}
    >
        <div className="flex items-start gap-3">
            <div
                className={`p-2 rounded-button flex-shrink-0 ${isDark ? 'bg-indigo/15 text-indigo-light' : 'bg-sage/10 text-sage'
                    }`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h4
                    className={`text-body font-semibold mb-1 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    {title}
                </h4>
                <p
                    className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}
                >
                    {description}
                </p>
                <p
                    className={`text-caption mt-2 ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                        }`}
                >
                    {time}
                </p>
            </div>
        </div>
    </div>
);

// Subject Block Component
const SubjectBlock = ({ isDark, subject, color, className = '' }) => {
    const colors = {
        indigo: isDark ? 'bg-indigo/20 border-indigo/40' : 'bg-sage/20 border-sage/40',
        teal: isDark ? 'bg-teal-500/20 border-teal-500/40' : 'bg-teal-600/20 border-teal-600/40',
        purple: isDark ? 'bg-purple-500/20 border-purple-500/40' : 'bg-purple-600/20 border-purple-600/40',
        orange: isDark ? 'bg-orange-500/20 border-orange-500/40' : 'bg-orange-600/20 border-orange-600/40',
        blue: isDark ? 'bg-blue-500/20 border-blue-500/40' : 'bg-blue-600/20 border-blue-600/40',
    };

    return (
        <div
            className={`p-4 rounded-button border ${colors[color]} ${className}`}
        >
            <p
                className={`text-small font-medium ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                    }`}
            >
                {subject}
            </p>
        </div>
    );
};

// Why Card Component
const WhyCard = ({ isDark, icon, title, description }) => (
    <div className="text-center">
        <div
            className={`w-16 h-16 rounded-card flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-indigo/15 text-indigo-light' : 'bg-sage/10 text-sage'
                }`}
        >
            {icon}
        </div>
        <h3
            className={`text-h4 font-comfortaa font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                }`}
        >
            {title}
        </h3>
        <p
            className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                }`}
        >
            {description}
        </p>
    </div>
);

// Feature Card Component
const FeatureCard = ({ isDark, icon, title, description }) => (
    <div
        className={`rounded-card p-6 border transition-smooth-300 ${isDark
            ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark card-hover-dark'
            : 'bg-light-surface border-light-border-subtle shadow-card-light card-hover-light'
            }`}
    >
        <div className={`mb-4 ${isDark ? 'text-indigo-light' : 'text-sage'}`}>
            {icon}
        </div>
        <h3
            className={`text-h4 font-comfortaa font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                }`}
        >
            {title}
        </h3>
        <p
            className={`text-small leading-relaxed ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                }`}
        >
            {description}
        </p>
    </div>
);

export default LandingPage;