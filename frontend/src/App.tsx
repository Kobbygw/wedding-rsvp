import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { InvitePage } from './components/InvitePage';
import { AdminGuard } from './components/AdminGuard';
import type { Wedding, Guest } from './types';
import { useToast } from './hooks/useToast';
import { api } from './services/api';
import './index.css';

const DEFAULT_WEDDING_ID = "f9d7c6b4-8e3d-4c5a-9a1b-2c3d4e5f6a7b";

function AppContent() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, showToast] = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        const weddingData = await api.getWedding(DEFAULT_WEDDING_ID);
        setWedding(weddingData);
        const guestsData = await api.getGuests(DEFAULT_WEDDING_ID);
        setGuests(guestsData);
      } catch (err) {
        showToast("Error connecting to server. Make sure the backend is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleUpdateWedding = async (updatedWedding: Wedding) => {
    try {
      const { id, guests: _guests, ...payload } = updatedWedding as any;
      const res = await api.updateWedding(DEFAULT_WEDDING_ID, payload);
      setWedding(res);
      showToast("Wedding updated successfully ✓");
    } catch (err) {
      showToast("Error updating wedding.");
    }
  };

  const handleAddGuest = async (name: string): Promise<Guest> => {
    try {
      const newGuest = await api.addGuest(DEFAULT_WEDDING_ID, { name });
      setGuests(gs => [...gs, newGuest]);
      return newGuest;
    } catch (err) {
      showToast("Error adding guest.");
      throw err;
    }
  };

  const handleUpdateGuestState = (id: string, patch: Partial<Guest>) => 
    setGuests(gs => gs.map(g => g.id === id ? { ...g, ...patch } as Guest : g));

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} className="serif">Loading Vow & Bloom...</div>;
  if (!wedding) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} className="serif">Unable to load wedding data.</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={
          <AdminGuard>
            <Home 
              onDashboard={() => navigate('/dashboard')} 
              onInvite={(token) => navigate(`/invite/${token}?preview=true`)} 
              guests={guests} 
              wedding={wedding} 
            />
          </AdminGuard>
        } />
        
        <Route path="/dashboard" element={
          <AdminGuard>
            <Dashboard 
              wedding={wedding} 
              guests={guests} 
              setWedding={handleUpdateWedding} 
              addGuest={handleAddGuest} 
              onBack={() => navigate('/')} 
              onPreview={(token) => navigate(`/invite/${token}?preview=true`)} 
              showToast={showToast} 
            />
          </AdminGuard>
        } />
        
        <Route path="/invite/:token" element={<InviteRoute 
          wedding={wedding} 
          updateGuest={handleUpdateGuestState} 
          onBack={() => navigate('/')} 
          showToast={showToast} 
        />} />
      </Routes>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// Helper to extract token from URL params
function InviteRoute({ wedding, updateGuest, onBack, showToast }: any) {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuest() {
      if (!token) return;
      try {
        const data = await api.getGuestByToken(token);
        setGuest(data);
      } catch (err) {
        console.error("Invite not found");
      } finally {
        setLoading(false);
      }
    }
    loadGuest();
  }, [token]);

  if (loading) return <div style={{ minHeight: "100vh" }} />;

  return (
    <InvitePage 
      wedding={wedding} 
      guest={guest} 
      token={token || null} 
      updateGuest={updateGuest} 
      onBack={onBack} 
      showToast={showToast} 
      isPreview={isPreview}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
