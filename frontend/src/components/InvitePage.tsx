import { useState } from 'react';
import type { Wedding, Guest } from '../types';
import { formatDate } from '../utils/helpers';
import { api } from '../services/api';
import { HeroSlideshow } from './HeroSlideshow';

interface InvitePageProps {
  wedding: Wedding;
  guest: Guest | undefined;
  token: string | null;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  onBack: () => void;
  showToast: (msg: string) => void;
  isPreview?: boolean;
}

export function InvitePage({ wedding, guest, updateGuest, onBack, showToast, isPreview }: InvitePageProps) {
  const [submitted, setSubmitted] = useState(guest?.status !== "pending");
  const [form, setForm] = useState({
    name: guest?.name || "",
    attending: "",
    guestCount: 1,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // If token invalid
  if (!guest) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, background: "var(--cream)", textAlign: "center", padding: "0 24px" }}>
        <p className="serif" style={{ fontSize: 28, color: "var(--charcoal)" }}>Invitation Not Found</p>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 400 }}>
          This link may be invalid or expired. Please contact the couple to request your correct, unique invitation link.
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.attending) return;
    setSubmitting(true);
    try {
      const patch = {
        status: form.attending === "yes" ? "attending" : "not_attending",
        plus_one: form.guestCount > 1,
        message: form.message,
        response_date: new Date().toISOString().split("T")[0],
      };
      
      const updatedGuest = await api.updateRSVP(guest.token, patch);
      updateGuest(guest.id, updatedGuest);
      setSubmitted(true);
      showToast("RSVP submitted ✓");
    } catch (err) {
      showToast("Error submitting RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  const alreadyResponded = guest.status !== "pending";
  const isPastDeadline = wedding.rsvp_deadline && new Date().toISOString().split('T')[0] > wedding.rsvp_deadline;
  const heroImages = [wedding.cover_image, ...(wedding.gallery || [])].filter(Boolean) as string[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      {/* Back nav */}
      {isPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(250,247,242,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
          <span className="serif" style={{ fontSize: 20, fontStyle: "italic", color: "var(--charcoal)" }}>Vow & Bloom</span>
          <button className="btn btn-outline btn-sm" onClick={onBack}>← Back</button>
        </div>
      )}

      {/* Hero */}
      <div style={{ position: "relative", height: "85vh", overflow: "hidden", backgroundColor: "var(--charcoal)" }}>
        <HeroSlideshow images={heroImages} />
        <div style={{ position: "absolute", inset: 0, zIndex: 5, background: "linear-gradient(to bottom, rgba(20,14,8,0.2) 0%, rgba(20,14,8,0.7) 75%, var(--cream) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "7%", textAlign: "center", color: "var(--white)", padding: "0 24px 8%" }}>
          <p className="fade-up" style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75, marginBottom: 12, animationDelay: "0.1s" }}>
            You're Invited
          </p>
          <h1 className="serif fade-up" style={{ fontSize: "clamp(48px, 9vw, 90px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.05, marginBottom: 16, animationDelay: "0.2s" }}>
            {wedding.couple_name}
          </h1>
          <p className="fade-up" style={{ fontSize: 14, letterSpacing: 1.5, opacity: 0.8, animationDelay: "0.35s" }}>
            {formatDate(wedding.date)}
          </p>
          <p className="fade-up" style={{ fontSize: 13, opacity: 0.65, marginTop: 4, animationDelay: "0.45s" }}>
            {wedding.location}
          </p>
        </div>
      </div>

      {/* Personal greeting */}
      {guest?.name && (
        <div style={{ textAlign: "center", padding: "40px 24px 0" }}>
          <p style={{ fontSize: 13, color: "var(--muted)", letterSpacing: 0.5 }}>
            Dear <strong style={{ color: "var(--charcoal)", fontWeight: 500 }}>{guest.name}</strong>,
          </p>
        </div>
      )}

      {/* Story */}
      <div style={{ maxWidth: 680, margin: "48px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="ornament serif" style={{ justifyContent: "center", fontSize: 22, marginBottom: 28 }}>✦</div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, marginBottom: 20 }}>Our Story</h2>
        <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--muted)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 300 }}>
          {wedding.story}
        </p>
      </div>

      {/* Details card */}
      <div style={{ maxWidth: 680, margin: "0 auto 48px", padding: "0 24px" }}>
        <div className="card" style={{ textAlign: "center", padding: "36px" }}>
          <div className="grid-2" style={{ gap: 0 }}>
            <div style={{ padding: "16px", borderRight: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Date</div>
              <div className="serif" style={{ fontSize: 18 }}>{formatDate(wedding.date)}</div>
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Location</div>
              <div className="serif" style={{ fontSize: 18 }}>{wedding.location}</div>
            </div>
          </div>
          {wedding.rsvp_deadline && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)", color: "var(--muted)", fontSize: 12, letterSpacing: 0.5 }}>
              Please RSVP by <strong>{formatDate(wedding.rsvp_deadline)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      {heroImages.length > 0 && (
        <div style={{ maxWidth: 900, margin: "0 auto 64px", padding: "0 24px" }}>
          <h2 className="serif" style={{ textAlign: "center", fontSize: 28, fontWeight: 400, marginBottom: 24 }}>Gallery</h2>
          <div className="grid-3" style={{ gap: 10 }}>
            {heroImages.map((src, i) => (
              <div key={i} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: 4 }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registry / Gifting */}
      {(wedding.account_number || wedding.momo_number || wedding.momo_number_2) && (
        <div style={{ maxWidth: 680, margin: "64px auto", padding: "0 24px", textAlign: "center" }}>
          <div className="ornament serif" style={{ justifyContent: "center", fontSize: 22, marginBottom: 28 }}>✦</div>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, marginBottom: 12 }}>Gift of Love</h2>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 32, lineHeight: 1.6 }}>
            Your presence at our wedding is the greatest gift of all. However, if you wish to honour us with a gift, a financial contribution towards our new life together would be sincerely appreciated.
          </p>
          
          <div className="grid-2" style={{ gap: 20 }}>
            {wedding.account_number && (
              <div className="card" style={{ textAlign: "left", padding: "24px" }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Bank Transfer</div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{wedding.bank_name}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>{wedding.account_name}</p>
                </div>
                <div className="row" style={{ justifyContent: "space-between", background: "var(--cream)", padding: "8px 12px", borderRadius: 4 }}>
                  <code style={{ fontSize: 14, fontWeight: 500 }}>{wedding.account_number}</code>
                  <button className="btn btn-outline btn-sm" style={{ padding: "4px 8px" }} onClick={() => {
                    navigator.clipboard.writeText(wedding.account_number!);
                    showToast("Account number copied ✓");
                  }}>Copy</button>
                </div>
              </div>
            )}

            {wedding.momo_number && (
              <div className="card" style={{ textAlign: "left", padding: "24px" }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Mobile Money 1</div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{wedding.momo_name}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>{wedding.couple_name}</p>
                </div>
                <div className="row" style={{ justifyContent: "space-between", background: "var(--cream)", padding: "8px 12px", borderRadius: 4 }}>
                  <code style={{ fontSize: 14, fontWeight: 500 }}>{wedding.momo_number}</code>
                  <button className="btn btn-outline btn-sm" style={{ padding: "4px 8px" }} onClick={() => {
                    navigator.clipboard.writeText(wedding.momo_number!);
                    showToast("Momo number copied ✓");
                  }}>Copy</button>
                </div>
              </div>
            )}

            {wedding.momo_number_2 && (
              <div className="card" style={{ textAlign: "left", padding: "24px" }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Mobile Money 2</div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{wedding.momo_name_2}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>{wedding.couple_name}</p>
                </div>
                <div className="row" style={{ justifyContent: "space-between", background: "var(--cream)", padding: "8px 12px", borderRadius: 4 }}>
                  <code style={{ fontSize: 14, fontWeight: 500 }}>{wedding.momo_number_2}</code>
                  <button className="btn btn-outline btn-sm" style={{ padding: "4px 8px" }} onClick={() => {
                    navigator.clipboard.writeText(wedding.momo_number_2!);
                    showToast("Momo number copied ✓");
                  }}>Copy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RSVP Section */}
      <div style={{ background: "var(--charcoal)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="ornament serif" style={{ justifyContent: "center", fontSize: 22, marginBottom: 24, color: "var(--gold-light)" }}>✦</div>
          <h2 className="serif" style={{ textAlign: "center", fontSize: 36, fontWeight: 300, fontStyle: "italic", color: "var(--white)", marginBottom: 8 }}>
            RSVP
          </h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 40, letterSpacing: 0.5 }}>
            Kindly respond before {formatDate(wedding.rsvp_deadline)}
          </p>

          {submitted || alreadyResponded ? (
            <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
                {guest.status === "attending" ? "✓" : "✗"}
              </div>
              <h3 className="serif" style={{ fontSize: 28, color: "var(--white)", marginBottom: 12, fontWeight: 400 }}>
                {guest.status === "attending" ? "We'll see you there!" : "We'll miss you."}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
                {guest.status === "attending"
                  ? "Thank you — your response has been recorded. We can't wait to celebrate with you!"
                  : "Thank you for letting us know. We'll miss having you there, and we'll be thinking of you."}
              </p>
            </div>
          ) : isPastDeadline ? (
            <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
                ⏳
              </div>
              <h3 className="serif" style={{ fontSize: 28, color: "var(--white)", marginBottom: 12, fontWeight: 400 }}>
                RSVP Closed
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
                The deadline to respond has passed. If you still need to reach us, please contact the couple directly.
              </p>
            </div>
          ) : (
            <div className="stack">
              <div className="field">
                <label className="label" style={{ color: "rgba(255,255,255,0.4)" }}>Your Name</label>
                <input className="input" style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "var(--white)" }}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              <div className="field">
                <label className="label" style={{ color: "rgba(255,255,255,0.4)" }}>Will You Attend?</label>
                <div className="row" style={{ gap: 10 }}>
                  {[["yes", "Joyfully Accepts"], ["no", "Regretfully Declines"]].map(([val, label]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, attending: val }))} style={{
                      flex: 1, padding: "14px 12px", border: "1px solid",
                      borderColor: form.attending === val ? "var(--gold)" : "rgba(255,255,255,0.12)",
                      background: form.attending === val ? "var(--gold)" : "transparent",
                      color: form.attending === val ? "var(--white)" : "rgba(255,255,255,0.55)",
                      fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 500, letterSpacing: 1,
                      textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all 0.2s"
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {form.attending === "yes" && (
                <div className="field">
                  <label className="label" style={{ color: "rgba(255,255,255,0.4)" }}>Number of Guests</label>
                  <select className="select" style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "var(--white)" }}
                    value={form.guestCount} onChange={e => setForm(f => ({ ...f, guestCount: +e.target.value }))}>
                    {[1, 2].map(n => <option key={n} value={n} style={{ background: "var(--charcoal)" }}>{n === 1 ? "Just me (1 person)" : "Me + Plus One (2 people)"}</option>)}
                  </select>
                </div>
              )}

              <div className="field">
                <label className="label" style={{ color: "rgba(255,255,255,0.4)" }}>A Message for the Couple</label>
                <textarea className="textarea" style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "var(--white)" }}
                  placeholder="Share your wishes…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>

              <button className="btn btn-gold" style={{ alignSelf: "stretch", padding: "16px", fontSize: 12, letterSpacing: 2 }}
                onClick={handleSubmit} disabled={!form.attending || submitting}>
                {submitting ? "Submitting…" : "Submit RSVP"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "32px 24px", color: "var(--muted)", fontSize: 12, letterSpacing: 0.5 }}>
        Made with love · <span className="serif" style={{ fontStyle: "italic" }}>Vow & Bloom</span>
      </div>
    </div>
  );
}
