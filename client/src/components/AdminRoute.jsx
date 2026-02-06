import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (user && (user.role === 'admin' || user.role === 'moderator')) {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
};

export default AdminRoute;
