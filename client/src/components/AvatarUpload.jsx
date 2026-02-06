
import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AvatarUpload = ({ currentAvatar, onUploadSuccess }) => {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { user, setUser } = useAuth(); // Need to update global user state too if we want immediate navbar update

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleUpload = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await axios.post('/auth/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update preview
            setPreview(URL.createObjectURL(file));

            // Callback to parent
            if (onUploadSuccess) {
                onUploadSuccess(res.data.avatar);
            }

            // Optional: Update global auth context user if you had a setter exposed there
            // But usually we just refresh the profile page data.
            // A better way is to update the user object in local storage and context.
            // For now, valid profile page refresh is enough.

        } catch (err) {
            console.error(err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const avatarSrc = preview || (currentAvatar ? (currentAvatar.startsWith('http') ? currentAvatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${currentAvatar}`) : null);

    return (
        <div className="relative group">
            <div
                className="h-32 w-32 rounded-full border-4 border-white bg-gray-100 shadow-md flex items-center justify-center overflow-hidden cursor-pointer relative"
                onClick={triggerFileSelect}
            >
                {avatarSrc ? (
                    <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                    <div className="text-4xl font-bold text-gray-400">
                        {user?.name?.charAt(0)}
                    </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="h-8 w-8 text-white" />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
            />

            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}
        </div>
    );
};

export default AvatarUpload;
