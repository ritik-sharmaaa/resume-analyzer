/* ============================================================
   AI Resume Analyzer — Pages Renderer
   Renders all pages into #app container based on hash route
   ============================================================ */

const Pages = {
  /** Dispatch to correct page renderer */
  render(page) {
    const app = document.getElementById('app');
    if (!app) return;

    // Fade transition
    app.style.opacity = '0';
    setTimeout(() => {
      switch (page) {
        case 'home':      app.innerHTML = this.home();      break;
        case 'about':     app.innerHTML = this.about();     break;
        case 'features':  app.innerHTML = this.features();  break;
        case 'contact':   app.innerHTML = this.contact();   break;
        case 'login':     app.innerHTML = this.login();     break;
        case 'signup':    app.innerHTML = this.signup();    break;
        case 'dashboard': app.innerHTML = this.dashboard(); break;
        case 'analyzer':  app.innerHTML = this.analyzer();  break;
        case 'result':    app.innerHTML = this.result();    break;
        case 'profile':   app.innerHTML = this.profile();   break;
        default:          app.innerHTML = this.notFound();  break;
      }
      app.style.opacity = '1';
      app.style.transition = 'opacity 0.35s ease';
      this.bindEvents(page);
      window.scrollTo(0, 0);
    }, 120);
  },

  // ──────────────────────────────────────────────
  // PUBLIC NAV (shared across public pages)
  // ──────────────────────────────────────────────
  publicNav() {
    const authLinks = App.currentUser
      ? `<div class="nav-cta">
           <button class="btn btn-primary btn-sm" onclick="App.navigate('dashboard')">Dashboard</button>
         </div>`
      : `<div class="nav-cta">
           <button class="btn btn-secondary btn-sm" onclick="App.navigate('login')">Login</button>
           <button class="btn btn-primary btn-sm" onclick="App.navigate('signup')">Sign Up</button>
         </div>`;

    return `
    <nav class="public-nav">
      <div class="logo-mark" style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="App.navigate('home')">
        <div class="logo-icon">✦</div>
        <span class="logo-text">ResumeAI</span>
      </div>
      <div class="nav-links">
        <a onclick="App.navigate('home')" style="cursor:pointer">Home</a>
        <a onclick="App.navigate('about')" style="cursor:pointer">About</a>
        <a onclick="App.navigate('features')" style="cursor:pointer">Features</a>
        <a onclick="App.navigate('contact')" style="cursor:pointer">Contact</a>
      </div>
      ${authLinks}
    </nav>`;
  },

  // ──────────────────────────────────────────────
  // SIDEBAR (shared across dashboard pages)
  // ──────────────────────────────────────────────
  sidebar(active) {
    const u = App.currentUser;
    const links = [
      { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
      { id: 'analyzer',  icon: '◈', label: 'Analyze Resume' },
      { id: 'profile',   icon: '◉', label: 'Profile' },
    ];
    const publicLinks = [
      { id: 'home',     icon: '⌂', label: 'Home' },
      { id: 'features', icon: '◇', label: 'Features' },
      { id: 'contact',  icon: '✉', label: 'Contact' },
    ];

    return `
    <div class="sidebar-overlay" onclick="UI.closeSidebar()"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-mark">
          <div class="logo-icon">✦</div>
          <span class="logo-text">ResumeAI</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        ${links.map(l => `
          <button class="nav-link ${active === l.id ? 'active' : ''}" onclick="App.navigate('${l.id}');UI.closeSidebar()">
            <span class="nav-icon">${l.icon}</span> ${l.label}
          </button>`).join('')}
        <div class="nav-section-label" style="margin-top:8px">Explore</div>
        ${publicLinks.map(l => `
          <button class="nav-link" onclick="App.navigate('${l.id}');UI.closeSidebar()">
            <span class="nav-icon">${l.icon}</span> ${l.label}
          </button>`).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar">${u?.avatar || '?'}</div>
          <div class="user-info">
            <div class="user-name">${u?.name || 'User'}</div>
            <div class="user-email">${u?.email || ''}</div>
          </div>
        </div>
        <button class="btn-logout" onclick="Auth.logout()">⎋ &nbsp;Sign Out</button>
      </div>
    </aside>`;
  },

  // ──────────────────────────────────────────────
  // TOPBAR
  // ──────────────────────────────────────────────
  topbar(title) {
    return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="hamburger" onclick="UI.toggleSidebar()">☰</button>
        <span class="topbar-title">${title}</span>
      </div>
      <div class="topbar-right">
        <span class="badge badge-gold">✦ AI Powered</span>
      </div>
    </header>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: HOME
  // ──────────────────────────────────────────────
  home() {
    return `
    ${this.publicNav()}
    <main style="padding-top:68px">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg"></div>
        <span class="hero-eyebrow">✦ AI-Powered Career Tools</span>
        <h1 class="hero-title">
          Land Your Dream Job<br>with <span class="accent">AI Resume Analyzer</span>
        </h1>
        <p class="hero-sub">
          Instantly analyze your resume against job requirements, get an ATS score,
          and receive expert suggestions to maximize your interview chances.
        </p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" onclick="App.navigate(App.currentUser ? 'analyzer' : 'signup')">
            ◈ &nbsp;Analyze Resume
          </button>
          <button class="btn btn-secondary btn-lg" onclick="App.navigate('features')">
            Explore Features
          </button>
        </div>
        <!-- Floating stats -->
        <div style="display:flex;gap:20px;margin-top:56px;flex-wrap:wrap;justify-content:center;animation:fadeUp 0.6s 0.5s ease both;opacity:0">
          ${[['10k+','Resumes Analyzed'],['92%','ATS Accuracy'],['4.9★','User Rating']].map(([v,l]) => `
          <div style="text-align:center;padding:16px 28px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg)">
            <div style="font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--gold)">${v}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:3px">${l}</div>
          </div>`).join('')}
        </div>
      </section>

      <!-- Features Preview -->
      <section class="section">
        <p class="hero-eyebrow" style="margin:0 auto 16px">What We Offer</p>
        <h2 class="section-title">Everything You Need to Get Hired</h2>
        <p class="section-sub">Our AI analyzes your resume across multiple dimensions to give you a comprehensive edge.</p>
        <div class="features-grid">
          ${[
            ['🎯','ATS Score Analysis','Get a precise ATS compatibility score so you know exactly where you stand before applying.'],
            ['🔍','Skill Gap Detection','Instantly see which in-demand skills are missing from your resume and need to be added.'],
            ['💡','Smart Suggestions','Receive personalized, actionable improvement tips based on industry best practices.'],
            ['📄','PDF Parsing','Upload any PDF resume — our engine extracts and analyzes the full content automatically.'],
            ['📊','History Dashboard','Track all your previous analyses and monitor your improvement over time.'],
            ['⚡','Instant Results','Get a full analysis in seconds, not minutes. No waiting, no forms, no uploads to a server.'],
          ].map(([icon, title, desc]) => `
          <div class="feature-card">
            <span class="feature-icon">${icon}</span>
            <h3 class="feature-title">${title}</h3>
            <p class="feature-desc">${desc}</p>
          </div>`).join('')}
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section" style="padding-top:0">
        <h2 class="section-title">Loved by Job Seekers</h2>
        <p class="section-sub">Thousands of candidates have improved their resumes and landed interviews.</p>
        <div class="testimonials-grid">
          ${[
            ['Sarah K.','Software Engineer','ResumeAI gave me a 78 ATS score and specific tips to reach 91. I got 3 interviews the following week!'],
            ['Marcus T.','Data Analyst','I had no idea my resume was missing key SQL and Python keywords. Fixed it in 10 minutes and started getting callbacks.'],
            ['Priya M.','Product Manager','The suggestions were incredibly specific and actionable. Much better than generic resume advice online.'],
          ].map(([name, role, text]) => `
          <div class="testimonial-card">
            <p class="testimonial-text">"${text}"</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">${name[0]}</div>
              <div>
                <div class="testimonial-name">${name}</div>
                <div class="testimonial-role">${role}</div>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </section>

      <!-- CTA Banner -->
      <section style="padding:0 48px 80px;max-width:1200px;margin:0 auto">
        <div style="background:linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.04));border:1px solid var(--border-glow);border-radius:var(--radius-xl);padding:56px;text-align:center">
          <h2 style="font-family:var(--font-display);font-size:2.4rem;margin-bottom:12px">Ready to Optimize Your Resume?</h2>
          <p style="color:var(--text-secondary);margin-bottom:28px;max-width:460px;margin-left:auto;margin-right:auto">
            Join thousands of job seekers who boosted their ATS score with our AI analyzer.
          </p>
          <button class="btn btn-primary btn-lg" onclick="App.navigate(App.currentUser ? 'analyzer' : 'signup')">
            Get Started Free →
          </button>
        </div>
      </section>

      ${this.footer()}
    </main>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: ABOUT
  // ──────────────────────────────────────────────
  about() {
    return `
    ${this.publicNav()}
    <main style="padding-top:68px">
      <section class="about-hero">
        <div style="text-align:center;margin-bottom:48px">
          <span class="hero-eyebrow" style="margin:0 auto 16px">Our Story</span>
          <h1 class="hero-title" style="font-size:clamp(2.5rem,5vw,4rem)">Built for Job Seekers,<br>by <span class="accent">Builders</span></h1>
          <p class="hero-sub" style="margin-top:16px">
            ResumeAI was born from frustration — too many qualified candidates were being filtered out by ATS systems before a human ever read their resume. We built the tool we wished we had.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:60px">
          <div class="card">
            <h3 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:10px">Our Mission</h3>
            <p style="color:var(--text-secondary);line-height:1.8">
              To democratize access to career-optimization tools that were previously only available to those with expensive career coaches. Every job seeker deserves a fair shot.
            </p>
          </div>
          <div class="card">
            <h3 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:10px">Our Vision</h3>
            <p style="color:var(--text-secondary);line-height:1.8">
              A world where your skills and experience — not formatting knowledge or keyword tricks — determine whether you get an interview.
            </p>
          </div>
        </div>

        <h2 class="section-title" style="margin-bottom:32px">Meet the Team</h2>
        <div class="team-grid">
          ${[
            ['AK','Arjun Kumar','Founder & CEO'],
            ['PS','Priya Sharma','Lead Engineer'],
            ['MR','Marcus Rivera','AI/ML Engineer'],
            ['SL','Soo-Yeon Lee','Product Design'],
          ].map(([init, name, role]) => `
          <div class="team-card">
            <div class="team-avatar">${init}</div>
            <div class="team-name">${name}</div>
            <div class="team-role">${role}</div>
          </div>`).join('')}
        </div>
      </section>

      ${this.footer()}
    </main>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: FEATURES
  // ──────────────────────────────────────────────
  features() {
    const feats = [
      ['🤖','AI-Powered Analysis','Advanced keyword extraction and semantic matching against industry job requirements.'],
      ['📊','ATS Score','Proprietary scoring algorithm modeled after how real Applicant Tracking Systems rank resumes.'],
      ['🔑','Skill Detection','Automatically identifies 15+ in-demand skills and flags gaps that could cost you the interview.'],
      ['💡','Tailored Suggestions','Context-aware improvement suggestions specific to your resume content.'],
      ['📈','Progress Tracking','Every analysis is saved so you can see your score improve over time.'],
      ['🔒','Privacy First','Your resume never leaves your browser. All analysis is done client-side.'],
      ['⚡','Instant Results','Full analysis in under 3 seconds — no sign-up required to try.'],
      ['📱','Mobile Friendly','Works perfectly on any device — desktop, tablet, or phone.'],
      ['📥','Download Report','Export your analysis as a summary you can refer back to when updating your resume.'],
    ];
    return `
    ${this.publicNav()}
    <main style="padding-top:68px">
      <section class="section">
        <span class="hero-eyebrow" style="margin:0 auto 16px">Capabilities</span>
        <h1 class="section-title">Powerful Features</h1>
        <p class="section-sub">Everything built to give you a measurable edge in your job search.</p>
        <div class="features-grid">
          ${feats.map(([icon, title, desc]) => `
          <div class="feature-card">
            <span class="feature-icon">${icon}</span>
            <h3 class="feature-title">${title}</h3>
            <p class="feature-desc">${desc}</p>
          </div>`).join('')}
        </div>
      </section>

      <!-- Comparison table -->
      <section class="section" style="padding-top:0">
        <h2 class="section-title" style="margin-bottom:32px">Why ResumeAI?</h2>
        <div class="card" style="overflow:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
            <thead>
              <tr style="border-bottom:1px solid var(--border)">
                <th style="text-align:left;padding:12px 16px;color:var(--text-muted);font-weight:500">Feature</th>
                <th style="padding:12px 16px;color:var(--gold);font-weight:600">ResumeAI</th>
                <th style="padding:12px 16px;color:var(--text-muted);font-weight:500">Others</th>
              </tr>
            </thead>
            <tbody>
              ${[
                ['Instant ATS Score','✓','✓'],
                ['Client-side Privacy','✓','✗'],
                ['Skill Gap Analysis','✓','Partial'],
                ['Actionable Suggestions','✓','Generic'],
                ['Free to Use','✓','Paid'],
                ['No Account Required','Try it free','Required'],
              ].map(([f,a,b]) => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 16px;color:var(--text-secondary)">${f}</td>
                <td style="padding:12px 16px;text-align:center;color:var(--success);font-weight:600">${a}</td>
                <td style="padding:12px 16px;text-align:center;color:var(--text-muted)">${b}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>

      ${this.footer()}
    </main>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: CONTACT
  // ──────────────────────────────────────────────
  contact() {
    return `
    ${this.publicNav()}
    <main style="padding-top:68px">
      <section class="section">
        <span class="hero-eyebrow" style="margin:0 auto 16px">Get In Touch</span>
        <h1 class="section-title">Contact Us</h1>
        <p class="section-sub">Have questions or feedback? We'd love to hear from you.</p>

        <div class="contact-grid" style="max-width:900px;margin:0 auto">
          <!-- Contact info -->
          <div style="display:flex;flex-direction:column;gap:16px">
            ${[
              ['📧','Email','hello@resumeai.app'],
              ['🐦','Twitter','@resumeai'],
              ['💼','LinkedIn','linkedin.com/company/resumeai'],
              ['📍','Location','San Francisco, CA'],
            ].map(([icon, label, val]) => `
            <div class="card" style="display:flex;align-items:center;gap:14px">
              <span style="font-size:1.4rem">${icon}</span>
              <div>
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">${label}</div>
                <div style="font-weight:500;margin-top:2px">${val}</div>
              </div>
            </div>`).join('')}
          </div>

          <!-- Contact form -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom:20px">Send a Message</h3>
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <input class="form-input" id="contact-name" type="text" placeholder="Jane Smith">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" id="contact-email" type="email" placeholder="jane@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea class="form-input" id="contact-msg" placeholder="Tell us how we can help…"></textarea>
            </div>
            <button class="btn btn-primary" style="width:100%" id="contact-submit">Send Message ✉</button>
          </div>
        </div>
      </section>
      ${this.footer()}
    </main>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: LOGIN
  // ──────────────────────────────────────────────
  login() {
    return `
    <div class="auth-page">
      <div class="auth-card page-content">
        <div class="auth-logo">
          <div class="logo-icon" style="width:44px;height:44px;font-size:22px;margin:0 auto 8px">✦</div>
          <div class="logo-text">ResumeAI</div>
        </div>
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-sub">Sign in to access your dashboard and resume history.</p>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input class="form-input" id="login-email" type="email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" id="login-password" type="password" placeholder="••••••••" autocomplete="current-password">
        </div>
        <div id="login-error" style="color:var(--error);font-size:0.82rem;margin-bottom:12px;display:none"></div>
        <button class="btn btn-primary" style="width:100%;margin-top:4px" id="login-btn">Sign In →</button>

        <div class="divider"></div>
        <p class="auth-switch">Don't have an account? <a onclick="App.navigate('signup')" style="cursor:pointer">Sign up free</a></p>
        <p style="text-align:center;margin-top:8px;font-size:0.78rem;color:var(--text-muted)">
          <a onclick="App.navigate('home')" style="cursor:pointer;color:var(--text-muted)">← Back to Home</a>
        </p>
      </div>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: SIGNUP
  // ──────────────────────────────────────────────
  signup() {
    return `
    <div class="auth-page">
      <div class="auth-card page-content">
        <div class="auth-logo">
          <div class="logo-icon" style="width:44px;height:44px;font-size:22px;margin:0 auto 8px">✦</div>
          <div class="logo-text">ResumeAI</div>
        </div>
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-sub">Start analyzing your resume and land more interviews.</p>

        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input class="form-input" id="signup-name" type="text" placeholder="Jane Smith" autocomplete="name">
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input class="form-input" id="signup-email" type="email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label class="form-label">Password <span style="color:var(--text-muted);font-size:0.75rem">(min. 6 characters)</span></label>
          <input class="form-input" id="signup-password" type="password" placeholder="••••••••" autocomplete="new-password">
        </div>
        <div id="signup-error" style="color:var(--error);font-size:0.82rem;margin-bottom:12px;display:none"></div>
        <button class="btn btn-primary" style="width:100%;margin-top:4px" id="signup-btn">Create Account →</button>

        <div class="divider"></div>
        <p class="auth-switch">Already have an account? <a onclick="App.navigate('login')" style="cursor:pointer">Sign in</a></p>
        <p style="text-align:center;margin-top:8px;font-size:0.78rem;color:var(--text-muted)">
          <a onclick="App.navigate('home')" style="cursor:pointer;color:var(--text-muted)">← Back to Home</a>
        </p>
      </div>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: DASHBOARD
  // ──────────────────────────────────────────────
  dashboard() {
    const u = App.currentUser;
    const reports = Reports.getAll();
    const avgScore = reports.length
      ? Math.round(reports.reduce((s,r) => s + r.score, 0) / reports.length)
      : 0;

    const historyHTML = reports.length === 0
      ? `<div class="empty-state">
           <div class="empty-state-icon">📄</div>
           <p class="empty-state-text">No analyses yet. Upload your first resume!</p>
           <button class="btn btn-primary" style="margin-top:16px" onclick="App.navigate('analyzer')">Analyze Resume →</button>
         </div>`
      : `<div class="history-grid">
           ${reports.slice(0, 6).map(r => `
           <div class="history-card">
             <div class="history-meta">
               <span class="history-filename">📄 ${r.filename}</span>
               <span class="badge ${r.level === 'excellent' ? 'badge-green' : r.level === 'good' ? 'badge-gold' : 'badge-red'}">${r.score}%</span>
             </div>
             <div class="history-score-bar">
               <div class="history-score-fill" style="width:${r.score}%"></div>
             </div>
             <div class="history-footer">
               <span style="font-size:0.75rem;color:var(--text-muted)">${UI.formatDate(r.date)}</span>
               <div style="display:flex;gap:6px">
                 <button class="btn btn-secondary btn-sm" onclick="App.navigate('result');window.__viewReportId='${r.id}'">View</button>
                 <button class="btn btn-sm" style="background:rgba(245,101,101,0.1);color:var(--error);border:1px solid rgba(245,101,101,0.2)" onclick="Reports.delete('${r.id}');App.navigate('dashboard')">✕</button>
               </div>
             </div>
           </div>`).join('')}
         </div>`;

    return `
    <div class="page-wrapper">
      ${this.sidebar('dashboard')}
      <div class="main-content">
        ${this.topbar('Dashboard')}
        <div class="page-body page-content">
          <!-- Welcome -->
          <div style="margin-bottom:28px">
            <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:700;margin-bottom:4px">
              Welcome back, ${u?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p style="color:var(--text-muted)">Here's an overview of your resume analysis activity.</p>
          </div>

          <!-- Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon gold">📊</div>
              <div><div class="stat-value">${reports.length}</div><div class="stat-label">Analyses Run</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">🎯</div>
              <div><div class="stat-value">${avgScore || '—'}${reports.length ? '%' : ''}</div><div class="stat-label">Avg ATS Score</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue">⚡</div>
              <div><div class="stat-value">${reports.length > 0 ? reports[0].score + '%' : '—'}</div><div class="stat-label">Latest Score</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon gold">✦</div>
              <div><div class="stat-value">${reports.filter(r => r.level === 'excellent').length}</div><div class="stat-label">Excellent Scores</div></div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px">
            <button class="btn btn-primary" onclick="App.navigate('analyzer')">◈ &nbsp;New Analysis</button>
            <button class="btn btn-secondary" onclick="App.navigate('profile')">◉ &nbsp;Edit Profile</button>
          </div>

          <!-- History -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Analyses</h3>
              ${reports.length > 0 ? `<span class="badge badge-gold">${reports.length} total</span>` : ''}
            </div>
            ${historyHTML}
          </div>
        </div>
      </div>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: ANALYZER
  // ──────────────────────────────────────────────
  analyzer() {
    return `
    <div class="page-wrapper">
      ${this.sidebar('analyzer')}
      <div class="main-content">
        ${this.topbar('Resume Analyzer')}
        <div class="page-body page-content">
          <div style="max-width:680px">
            <h1 style="font-family:var(--font-display);font-size:2rem;margin-bottom:6px">Analyze Your Resume</h1>
            <p style="color:var(--text-muted);margin-bottom:28px">Upload a PDF resume. Our AI extracts the text and provides an instant ATS score with improvement suggestions.</p>

            <!-- Upload Zone -->
            <div class="card" style="margin-bottom:20px">
              <div class="upload-zone" id="upload-zone">
                <input type="file" id="resume-file" accept=".pdf" onchange="handleFileSelect(event)">
                <div class="upload-icon">📄</div>
                <div class="upload-title">Drop your PDF here or click to browse</div>
                <div class="upload-subtitle">Supports PDF files up to 10MB</div>
              </div>
              <div id="file-selected" style="display:none;margin-top:14px;display:none">
                <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--gold-dim);border:1px solid rgba(212,175,55,0.2);border-radius:var(--radius-md)">
                  <span>📄</span>
                  <span id="file-name" style="font-size:0.88rem;font-weight:500;flex:1"></span>
                  <span id="file-size" style="font-size:0.75rem;color:var(--text-muted)"></span>
                </div>
              </div>
            </div>

            <!-- Skills to check -->
            <div class="card" style="margin-bottom:20px">
              <h3 class="card-title" style="font-size:1.1rem;margin-bottom:14px">Skills We Check For</h3>
              <div class="skill-tags">
                ${Analyzer.REQUIRED_SKILLS.map(s => `<span class="skill-tag found">${s}</span>`).join('')}
              </div>
              <p style="font-size:0.78rem;color:var(--text-muted);margin-top:12px">
                + Bonus keywords including leadership, communication, Agile, CI/CD, cloud platforms and more.
              </p>
            </div>

            <!-- Action -->
            <div id="analyze-error" style="color:var(--error);font-size:0.85rem;margin-bottom:12px;display:none"></div>
            <button class="btn btn-primary btn-lg" id="analyze-btn" style="width:100%">
              ◈ &nbsp;Run AI Analysis
            </button>

            <!-- Loading state -->
            <div id="analyze-loading" style="display:none;text-align:center;padding:32px 0">
              <div class="spinner"></div>
              <p style="margin-top:14px;color:var(--text-muted);font-size:0.88rem" id="loading-text">Extracting text from PDF…</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: RESULT
  // ──────────────────────────────────────────────
  result() {
    // Grab report — either from a "view" click or the last analysis
    const id = window.__viewReportId;
    let report = id ? Reports.getById(id) : null;
    if (!report) {
      const all = Reports.getAll();
      report = all[0] || null;
    }
    window.__viewReportId = null;

    if (!report) {
      return `
      <div class="page-wrapper">
        ${this.sidebar('result')}
        <div class="main-content">
          ${this.topbar('Result')}
          <div class="page-body page-content">
            <div class="empty-state">
              <div class="empty-state-icon">📊</div>
              <p class="empty-state-text">No result to display.</p>
              <button class="btn btn-primary" style="margin-top:16px" onclick="App.navigate('analyzer')">Analyze a Resume</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    const scoreClass = report.level === 'excellent' ? 'score-excellent' : report.level === 'good' ? 'score-good' : 'score-poor';
    const scoreLabel = report.level === 'excellent' ? 'Excellent' : report.level === 'good' ? 'Good' : 'Needs Work';
    const circumference = 440;
    const offset = circumference - (report.score / 100) * circumference;

    return `
    <div class="page-wrapper">
      ${this.sidebar('')}
      <div class="main-content">
        ${this.topbar('Analysis Result')}
        <div class="page-body page-content">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px">
            <div>
              <h1 style="font-family:var(--font-display);font-size:1.8rem;margin-bottom:3px">Resume Analysis Report</h1>
              <p style="color:var(--text-muted);font-size:0.85rem">📄 ${report.filename} &nbsp;·&nbsp; ${UI.formatDate(report.date)}</p>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-secondary btn-sm" onclick="App.navigate('analyzer')">New Analysis</button>
              <button class="btn btn-primary btn-sm" id="download-btn">⤓ &nbsp;Download</button>
            </div>
          </div>

          <div class="result-main">
            <!-- Score + top row -->
            <div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:start">
              <!-- Circular Score -->
              <div class="card ${scoreClass}" style="min-width:200px;text-align:center">
                <div class="progress-ring-container" style="margin:0 auto 8px">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#d4af37"/>
                        <stop offset="100%" style="stop-color:#f0d060"/>
                      </linearGradient>
                    </defs>
                    <circle class="progress-ring-bg" cx="80" cy="80" r="70"/>
                    <circle class="progress-ring-fill" id="score-ring" cx="80" cy="80" r="70" style="stroke-dashoffset:${offset}"/>
                  </svg>
                  <div class="progress-center">
                    <div class="progress-score">${report.score}</div>
                    <div class="progress-label">ATS Score</div>
                  </div>
                </div>
                <div class="score-interpretation ${report.level}">${scoreLabel}</div>
              </div>

              <!-- Summary card -->
              <div class="card">
                <h3 class="card-title" style="font-size:1.1rem;margin-bottom:14px">Quick Summary</h3>
                <div style="display:flex;flex-direction:column;gap:10px">
                  <div style="display:flex;justify-content:space-between;font-size:0.88rem">
                    <span style="color:var(--text-muted)">Skills Found</span>
                    <span style="color:var(--success);font-weight:600">${report.foundSkills.length} / ${Analyzer.REQUIRED_SKILLS.length}</span>
                  </div>
                  <div style="height:4px;background:var(--border);border-radius:2px">
                    <div style="height:100%;width:${(report.foundSkills.length/Analyzer.REQUIRED_SKILLS.length)*100}%;background:var(--success);border-radius:2px"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:0.88rem;margin-top:4px">
                    <span style="color:var(--text-muted)">Missing Skills</span>
                    <span style="color:var(--error);font-weight:600">${report.missingSkills.length}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:0.88rem">
                    <span style="color:var(--text-muted)">Bonus Keywords</span>
                    <span style="color:var(--gold);font-weight:600">${report.bonusKeywords?.length || 0}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:0.88rem">
                    <span style="color:var(--text-muted)">Suggestions</span>
                    <span style="color:var(--info);font-weight:600">${report.suggestions.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skills row -->
            <div class="result-grid">
              <div class="card">
                <h3 class="card-title" style="font-size:1.1rem">✓ Found Skills</h3>
                <div class="skill-tags">
                  ${report.foundSkills.length
                    ? report.foundSkills.map(s => `<span class="skill-tag found">${s}</span>`).join('')
                    : '<span style="color:var(--text-muted);font-size:0.85rem">No skills detected</span>'}
                </div>
              </div>
              <div class="card">
                <h3 class="card-title" style="font-size:1.1rem">✗ Missing Skills</h3>
                <div class="skill-tags">
                  ${report.missingSkills.length
                    ? report.missingSkills.map(s => `<span class="skill-tag missing">${s}</span>`).join('')
                    : '<span style="color:var(--success);font-size:0.85rem">All skills detected!</span>'}
                </div>
              </div>
            </div>

            <!-- Suggestions -->
            <div class="card">
              <h3 class="card-title" style="font-size:1.1rem">💡 Improvement Suggestions</h3>
              <div class="suggestions-list">
                ${report.suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('')}
              </div>
            </div>

            <!-- Back -->
            <div style="display:flex;gap:12px">
              <button class="btn btn-secondary" onclick="App.navigate('dashboard')">← Back to Dashboard</button>
              <button class="btn btn-primary" onclick="App.navigate('analyzer')">Analyze Another Resume</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // PAGE: PROFILE
  // ──────────────────────────────────────────────
  profile() {
    const u = App.currentUser;
    return `
    <div class="page-wrapper">
      ${this.sidebar('profile')}
      <div class="main-content">
        ${this.topbar('Profile')}
        <div class="page-body page-content" style="max-width:640px">
          <div class="profile-header">
            <div class="profile-avatar-lg">${u?.avatar || '?'}</div>
            <div>
              <div class="profile-meta-name">${u?.name}</div>
              <div class="profile-meta-email">${u?.email}</div>
              <div style="margin-top:6px"><span class="badge badge-gold">✦ Active Member</span></div>
            </div>
          </div>

          <!-- Edit form -->
          <div class="card" style="margin-bottom:20px">
            <div class="card-header"><h3 class="card-title">Edit Profile</h3></div>
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input class="form-input" id="profile-name" type="text" value="${u?.name || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" id="profile-email" type="email" value="${u?.email || ''}">
            </div>
            <div id="profile-error" style="color:var(--error);font-size:0.82rem;margin-bottom:8px;display:none"></div>
            <button class="btn btn-primary" id="profile-save-btn">Save Changes</button>
          </div>

          <!-- Account info -->
          <div class="card">
            <div class="card-header"><h3 class="card-title">Account Info</h3></div>
            <div style="display:flex;flex-direction:column;gap:14px">
              <div style="display:flex;justify-content:space-between;font-size:0.88rem">
                <span style="color:var(--text-muted)">Member Since</span>
                <span>${UI.formatDate(u?.createdAt || new Date().toISOString())}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.88rem">
                <span style="color:var(--text-muted)">Analyses Run</span>
                <span>${Reports.getAll().length}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.88rem">
                <span style="color:var(--text-muted)">Account Status</span>
                <span style="color:var(--success)">Active</span>
              </div>
            </div>
            <div class="divider"></div>
            <button class="btn-logout" onclick="Auth.logout()" style="width:auto;padding:10px 20px">⎋ &nbsp;Sign Out</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // FOOTER
  // ──────────────────────────────────────────────
  footer() {
    return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <div class="logo-mark" style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div class="logo-icon" style="width:28px;height:28px;font-size:14px">✦</div>
            <span class="logo-text" style="font-size:1.1rem">ResumeAI</span>
          </div>
          <p class="footer-text">AI-powered resume analysis for modern job seekers.</p>
        </div>
        <div style="display:flex;gap:32px;flex-wrap:wrap">
          <div>
            <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Product</div>
            ${['home','features','about','contact'].map(p => `
            <div style="margin-bottom:6px">
              <a onclick="App.navigate('${p}')" style="font-size:0.85rem;color:var(--text-secondary);cursor:pointer;transition:color 0.2s" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--text-secondary)'">${p.charAt(0).toUpperCase()+p.slice(1)}</a>
            </div>`).join('')}
          </div>
          <div>
            <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Social</div>
            <div class="footer-social">
              ${[['𝕏','#'],['in','#'],['gh','#']].map(([icon, href]) => `
              <a href="${href}" class="social-link">${icon}</a>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);margin-top:28px;padding-top:16px;text-align:center">
        <p class="footer-text">© 2025 ResumeAI. Built with ✦ for job seekers everywhere.</p>
      </div>
    </footer>`;
  },

  // ──────────────────────────────────────────────
  // 404
  // ──────────────────────────────────────────────
  notFound() {
    return `
    ${this.publicNav()}
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px">
      <div style="font-size:5rem;margin-bottom:16px">◌</div>
      <h1 style="font-family:var(--font-display);font-size:3rem;margin-bottom:8px">404</h1>
      <p style="color:var(--text-muted);margin-bottom:24px">Page not found</p>
      <button class="btn btn-primary" onclick="App.navigate('home')">Go Home</button>
    </div>`;
  },

  // ──────────────────────────────────────────────
  // EVENT BINDING (per-page)
  // ──────────────────────────────────────────────
  bindEvents(page) {
    switch (page) {
      case 'login':    this._bindLogin();    break;
      case 'signup':   this._bindSignup();   break;
      case 'contact':  this._bindContact();  break;
      case 'analyzer': this._bindAnalyzer(); break;
      case 'profile':  this._bindProfile();  break;
      case 'result':   this._bindResult();   break;
    }
  },

  _bindLogin() {
    const btn = document.getElementById('login-btn');
    if (!btn) return;
    const doLogin = () => {
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-password').value;
      const err   = document.getElementById('login-error');
      if (!email || !pass) { err.textContent = 'Please fill in all fields.'; err.style.display='block'; return; }
      const res = Auth.login(email, pass);
      if (!res.ok) { err.textContent = res.msg; err.style.display='block'; return; }
      UI.toast('Welcome back!', 'success');
      App.navigate('dashboard');
    };
    btn.addEventListener('click', doLogin);
    document.getElementById('login-password').addEventListener('keydown', e => e.key === 'Enter' && doLogin());
  },

  _bindSignup() {
    const btn = document.getElementById('signup-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const name  = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const pass  = document.getElementById('signup-password').value;
      const err   = document.getElementById('signup-error');
      if (!name || !email || !pass) { err.textContent = 'Please fill in all fields.'; err.style.display='block'; return; }
      if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; err.style.display='block'; return; }
      const res = Auth.signup(name, email, pass);
      if (!res.ok) { err.textContent = res.msg; err.style.display='block'; return; }
      UI.toast('Account created! Welcome.', 'success');
      App.navigate('dashboard');
    });
  },

  _bindContact() {
    const btn = document.getElementById('contact-submit');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const name = document.getElementById('contact-name').value.trim();
      const email= document.getElementById('contact-email').value.trim();
      const msg  = document.getElementById('contact-msg').value.trim();
      if (!name || !email || !msg) { UI.toast('Please fill in all fields.', 'error'); return; }
      document.getElementById('contact-name').value = '';
      document.getElementById('contact-email').value = '';
      document.getElementById('contact-msg').value = '';
      UI.toast('Message sent! We\'ll get back to you soon.', 'success', 4000);
    });
  },

  _bindAnalyzer() {
    // Drag and drop
    const zone = document.getElementById('upload-zone');
    if (!zone) return;
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) window._selectedFile = file, updateFileUI(file);
    });

    const btn = document.getElementById('analyze-btn');
    if (!btn) return;
    btn.addEventListener('click', runAnalysis);
  },

  _bindProfile() {
    const btn = document.getElementById('profile-save-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const name  = document.getElementById('profile-name').value.trim();
      const email = document.getElementById('profile-email').value.trim();
      const err   = document.getElementById('profile-error');
      if (!name || !email) { err.textContent = 'Name and email are required.'; err.style.display='block'; return; }
      const res = Auth.updateProfile(name, email);
      if (!res.ok) { err.textContent = res.msg; err.style.display='block'; return; }
      UI.toast('Profile updated successfully!', 'success');
      App.navigate('profile');
    });
  },

  _bindResult() {
    const btn = document.getElementById('download-btn');
    if (!btn) return;
    btn.addEventListener('click', downloadResult);
  }
};

// ── Global handlers needed by inline event attrs ──────────
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) { window._selectedFile = file; updateFileUI(file); }
}

function updateFileUI(file) {
  const sel = document.getElementById('file-selected');
  const name = document.getElementById('file-name');
  const size = document.getElementById('file-size');
  if (sel && name && size) {
    name.textContent = file.name;
    size.textContent = (file.size / 1024).toFixed(1) + ' KB';
    sel.style.display = 'flex';
  }
}

async function runAnalysis() {
  const file = window._selectedFile;
  const errEl = document.getElementById('analyze-error');
  const btn = document.getElementById('analyze-btn');
  const loading = document.getElementById('analyze-loading');
  const loadText = document.getElementById('loading-text');

  errEl.style.display = 'none';

  if (!file) { errEl.textContent = 'Please select a PDF resume to analyze.'; errEl.style.display='block'; return; }
  if (!file.name.endsWith('.pdf')) { errEl.textContent = 'Only PDF files are supported.'; errEl.style.display='block'; return; }

  // Show loading
  btn.style.display = 'none';
  loading.style.display = 'block';

  try {
    loadText.textContent = 'Extracting text from PDF…';
    const text = await PDFReader.extract(file);

    loadText.textContent = 'Running AI analysis…';
    await new Promise(r => setTimeout(r, 800)); // brief artificial delay for UX

    const result = Analyzer.analyze(text);

    // Save report
    Reports.save({
      userId: App.currentUser.id,
      filename: file.name,
      score: result.score,
      foundSkills: result.foundSkills,
      missingSkills: result.missingSkills,
      bonusKeywords: result.bonusKeywords,
      suggestions: result.suggestions,
      level: result.level,
      textLength: text.trim().split(/\s+/).length
    });

    window._selectedFile = null;
    UI.toast(`Analysis complete! ATS Score: ${result.score}%`, 'success');
    App.navigate('result');

  } catch (err) {
    btn.style.display = 'flex';
    loading.style.display = 'none';
    errEl.textContent = 'Could not read the PDF. Please try a different file.';
    errEl.style.display = 'block';
    console.error(err);
  }
}

function downloadResult() {
  const reports = Reports.getAll();
  const report = reports[0];
  if (!report) return;

  const text = `
AI RESUME ANALYSIS REPORT
==========================
File: ${report.filename}
Date: ${UI.formatDate(report.date)}
ATS Score: ${report.score}% (${report.level.toUpperCase()})

FOUND SKILLS (${report.foundSkills.length})
${report.foundSkills.join(', ') || 'None'}

MISSING SKILLS (${report.missingSkills.length})
${report.missingSkills.join(', ') || 'None'}

BONUS KEYWORDS (${report.bonusKeywords?.length || 0})
${report.bonusKeywords?.join(', ') || 'None'}

IMPROVEMENT SUGGESTIONS
${report.suggestions.map((s,i) => `${i+1}. ${s}`).join('\n')}

--
Generated by ResumeAI · resumeai.app
  `.trim();

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume-analysis-${report.score}pct.txt`;
  a.click();
  URL.revokeObjectURL(url);
  UI.toast('Report downloaded!', 'success');
}
