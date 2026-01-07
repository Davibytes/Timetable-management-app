import { createContext, useContext, useState, useCallback } from 'react';
import { timetableAPI } from '../services/api';

const TimetableContext = createContext();

export const useTimetable = () => {
    const context = useContext(TimetableContext);
    if (!context) {
        throw new Error('useTimetable must be used within TimetableProvider');
    }
    return context;
};

export const TimetableProvider = ({ children }) => {
    const [timetables, setTimetables] = useState([]);
    const [currentTimetable, setCurrentTimetable] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        department: '',
        semester: 1,
        academicYear: '',
        selectedCourses: [],
        selectedCourse: '',
        room: '',
        lecturer: '',
        dayOfWeek: '',
        roomConstraints: {
            minCapacity: 0,
            preferredTypes: [],
            requiredEquipment: []
        }
    });

    const fetchTimetables = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.getAll(params);
            setTimetables(response.data.data.timetables);
            return response.data.data.timetables;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch timetables');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTimetable = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.getById(id);
            setCurrentTimetable(response.data.data.timetable);
            return response.data.data.timetable;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch timetable');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEntries = useCallback(async (timetableId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.getEntries(timetableId);
            setEntries(response.data.data.entries);
            return response.data.data.entries;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch entries');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createTimetable = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.create(data);
            const newTimetable = response.data.data.timetable;
            setTimetables(prev => [...prev, newTimetable]);
            setCurrentTimetable(newTimetable);
            return newTimetable;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create timetable');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTimetable = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.update(id, data);
            const updatedTimetable = response.data.data.timetable;
            setTimetables(prev =>
                prev.map(t => t._id === id ? updatedTimetable : t)
            );
            if (currentTimetable?._id === id) {
                setCurrentTimetable(updatedTimetable);
            }
            return updatedTimetable;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update timetable');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentTimetable]);

    const deleteTimetable = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await timetableAPI.delete(id);
            setTimetables(prev => prev.filter(t => t._id !== id));
            if (currentTimetable?._id === id) {
                setCurrentTimetable(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete timetable');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentTimetable]);

    const publishTimetable = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.publish(id);
            const publishedTimetable = response.data.data.timetable;
            setTimetables(prev =>
                prev.map(t => t._id === id ? publishedTimetable : t)
            );
            if (currentTimetable?._id === id) {
                setCurrentTimetable(publishedTimetable);
            }
            return publishedTimetable;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish timetable');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentTimetable]);

    const unpublishTimetable = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await timetableAPI.unpublish(id);
            const unpublishedTimetable = response.data.data.timetable;
            setTimetables(prev =>
                prev.map(t => t._id === id ? unpublishedTimetable : t)
            );
            if (currentTimetable?._id === id) {
                setCurrentTimetable(unpublishedTimetable);
            }
            return unpublishedTimetable;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unpublish timetable');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentTimetable]);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            department: '',
            semester: 1,
            academicYear: '',
            selectedCourses: [],
            selectedCourse: '',
            room: '',
            lecturer: '',
            dayOfWeek: '',
            roomConstraints: {
                minCapacity: 0,
                preferredTypes: [],
                requiredEquipment: []
            }
        });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        timetables,
        currentTimetable,
        entries,
        loading,
        error,
        filters,
        fetchTimetables,
        fetchTimetable,
        fetchEntries,
        createTimetable,
        updateTimetable,
        deleteTimetable,
        publishTimetable,
        unpublishTimetable,
        updateFilters,
        resetFilters,
        clearError,
        setCurrentTimetable
    };

    return (
        <TimetableContext.Provider value={value}>
            {children}
        </TimetableContext.Provider>
    );
};