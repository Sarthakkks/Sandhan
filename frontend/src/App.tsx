import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Ingest from './pages/Ingest';
import Mapping from './pages/Mapping';
import Graph from './pages/Graph';
import Brief from './pages/Brief';
import Audit from './pages/Audit';
import Login from './pages/Login';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppStore(state => state.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-sandhan-blue-900">
    <Navbar />
    <main className="flex-1 overflow-hidden">{children}</main>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/ingest" element={<PrivateRoute><AppLayout><Ingest /></AppLayout></PrivateRoute>} />
      <Route path="/mapping" element={<PrivateRoute><AppLayout><Mapping /></AppLayout></PrivateRoute>} />
      <Route path="/graph" element={<PrivateRoute><AppLayout><Graph /></AppLayout></PrivateRoute>} />
      <Route path="/brief" element={<PrivateRoute><AppLayout><Brief /></AppLayout></PrivateRoute>} />
      <Route path="/audit" element={<PrivateRoute><AppLayout><Audit /></AppLayout></PrivateRoute>} />
    </Routes>
  );
}

export default App;
