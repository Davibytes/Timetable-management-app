import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, DoorOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { roomAPI } from '../services/api';
import { canManageContent, isAdmin } from '../utils/rbac';
import DashboardLayout from '../components/DashboardLayout';
import RoomForm from '../components/RoomForm';
import RoomDetailModal from '../components/RoomDetailModal';
import Button from '../components/Button';

const RoomsPage = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const toast = useToast();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const canCreate = canManageContent(user);
    const canEdit = canManageContent(user);
    const canDelete = isAdmin(user);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await roomAPI.getAll();
            setRooms(response.data.data.rooms);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
            toast.error('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await roomAPI.delete(id);
            toast.success('Room deleted successfully');
            fetchRooms();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete room');
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setIsFormOpen(true);
    };

    const handleViewDetails = (room) => {
        setSelectedRoom(room);
        setIsDetailOpen(true);
    };

    const handleFormSuccess = () => {
        toast.success(editingRoom ? 'Room updated successfully' : 'Room created successfully');
        setEditingRoom(null);
        fetchRooms();
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Rooms">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1
                        className={`text-h2 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        Rooms
                    </h1>
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        {canCreate ? 'Manage classroom and facility spaces' : 'View available rooms'}
                    </p>
                </div>
                {canCreate && (
                    <Button
                        variant="primary"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => {
                            setEditingRoom(null);
                            setIsFormOpen(true);
                        }}
                    >
                        Add Room
                    </Button>
                )}
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                            }`}
                    />
                    <input
                        type="text"
                        placeholder="Search rooms by name, building, or type"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-input border transition-smooth ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                            }`}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div
                        className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'
                            }`}
                    />
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        Loading rooms...
                    </p>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div
                    className={`rounded-card p-12 text-center border ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <DoorOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-indigo-light' : 'text-sage'}`} />
                    <h3
                        className={`text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        {searchTerm ? 'No rooms found' : 'No rooms yet'}
                    </h3>
                    <p
                        className={`text-body max-w-md mx-auto mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                            }`}
                    >
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : canCreate
                                ? 'Get started by adding your first room'
                                : 'No rooms available at the moment'}
                    </p>
                    {!searchTerm && canCreate && (
                        <Button
                            variant="primary"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => {
                                setEditingRoom(null);
                                setIsFormOpen(true);
                            }}
                        >
                            Add Room
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map(room => {
                        const showActions = canEdit || canDelete;

                        return (
                            <div
                                key={room._id}
                                className={`rounded-card p-6 border transition-smooth-300 cursor-pointer ${isDark
                                        ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark card-hover-dark'
                                        : 'bg-light-surface border-light-border-subtle shadow-card-light card-hover-light'
                                    }`}
                                onClick={() => handleViewDetails(room)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className={`text-h4 font-comfortaa font-semibold mb-1 truncate ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                                }`}
                                        >
                                            {room.name}
                                        </h3>
                                        <p
                                            className={`text-small mb-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                                }`}
                                        >
                                            {room.building}, Floor {room.floor}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Type:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {room.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Capacity:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {room.capacity} students
                                        </span>
                                    </div>
                                </div>

                                {room.equipment && room.equipment.length > 0 && (
                                    <div className="mb-4">
                                        <p
                                            className={`text-caption mb-2 ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                                                }`}
                                        >
                                            Equipment:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {room.equipment.slice(0, 3).map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 rounded-tag text-caption ${isDark
                                                            ? 'bg-indigo/15 text-indigo-light'
                                                            : 'bg-sage/10 text-sage'
                                                        }`}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                            {room.equipment.length > 3 && (
                                                <span
                                                    className={`px-2 py-1 rounded-tag text-caption ${isDark
                                                            ? 'bg-dark-elevated text-text-dark-muted'
                                                            : 'bg-light-elevated text-text-light-muted'
                                                        }`}
                                                >
                                                    +{room.equipment.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {showActions && (
                                    <div className="flex items-center gap-2 pt-4 border-t border-current opacity-20">
                                        {canEdit && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(room);
                                                }}
                                                className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-text-dark-primary hover:bg-white/10'
                                                        : 'text-text-light-secondary hover:text-text-light-primary hover:bg-black/5'
                                                    }`}
                                                aria-label="Edit room"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(room._id, room.name);
                                                }}
                                                className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-semantic-dark-error hover:bg-semantic-dark-error/10'
                                                        : 'text-text-light-secondary hover:text-semantic-light-error hover:bg-semantic-light-error/10'
                                                    }`}
                                                aria-label="Delete room"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {canCreate && (
                <RoomForm
                    isOpen={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingRoom(null);
                    }}
                    onSuccess={handleFormSuccess}
                    editData={editingRoom}
                />
            )}

            <RoomDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedRoom(null);
                }}
                room={selectedRoom}
            />
        </DashboardLayout>
    );
};

export default RoomsPage;