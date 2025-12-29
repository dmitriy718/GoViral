import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreatePost } from './pages/CreatePost';
import { Calendar } from './pages/Calendar';
import { Support } from './pages/Support';
import { CampaignWizard } from './pages/wizard/CampaignWizard';
import { Terms } from './pages/legal/Terms';
import { Toaster } from 'react-hot-toast';

import { Privacy } from './pages/legal/Privacy';
import { Cookies } from './pages/legal/Cookies';
import { About } from './pages/About';
import { KnowledgeBase } from './pages/KnowledgeBase';

import { Settings } from './pages/Settings';
import { ArticleView } from './pages/ArticleView';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Login } from './pages/auth/Login';
import { ActivityLog } from './pages/ActivityLog';

import { RequireAuth } from './components/auth/RequireAuth';

import { ErrorBoundary } from './components/error/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

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
                <Route path="learn" element={<KnowledgeBase />} />
                <Route path="learn/:id" element={<ArticleView />} />
                <Route path="about" element={<About />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
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