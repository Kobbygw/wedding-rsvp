import type { Wedding, Guest } from '../types';
import { HeroSlideshow } from './HeroSlideshow';

interface HomeProps {
  onDashboard: () => void;
  onInvite: (token: string) => void;
  guests: Guest[];
  wedding: Wedding;
}

export function Home({ onDashboard, onInvite, guests, wedding }: HomeProps) {
  const heroImages = [wedding.cover_image, ...(wedding.gallery || [])].filter(Boolean) as string[];

  return (
    <div style={{ background: "var(--cream)" }}>
      {/* ─── Hero Section ─── */}
      <div style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", backgroundColor: "var(--charcoal)" }}>
        <HeroSlideshow images={heroImages} />
        <div style={{ position: "absolute", inset: 0, zIndex: 5, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 100%)" }} />
        
        <div className="container" style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center" }}>
          <div className="glass-dark fade-up" style={{ padding: "48px", maxWidth: 540, borderRadius: 4, color: "var(--white)" }}>
            <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 16 }}>The Modern Wedding RSVP</p>
            <h1 className="serif" style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, marginBottom: 24, fontWeight: 300 }}>
              Celebrate your love, <br />
              <span style={{ fontStyle: "italic" }}>effortlessly.</span>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.8, marginBottom: 32, fontWeight: 300 }}>
              Ditch the generic templates. Vow & Bloom provides an elegant, personalized invitation experience for every guest on your list.
            </p>
            <div className="row" style={{ gap: 16 }}>
              <button className="btn btn-gold" onClick={onDashboard}>Manage Your Event</button>
              <button className="btn btn-outline" style={{ color: "var(--white)", borderColor: "rgba(255,255,255,0.3)" }} 
                onClick={() => {
                  const token = guests.find(g => g.status === "pending")?.token || guests[0]?.token;
                  if (token) onInvite(token);
                }}>
                View Demo Invite
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", zIndex: 10, bottom: 32, left: "50%", transform: "translateX(-50%)", color: "var(--white)", opacity: 0.5, textAlign: "center" }}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Explore</p>
          <div style={{ width: 1, height: 40, background: "var(--white)", margin: "0 auto" }} />
        </div>
      </div>

      {/* ─── The Experience Section ─── */}
      <div style={{ padding: "100px 0", background: "var(--white)" }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: "center", gap: 80 }}>
            <div className="fade-in">
              <h2 className="serif" style={{ fontSize: 42, fontWeight: 400, marginBottom: 24 }}>A personalized experience for every guest.</h2>
              <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.8, marginBottom: 32 }}>
                Every guest receives a unique link that welcomes them by name. Show your story, share your gallery, and collect RSVPs with a single tap. No accounts, no apps, just pure elegance.
              </p>
              <div className="stack" style={{ gap: 24 }}>
                {[
                  { t: "Personalized Greetings", d: "Address your guests by name the moment they open their link." },
                  { t: "Live Tracking", d: "Watch your guest list grow in real-time with instant dashboard updates." },
                  { t: "Gifting Made Simple", d: "Provide bank and Momo details respectfully for those who wish to support." }
                ].map(item => (
                  <div key={item.t} className="row" style={{ alignItems: "flex-start", gap: 16 }}>
                    <div style={{ color: "var(--gold)", fontSize: 20 }}>✦</div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.t}</h4>
                      <p style={{ fontSize: 13, color: "var(--muted)" }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="phone-mockup floating">
                <img src={wedding.cover_image || ""} alt="" style={{ width: "100%", height: "45%", objectFit: "cover" }} />
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>You're Invited</p>
                  <h3 className="serif" style={{ fontSize: 24, fontStyle: "italic", marginBottom: 12 }}>Emma & Daniel</h3>
                  <div style={{ width: 30, height: 1, background: "var(--gold)", margin: "0 auto 16px" }} />
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>Kindly respond before August 1st, 2025</p>
                  <div style={{ marginTop: 24, padding: "12px", border: "1px solid var(--gold-pale)", borderRadius: 4 }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "var(--gold)" }}>✓ Attending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── How it Works ─── */}
      <div style={{ padding: "100px 0", background: "var(--parchment)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="serif" style={{ fontSize: 42, fontWeight: 400, marginBottom: 64 }}>Three steps to perfect planning.</h2>
          <div className="grid-3" style={{ gap: 40 }}>
            {[
              { n: "01", t: "Craft Your Story", d: "Input your wedding details, upload your favourite photos, and set your RSVP deadline." },
              { n: "02", t: "Invite Your Circle", d: "Generate unique links for each guest and share them via WhatsApp, SMS, or Email." },
              { n: "03", t: "Manage with Ease", d: "Track attendance, plus-ones, and heartfelt messages from your dedicated dashboard." }
            ].map(step => (
              <div key={step.n} style={{ textAlign: "left", padding: "32px", background: "var(--white)", borderRadius: 4, border: "1px solid var(--border)" }}>
                <div className="step-number" style={{ marginBottom: 16 }}>{step.n}</div>
                <h3 className="serif" style={{ fontSize: 24, marginBottom: 12 }}>{step.t}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA Section ─── */}
      <div style={{ padding: "120px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <h2 className="serif" style={{ fontSize: 48, fontWeight: 300, marginBottom: 24 }}>Ready to start your journey?</h2>
          <p style={{ fontSize: 18, color: "var(--muted)", marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Join hundreds of couples who have simplified their wedding planning with Vow & Bloom.
          </p>
          <button className="btn btn-gold btn-lg" style={{ padding: "18px 48px", fontSize: 14 }} onClick={onDashboard}>
            Create Your Wedding Dashboard
          </button>
        </div>
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "var(--gold-pale)", opacity: 0.3 }} />
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%", background: "var(--gold-pale)", opacity: 0.3 }} />
      </div>

      {/* ─── Footer ─── */}
      <footer style={{ padding: "48px 0", borderTop: "1px solid var(--border)", background: "var(--white)" }}>
        <div className="container">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <span className="serif" style={{ fontSize: 24, fontStyle: "italic" }}>Vow & Bloom</span>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>© 2026 Pennytech OS · Made with love for your special day.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
