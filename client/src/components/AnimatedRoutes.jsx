
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import ProjectForm from '../pages/ProjectForm';
import Profile from '../pages/Profile';
import AuthSuccess from '../pages/AuthSuccess';
import TalentSearch from '../pages/TalentSearch';
import Chat from '../pages/Chat';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AdminLayout from './Layout/AdminLayout';
import Layout from './Layout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminReports from '../pages/Admin/AdminReports';

const AnimatedRoutes = () => {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public & Protected Routes Wrapped in Main Layout */}
                <Route element={<Layout><Outlet /></Layout>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                    <Route path="/auth/success" element={<AuthSuccess />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/talent" element={<TalentSearch />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/new" element={<ProjectForm />} />
                        <Route path="/projects/:id" element={<ProjectDetails />} />
                        <Route path="/projects/:id/edit" element={<ProjectForm />} />
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reports" element={<AdminReports />} />
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
