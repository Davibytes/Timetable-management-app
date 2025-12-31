import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { roomAPI } from '../services/api';
import Button from './Button';
import Input from './Input';

const ROOM_TYPES = ['Lecture Hall', 'Laboratory', 'Amphitheater', 'Tutorial Room', 'Seminar Room', 'Other'];
const EQUIPMENT_OPTIONS = [
    'Projector',
    'Whiteboard',
    'Computer',
    'Audio System',
    'Video Conferencing',
    'Lab Equipment',
    'Air Conditioning',
    'Microphone'
];

const RoomForm = ({ isOpen, onClose, onSuccess, editData = null }) => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: 30,
        building: '',
        floor: 0,
        equipment: [],
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    type: editData.type || 'Lecture Hall',
                    capacity: editData.capacity || 30,
                    building: editData.building || '',
                    floor: editData.floor || 0,
                    equipment: editData.equipment || [],
                    description: editData.description || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editData]);

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Lecture Hall',
            capacity: 30,
            building: '',
            floor: 0,
            equipment: [],
            description: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['capacity', 'floor'].includes(name) ? parseInt(value) : value
        }));
    };

    const toggleEquipment = (item) => {
        setFormData(prev => ({
            ...prev,
            equipment: prev.equipment.includes(item)
                ? prev.equipment.filter(e => e !== item)
                : [...prev.equipment, item]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editData) {
                await roomAPI.update(editData._id, formData);
            } else {
                await roomAPI.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Room save error:', error);
            alert(error.response?.data?.message || 'Failed to save room');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className={`fixed inset-0 ${isDark ? 'bg-black/85' : 'bg-black/50'} backdrop-blur-nav`}
                onClick={onClose}
            />

            <div
                className={`relative w-full max-w-2xl mx-4 rounded-elevated p-8 animate-scale-in max-h-[90vh] overflow-y-auto ${isDark
                        ? 'bg-dark-surface border border-dark-border-prominent shadow-modal-dark'
                        : 'bg-light-surface border border-light-border-subtle shadow-modal-light'
                    }`}
            >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-current opacity-20">
                    <h2
                        className={`text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        {editData ? 'Edit Room' : 'Add New Room'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-button transition-smooth ${isDark
                                ? 'text-text-dark-muted hover:text-text-dark-primary hover:bg-white/10'
                                : 'text-text-light-muted hover:text-text-light-primary hover:bg-black/5'
                            }`}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Room Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., LAB 101"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                    }`}
                            >
                                Room Type <span className={isDark ? 'text-semantic-dark-error' : 'text-semantic-light-error'}>*</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-input border transition-smooth ${isDark
                                        ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary focus-ring-dark'
                                        : 'bg-light-surface border-light-border-subtle text-text-light-primary focus-ring-light'
                                    }`}
                                required
                            >
                                {ROOM_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Capacity"
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            min={10}
                            max={500}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Building"
                            type="text"
                            name="building"
                            value={formData.building}
                            onChange={handleChange}
                            placeholder="Main Building"
                            required
                        />

                        <Input
                            label="Floor"
                            type="number"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            min={0}
                            max={20}
                            required
                        />
                    </div>

                    <div>
                        <label
                            className={`block text-small font-medium mb-3 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Equipment
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {EQUIPMENT_OPTIONS.map(item => (
                                <label
                                    key={item}
                                    className={`flex items-center gap-3 p-3 rounded-button border cursor-pointer transition-smooth ${formData.equipment.includes(item)
                                            ? isDark
                                                ? 'bg-indigo/15 border-indigo text-indigo-light'
                                                : 'bg-sage/10 border-sage text-sage'
                                            : isDark
                                                ? 'bg-dark-elevated border-dark-border-subtle text-text-dark-secondary hover:border-dark-border-prominent'
                                                : 'bg-light-elevated border-light-border-subtle text-text-light-secondary hover:border-light-border-prominent'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.equipment.includes(item)}
                                        onChange={() => toggleEquipment(item)}
                                        className="w-4 h-4 rounded accent-current"
                                    />
                                    <span className="text-small">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label
                            className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Additional room details"
                            rows={3}
                            maxLength={300}
                            className={`w-full px-4 py-3 rounded-input border transition-smooth resize-none ${isDark
                                    ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                    : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                                }`}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : editData ? 'Update Room' : 'Create Room'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomForm;