import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { PublicLayout } from './components/layout/PublicLayout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { capturePageview } from './lib/posthog';

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const CreatePost = lazy(() => import('./pages/CreatePost').then((m) => ({ default: m.CreatePost })));
const Calendar = lazy(() => import('./pages/Calendar').then((m) => ({ default: m.Calendar })));
const Support = lazy(() => import('./pages/Support').then((m) => ({ default: m.Support })));
const CampaignWizard = lazy(() => import('./pages/wizard/CampaignWizard').then((m) => ({ default: m.CampaignWizard })));
const Terms = lazy(() => import('./pages/legal/Terms').then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/legal/Privacy').then((m) => ({ default: m.Privacy })));
const Cookies = lazy(() => import('./pages/legal/Cookies').then((m) => ({ default: m.Cookies })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase').then((m) => ({ default: m.KnowledgeBase })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const ArticleView = lazy(() => import('./pages/ArticleView').then((m) => ({ default: m.ArticleView })));
const Login = lazy(() => import('./pages/auth/Login').then((m) => ({ default: m.Login })));
const ActivityLog = lazy(() => import('./pages/ActivityLog').then((m) => ({ default: m.ActivityLog })));
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

const RouteFallback = () => (
  <div className="h-screen w-full flex items-center justify-center text-sm text-muted-foreground">
    Loading...
  </div>
);

const PostHogPageView = () => {
  const location = useLocation();

  useEffect(() => {
    capturePageview(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <PostHogPageView />
      <ErrorBoundary>
        <HelmetProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route element={<PublicLayout />}>
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/learn" element={<KnowledgeBase />} />
                    <Route path="/learn/:id" element={<ArticleView />} />
                  </Route>

                  <Route path="/" element={
                    <RequireAuth>
                      <Layout />
                    </RequireAuth>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="activity" element={<ActivityLog />} />
                    <Route path="wizard" element={<CampaignWizard />} />
                    <Route path="create" element={<CreatePost />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="support" element={<Support />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </WorkspaceProvider>
          </AuthProvider>
        </HelmetProvider>
      </ErrorBoundary>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
    </BrowserRouter>
  );
}

export default App;
