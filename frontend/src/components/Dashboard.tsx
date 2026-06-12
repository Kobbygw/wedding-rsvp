import { useState } from 'react';
import type { Wedding, Guest } from '../types';
import { uuid } from '../utils/helpers';

interface DashboardProps {
  wedding: Wedding;
  guests: Guest[];
  setWedding: (w: Wedding) => void;
  addGuest: (name: string) => Promise<Guest>;
  onBack: () => void;
  onPreview: (token: string) => void;
  showToast: (msg: string) => void;
}

export function Dashboard({ wedding, guests, setWedding, addGuest, onBack, onPreview, showToast }: DashboardProps) {
  const [tab, setTab] = useState("event"); // event | guests | add
  const [newGuestName, setNewGuestName] = useState("");
  const [editWedding, setEditWedding] = useState(wedding);
  const [saving, setSaving] = useState(false);

  const totalInvites = guests.length;
  const pendingInvites = guests.filter(g => g.status === "pending").length;
  const declinedInvites = guests.filter(g => g.status === "not_attending").length;
  const expectedGuests = guests
    .filter(g => g.status === "attending")
    .reduce((total, g) => total + (g.plus_one ? 2 : 1), 0);

  const handleSaveEvent = () => {
    setSaving(true);
    setWedding(editWedding);
    setSaving(false);
  };

  const handleAddGuest = async () => {
    if (!newGuestName.trim()) return;
    try {
      const g = await addGuest(newGuestName.trim());
      setNewGuestName("");
      showToast(`Invitation link created for ${g.name}`);
    } catch (err) {
      // Error handled in App.tsx
    }
  };

  const copyLink = (token: string) => {
    navigator.clipboard?.writeText(`${window.location.origin}/invite/${token}`).catch(() => {});
    showToast("Link copied to clipboard ✓");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--parchment)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--charcoal)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <span className="serif" style={{ color: "var(--white)", fontSize: 22, fontStyle: "italic" }}>Vow & Bloom</span>
        <div className="row">
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 1 }}>Couple Dashboard</span>
          <button className="btn btn-outline btn-sm" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }} onClick={onBack}>← Back to Home</button>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Expected Guests", value: expectedGuests, color: "var(--green)" },
            { label: "Invites Sent", value: totalInvites, color: "var(--gold)" },
            { label: "Awaiting Reply", value: pendingInvites, color: "var(--muted)" },
            { label: "Declined", value: declinedInvites, color: "var(--red)" },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 40, fontWeight: 300, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="row" style={{ gap: 0, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
          {[["event", "Wedding Details"], ["guests", "Guest List"], ["add", "Add Guest"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "12px 20px",
              fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: tab === key ? 500 : 300,
              color: tab === key ? "var(--gold)" : "var(--muted)",
              borderBottom: tab === key ? "2px solid var(--gold)" : "2px solid transparent",
              letterSpacing: 0.5, marginBottom: "-1px", transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>

        {/* Tab: Event Details */}
        {tab === "event" && (
          <div className="card fade-in" style={{ maxWidth: 700 }}>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 24 }}>Wedding Details</h2>
            <div className="stack">
              <div className="grid-2">
                <div className="field">
                  <label className="label">Couple Names</label>
                  <input className="input" value={editWedding.couple_name} onChange={e => setEditWedding(w => ({ ...w, couple_name: e.target.value }))} />
                </div>
                <div className="field">
                  <label className="label">Wedding Date</label>
                  <input className="input" type="date" value={editWedding.date} onChange={e => setEditWedding(w => ({ ...w, date: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label className="label">Location</label>
                <input className="input" value={editWedding.location} onChange={e => setEditWedding(w => ({ ...w, location: e.target.value }))} />
              </div>
              <div className="field">
                <label className="label">Wedding Story</label>
                <textarea className="textarea" style={{ minHeight: 120 }} value={editWedding.story} onChange={e => setEditWedding(w => ({ ...w, story: e.target.value }))} />
              </div>
              <div className="field">
                <label className="label">RSVP Deadline</label>
                <input className="input" type="date" value={editWedding.rsvp_deadline} onChange={e => setEditWedding(w => ({ ...w, rsvp_deadline: e.target.value }))} />
              </div>

              {/* Gifting Section in Dashboard */}
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <h3 className="serif" style={{ fontSize: 20, marginBottom: 16 }}>Gifting & Registry (Optional)</h3>
                <div className="stack" style={{ gap: 20 }}>
                  <div className="grid-2">
                    <div className="field">
                      <label className="label">Bank Name</label>
                      <input className="input" placeholder="e.g. Standard Chartered" value={editWedding.bank_name || ""} onChange={e => setEditWedding(w => ({ ...w, bank_name: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label className="label">Account Number</label>
                      <input className="input" placeholder="1234567890" value={editWedding.account_number || ""} onChange={e => setEditWedding(w => ({ ...w, account_number: e.target.value }))} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Account Holder Name</label>
                    <input className="input" placeholder="Name as it appears on account" value={editWedding.account_name || ""} onChange={e => setEditWedding(w => ({ ...w, account_name: e.target.value }))} />
                  </div>
                  <div className="ornament" style={{ margin: "8px 0" }}></div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="label">Mobile Money 1 Name</label>
                      <input className="input" placeholder="e.g. MTN Momo / Telecel" value={editWedding.momo_name || ""} onChange={e => setEditWedding(w => ({ ...w, momo_name: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label className="label">Mobile Money 1 Number</label>
                      <input className="input" placeholder="024XXXXXXX" value={editWedding.momo_number || ""} onChange={e => setEditWedding(w => ({ ...w, momo_number: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="field">
                      <label className="label">Mobile Money 2 Name</label>
                      <input className="input" placeholder="e.g. Vodafone Cash" value={editWedding.momo_name_2 || ""} onChange={e => setEditWedding(w => ({ ...w, momo_name_2: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label className="label">Mobile Money 2 Number</label>
                      <input className="input" placeholder="020XXXXXXX" value={editWedding.momo_number_2 || ""} onChange={e => setEditWedding(w => ({ ...w, momo_number_2: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button className="btn btn-outline" onClick={() => onPreview(guests[0]?.token)}>Preview Guest View</button>
                <button className="btn btn-gold" onClick={handleSaveEvent} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Guest List */}
        {tab === "guests" && (
          <div className="fade-in">
            <div className="card" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Guest Name", "Invitation Link", "Status", "Plus One", "Message", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g, i) => (
                    <tr key={g.id} style={{ borderBottom: "1px solid var(--parchment)", animation: `fadeUp 0.5s ease ${i * 0.06}s both` }}>
                      <td style={{ padding: "14px", fontWeight: 400, fontSize: 14 }}>{g.name}</td>
                      <td style={{ padding: "14px" }}>
                        <div className="row" style={{ gap: 6 }}>
                          <code style={{ fontSize: 11, color: "var(--muted)", background: "var(--parchment)", padding: "3px 8px", borderRadius: 2 }}>/invite/{g.token}</code>
                          <button className="btn btn-outline btn-sm" onClick={() => copyLink(g.token)}>Copy</button>
                        </div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span className={`badge badge-${g.status === "attending" ? "yes" : g.status === "not_attending" ? "no" : "pending"}`}>
                          {g.status === "attending" ? "Attending" : g.status === "not_attending" ? "Declined" : "Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "14px", fontSize: 13, color: "var(--muted)" }}>{g.plus_one ? "Yes" : "—"}</td>
                      <td style={{ padding: "14px", fontSize: 12, color: "var(--muted)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {g.message || "—"}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <button className="btn btn-outline btn-sm" onClick={() => onPreview(g.token)}>View Invite</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Add Guest */}
        {tab === "add" && (
          <div className="card fade-in" style={{ maxWidth: 480 }}>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Add a Guest</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
              Enter the guest's name and we'll generate a unique invitation link you can share via WhatsApp, SMS, or email.
            </p>
            <div className="stack">
              <div className="field">
                <label className="label">Guest Name</label>
                <input className="input" placeholder="e.g. Sophia Marchetti" value={newGuestName}
                  onChange={e => setNewGuestName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddGuest()} />
              </div>
              <div style={{ background: "var(--parchment)", border: "1px solid var(--border)", borderRadius: 4, padding: "14px 16px" }}>
                <p style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Generated link preview</p>
                <code style={{ fontSize: 13, color: "var(--gold)" }}>
                  {window.location.origin}/invite/<span style={{ color: "var(--charcoal)" }}>{newGuestName ? uuid().slice(0, 8) : "xxxxxxxx"}</span>
                </code>
              </div>
              <button className="btn btn-gold" onClick={handleAddGuest} style={{ alignSelf: "flex-start" }}>
                Generate Invitation Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
