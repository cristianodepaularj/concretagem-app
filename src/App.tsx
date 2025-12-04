import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';

import { PreSchedule } from './pages/PreSchedule';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminApprovals } from './pages/AdminApprovals';
import { AdminUsers } from './pages/AdminUsers';
import { CalendarView } from './pages/CalendarView';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/login" replace />} />

              {/* Consultant Routes */}
              <Route path="pre-schedule" element={<PreSchedule />} />
              <Route path="calendar" element={<CalendarView />} />

              {/* Admin Routes */}
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/approvals" element={<AdminApprovals />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
