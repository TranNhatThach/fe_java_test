import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import LandingPage from './pages/LandingPage';
import { PrivateRoute } from './components/PrivateRoute';
import { StudentLayout } from './layouts/StudentLayout';
import { TutorLayout } from './layouts/TutorLayout';
import { SearchTutorsPage } from './pages/student/SearchTutorsPage';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { JobListPage } from './pages/tutor/JobListPage';
import { TutorDashboardPage } from './pages/tutor/TutorDashboardPage';
import { MyClassesPage } from './pages/shared/MyClassesPage';
import { TutorProfilePage } from './pages/tutor/TutorProfilePage';
import { TutorDetailPage } from './pages/student/TutorDetailPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentApplicantsPage } from './pages/student/StudentApplicantsPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/error/NotFoundPage';
import ServerErrorPage from './pages/error/ServerErrorPage';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<UsersPage />} />

          {/* Student Routes */}
          <Route path="/student" element={<PrivateRoute allowedRole="HOC_VIEN" />}>
            <Route element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="search" element={<SearchTutorsPage />} />
              <Route path="classes" element={<MyClassesPage />} />
              <Route path="tutor/:id" element={<TutorDetailPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="applicants" element={<StudentApplicantsPage />} />
              <Route path="payments" element={<div className="p-8"><h1 className="text-2xl font-bold font-sans">Thanh toán</h1><p className="text-slate-500">Lịch sử giao dịch và hóa đơn</p></div>} />
            </Route>
          </Route>

          {/* Tutor Routes */}
          <Route path="/tutor" element={<PrivateRoute allowedRole="GIA_SU" />}>
            <Route element={<TutorLayout />}>
              <Route path="dashboard" element={<TutorDashboardPage />} />
              <Route path="jobs" element={<JobListPage />} />
              <Route path="invitations" element={<div>Lời mời dạy (Coming Soon)</div>} />
              <Route path="classes" element={<MyClassesPage />} />
              <Route path="profile" element={<TutorProfilePage />} />
              <Route path="payments" element={<div className="p-8"><h1 className="text-2xl font-bold font-sans">Thu nhập</h1><p className="text-slate-500">Thống kê thu nhập và rút tiền</p></div>} />
            </Route>
          </Route>

          {/* Error Routes */}
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
