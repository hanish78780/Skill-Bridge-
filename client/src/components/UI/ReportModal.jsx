import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import { X, AlertTriangle } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, targetId, targetModel }) => {
    const [reason, setReason] = useState('Inappropriate Content');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post('/reports', {
                targetId,
                targetModel,
                reason,
                description
            });
            alert('Report submitted successfully. Admins will review it.');
            onClose();
            setDescription('');
        } catch (error) {
            console.error(error);
            alert('Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Report Content
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option>Inappropriate Content</option>
                            <option>Spam or Scam</option>
                            <option>Harassment</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-24 resize-none"
                            placeholder="Please provide more details..."
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="danger" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
