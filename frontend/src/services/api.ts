const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // Wedding Endpoints
  async getWeddings() {
    const res = await fetch(`${API_BASE_URL}/weddings/`);
    if (!res.ok) throw new Error('Failed to fetch weddings');
    return res.json();
  },

  async getWedding(id: string) {
    const res = await fetch(`${API_BASE_URL}/weddings/${id}`);
    if (!res.ok) throw new Error('Wedding not found');
    return res.json();
  },

  async updateWedding(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/weddings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update wedding');
    return res.json();
  },

  // Guest Endpoints
  async getGuests(weddingId: string) {
    const res = await fetch(`${API_BASE_URL}/guests/?wedding_id=${weddingId}`);
    if (!res.ok) throw new Error('Failed to fetch guests');
    return res.json();
  },

  async addGuest(weddingId: string, guestData: any) {
    const res = await fetch(`${API_BASE_URL}/guests/?wedding_id=${weddingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guestData),
    });
    if (!res.ok) throw new Error('Failed to add guest');
    return res.json();
  },

  async getGuestByToken(token: string) {
    const res = await fetch(`${API_BASE_URL}/guests/invite/${token}`);
    if (!res.ok) throw new Error('Invitation not found');
    return res.json();
  },

  async updateRSVP(token: string, rsvpData: any) {
    const res = await fetch(`${API_BASE_URL}/guests/invite/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData),
    });
    if (!res.ok) throw new Error('Failed to submit RSVP');
    return res.json();
  },
};
