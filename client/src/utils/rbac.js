export const ROLES = {
    ADMIN: 'admin',
    LECTURER: 'lecturer',
    STUDENT: 'student'
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isLecturer = (user) => user?.role === ROLES.LECTURER;
export const isStudent = (user) => user?.role === ROLES.STUDENT;

export const canManageContent = (user) => {
    return isAdmin(user) || isLecturer(user);
};

export const canEditCourse = (user, course) => {
    if (isAdmin(user)) return true;
    if (isLecturer(user) && course?.lecturerId) {
        const lecturerId = course.lecturerId._id || course.lecturerId;
        return lecturerId === user._id;
    }
    return false;
};

export const getNavigationItems = (user) => {
    const baseItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/courses', label: 'Courses', icon: 'BookOpen' },
        { path: '/rooms', label: 'Rooms', icon: 'DoorOpen' },
        { path: '/timetables', label: 'Timetables', icon: 'Calendar' }
    ];

    const adminItems = [
        { path: '/users', label: 'Users', icon: 'Users' }
    ];

    const staffItems = [
        { path: '/reports', label: 'Reports', icon: 'BarChart' }
    ];

    const settingsItem = { path: '/settings', label: 'Settings', icon: 'Settings' };

    if (isAdmin(user)) {
        return [...baseItems, ...adminItems, ...staffItems, settingsItem];
    }

    if (isLecturer(user)) {
        return [...baseItems, ...staffItems, settingsItem];
    }

    return [...baseItems, settingsItem];
};