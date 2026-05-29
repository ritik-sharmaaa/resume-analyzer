/* ============================================================
   ResumeAI v2 — Pages (all 10 pages + event binding)
   ============================================================ */

const Pages = {

  render(page) {
    const root = document.getElementById('app');
    if (!root) return;
    root.style.opacity = '0';
    setTimeout(() => {
      const map = {
        home: 'home', about: 'about', features: 'features',
        contact: 'contact', login: 'login', signup: 'signup',
        dashboard: 'dashboard', analyzer: 'analyzer',
        result: 'result', profile: 'profile'
      };
      root.innerHTML = this[map[page] || 'notFound']();
      root.style.transition = 'opacity 0.3s ease';
      root.style.opacity = '1';
      this.bind(page);
    }, 110);
  },

  // ── Shared: Public Nav ──────────────────────────────────
  pubNav() {
    const right = App.user
      ? `<button class="btn btn-primary btn-sm" onclick="App.go('dashboard')">Dashboard</button>`
      : `<button class="btn btn-ghost btn-sm" onclick="App.go('login')">Log in</button>
         <button class="btn btn-primary btn-sm" onclick="App.go('signup')">Sign up</button>`;
    return `
    <nav class="pub-nav">
      <div class="logo" onclick="App.go('home')">
        <div class="logo-dot"></div>
        <span class="logo-name">ResumeAI</span>
      </div>
      <div class="pub-nav-links">
        <a onclick="App.go('home')">Home</a>
        <a onclick="App.go('about')">About</a>
        <a onclick="App.go('features')">Features</a>
        <a onclick="App.go('contact')">Contact</a>
      </div>
      <div class="pub-nav-cta">${right}</div>
    </nav>`;
  },

  // ── Shared: Sidebar ─────────────────────────────────────
  sidebar(active) {
    const u = App.user;
    const items = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'analyzer',  label: 'Analyze Resume' },
      { id: 'profile',   label: 'Profile' },
    ];
    const pubItems = [
      { id: 'home',     label: 'Home' },
      { id: 'features', label: 'Features' },
      { id: 'contact',  label: 'Contact' },
    ];
    return `
    <div class="overlay" onclick="UI.closeSidebar()"></div>
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="logo" onclick="App.go('home');UI.closeSidebar()">
          <div class="logo-dot"></div>
          <span class="logo-name">ResumeAI</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Menu</div>
        ${items.map(x => `
          <button class="nav-item ${active===x.id?'active':''}" onclick="App.go('${x.id}');UI.closeSidebar()">
            <span class="nav-dot"></span>${x.label}
          </button>`).join('')}
        <div class="nav-label" style="margin-top:8px">Pages</div>
        ${pubItems.map(x => `
          <button class="nav-item" onclick="App.go('${x.id}');UI.closeSidebar()">
            <span class="nav-dot"></span>${x.label}
          </button>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="user-row">
          <div class="avatar">${u?.initials||'?'}</div>
          <div>
            <div class="user-name-sm">${u?.name||'User'}</div>
            <div class="user-email-sm">${u?.email||''}</div>
          </div>
        </div>
        <button class="btn-logout" onclick="Auth.logout()">Sign out</button>
      </div>
    </aside>`;
  },

  topbar(title) {
    return `
    <header class="topbar">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="hamburger" onclick="UI.toggleSidebar()">☰</button>
        <span class="topbar-title">${title}</span>
      </div>
      <div class="topbar-right">
        <span class="tag tag-green" style="font-size:0.72rem">● Live</span>
      </div>
    </header>`;
  },

  footer() {
    return `
    <footer class="footer">
      <div class="footer-inner">
        <div class="logo" onclick="App.go('home')" style="cursor:pointer">
          <div class="logo-dot"></div>
          <span class="logo-name">ResumeAI</span>
        </div>
        <p class="footer-text">AI-powered resume analysis. Built for job seekers.</p>
        <div class="footer-links">
          <a onclick="App.go('about')">About</a>
          <a onclick="App.go('features')">Features</a>
          <a onclick="App.go('contact')">Contact</a>
        </div>
      </div>
    </footer>`;
  },

  // ── HOME ────────────────────────────────────────────────
  home() {
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <section class="hero">
        <div class="hero-badge">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block"></span>
          Powered by Gemini AI
        </div>
        <h1 class="hero-title">
          Your resume,<br><em>honestly scored</em>
        </h1>
        <p class="hero-sub">
          Upload your resume and get a real ATS score with specific, actionable feedback — not generic tips.
        </p>
        <div class="hero-btns">
          <button class="btn btn-primary btn-lg" onclick="App.go(App.user?'analyzer':'signup')">
            Analyze my resume
          </button>
          <button class="btn btn-ghost btn-lg" onclick="App.go('features')">
            See how it works
          </button>
        </div>

        <div style="display:flex;gap:16px;margin-top:52px;flex-wrap:wrap;justify-content:center;animation:up 0.5s 0.35s ease both;opacity:0">
          ${[['Real AI','Not keyword matching'],['Private','Runs in your browser'],['Free','No credit card']].map(([v,l])=>`
          <div style="padding:14px 22px;background:var(--bg-2);border:1px solid var(--line);border-radius:var(--r-lg);text-align:center">
            <div style="font-family:var(--f-serif);font-size:1.1rem">${v}</div>
            <div style="font-size:0.75rem;color:var(--ink-3);margin-top:2px">${l}</div>
          </div>`).join('')}
        </div>
      </section>

      <section class="section">
        <p class="section-eyebrow">What you get</p>
        <h2 class="section-title">Honest analysis,<br>not flattery</h2>
        <p class="section-sub">Our AI reads your resume the same way an ATS does — and tells you the truth.</p>
        <div class="feat-grid">
          ${[
            ['◎','Real ATS Score','Gemini AI analyzes your resume and gives a genuine score — not inflated, not random.'],
            ['◈','Skill Gap Analysis','See exactly which skills are present and which important ones are missing for your field.'],
            ['→','Specific Suggestions','Actionable improvements based on your actual resume content, not generic advice.'],
            ['◇','PDF Extraction','Upload any PDF — our engine reads it fully and sends it to AI for analysis.'],
            ['▣','History Tracking','Every analysis saved. Track your score improve as you update your resume.'],
            ['◉','Privacy First','Your resume text is only sent to Gemini API. We store nothing on any server.'],
          ].map(([icon,title,desc])=>`
          <div class="feat-card">
            <span class="feat-icon">${icon}</span>
            <h3 class="feat-title">${title}</h3>
            <p class="feat-desc">${desc}</p>
          </div>`).join('')}
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <h2 class="section-title">What people say</h2>
        <p class="section-sub">Job seekers who used ResumeAI to land interviews.</p>
        <div class="testi-grid">
          ${[
            ['Aryan S.','Frontend Dev','I uploaded 3 different versions of my resume and finally understood why version 2 performed best. The AI feedback was shockingly specific.'],
            ['Neha R.','Data Analyst','Previous tools gave me 90% scores that clearly meant nothing. ResumeAI gave me a 58 and told me exactly why. Fixed it, got callbacks.'],
            ['Karan M.','CS Graduate','The missing skills section alone was worth it. I had no idea I wasn\'t mentioning Docker anywhere despite using it daily.'],
          ].map(([n,r,t])=>`
          <div class="testi-card">
            <p class="testi-text">"${t}"</p>
            <div class="testi-author">
              <div class="testi-av">${n[0]}</div>
              <div>
                <div class="testi-name">${n}</div>
                <div class="testi-role">${r}</div>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div style="background:var(--bg-2);border:1px solid var(--line);border-radius:var(--r-xl);padding:52px;text-align:center">
          <h2 style="font-family:var(--f-serif);font-size:2.2rem;margin-bottom:12px">Ready to find out your real score?</h2>
          <p style="color:var(--ink-2);margin-bottom:28px;max-width:420px;margin-left:auto;margin-right:auto;font-size:0.95rem">
            Takes 30 seconds. No fluff, no fake 90% scores.
          </p>
          <button class="btn btn-primary btn-lg" onclick="App.go(App.user?'analyzer':'signup')">
            Get started free
          </button>
        </div>
      </section>

      ${this.footer()}
    </main>`;
  },

  // ── ABOUT ───────────────────────────────────────────────
  about() {
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <section class="section">
        <p class="section-eyebrow">Our story</p>
        <h1 class="section-title">Built because<br><em style="font-style:italic;color:var(--ink-2)">fake scores waste time</em></h1>
        <p style="color:var(--ink-2);max-width:560px;line-height:1.8;margin-bottom:40px">
          Most resume analyzers give you a 85%+ score regardless of what you upload — because they want you to feel good and come back. We built ResumeAI to do the opposite: give honest, AI-powered feedback that actually helps you improve.
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:52px">
          ${[
            ['Our Mission','Honest, specific resume feedback powered by real AI — not keyword counters dressed up as analysis.'],
            ['Our Approach','We send your resume to Gemini AI with a carefully crafted prompt that forces specific, resume-based feedback.'],
          ].map(([t,d])=>`
          <div class="card">
            <h3 class="card-title">${t}</h3>
            <p style="color:var(--ink-2);font-size:0.875rem;line-height:1.7">${d}</p>
          </div>`).join('')}
        </div>

        <h2 class="section-title" style="margin-bottom:28px">The team</h2>
        <div class="team-grid">
          ${[['RK','Ritik Kumar','Founder'],['PS','Priya S.','AI Engineer'],['AM','Ankit M.','Frontend'],['SK','Sara K.','Product']].map(([i,n,r])=>`
          <div class="team-card">
            <div class="team-av">${i}</div>
            <div class="team-name">${n}</div>
            <div class="team-role">${r}</div>
          </div>`).join('')}
        </div>
      </section>
      ${this.footer()}
    </main>`;
  },

  // ── FEATURES ────────────────────────────────────────────
  features() {
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <section class="section">
        <p class="section-eyebrow">Capabilities</p>
        <h1 class="section-title">Everything you need<br>to get hired</h1>
        <p class="section-sub">Built around one goal: give you the most honest, useful resume feedback possible.</p>
        <div class="feat-grid">
          ${[
            ['◎','Gemini AI Analysis','Your resume text is analyzed by Google\'s Gemini AI — not a keyword counter.'],
            ['◈','Honest ATS Score','Scores based on real factors: keyword density, formatting, experience clarity, skills.'],
            ['→','Field-Specific Gaps','AI detects your field and suggests missing skills relevant to your actual career path.'],
            ['▣','Specific Suggestions','Every suggestion references something actually in (or missing from) your resume.'],
            ['◇','Resume Validation','Random PDFs are rejected. Only actual resumes get analyzed.'],
            ['◉','Full History','All past analyses stored locally. View, compare, delete.'],
            ['⊞','Download Report','Export your analysis as a text file for offline reference.'],
            ['◌','Privacy','Your resume never stored on our servers. API call to Gemini only.'],
            ['⚡','Fast','Full AI analysis in under 10 seconds.'],
          ].map(([i,t,d])=>`
          <div class="feat-card">
            <span class="feat-icon">${i}</span>
            <h3 class="feat-title">${t}</h3>
            <p class="feat-desc">${d}</p>
          </div>`).join('')}
        </div>
      </section>
      ${this.footer()}
    </main>`;
  },

  // ── CONTACT ─────────────────────────────────────────────
  contact() {
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <section class="section">
        <p class="section-eyebrow">Get in touch</p>
        <h1 class="section-title">Contact us</h1>
        <p class="section-sub">Have feedback or a question? We read every message.</p>

        <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:28px;max-width:820px">
          <div style="display:flex;flex-direction:column;gap:12px">
            ${[['Email','hello@resumeai.app'],['Twitter','@resumeai'],['Location','Remote — India']].map(([l,v])=>`
            <div class="card" style="padding:16px 18px">
              <div style="font-size:0.72rem;color:var(--ink-3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${l}</div>
              <div style="font-size:0.875rem;font-weight:500">${v}</div>
            </div>`).join('')}
          </div>
          <div class="card">
            <h3 class="card-title">Send a message</h3>
            <div class="field">
              <label class="label">Name</label>
              <input class="input" id="c-name" placeholder="Your name">
            </div>
            <div class="field">
              <label class="label">Email</label>
              <input class="input" id="c-email" type="email" placeholder="you@example.com">
            </div>
            <div class="field">
              <label class="label">Message</label>
              <textarea class="input" id="c-msg" placeholder="What's on your mind?"></textarea>
            </div>
            <button class="btn btn-primary btn-full" id="c-send">Send message</button>
          </div>
        </div>
      </section>
      ${this.footer()}
    </main>`;
  },

  // ── LOGIN ───────────────────────────────────────────────
  login() {
    return `
    <div class="auth-wrap">
      <div class="auth-box page-in">
        <div class="auth-logo">
          <div class="logo" style="justify-content:center;cursor:pointer" onclick="App.go('home')">
            <div class="logo-dot"></div>
            <span class="logo-name">ResumeAI</span>
          </div>
        </div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-sub">Sign in to your account</p>
        <div class="field">
          <label class="label">Email</label>
          <input class="input" id="l-email" type="email" placeholder="you@example.com">
        </div>
        <div class="field">
          <label class="label">Password</label>
          <input class="input" id="l-pass" type="password" placeholder="••••••••">
        </div>
        <div class="err-msg" id="l-err"></div>
        <button class="btn btn-primary btn-full" style="margin-top:8px" id="l-btn">Sign in</button>
        <p class="auth-switch">No account? <a onclick="App.go('signup')">Sign up free</a></p>
        <p style="text-align:center;margin-top:8px"><a onclick="App.go('home')" style="font-size:0.78rem;color:var(--ink-3);cursor:pointer">← Back to home</a></p>
      </div>
    </div>`;
  },

  // ── SIGNUP ──────────────────────────────────────────────
  signup() {
    return `
    <div class="auth-wrap">
      <div class="auth-box page-in">
        <div class="auth-logo">
          <div class="logo" style="justify-content:center;cursor:pointer" onclick="App.go('home')">
            <div class="logo-dot"></div>
            <span class="logo-name">ResumeAI</span>
          </div>
        </div>
        <h2 class="auth-title">Create account</h2>
        <p class="auth-sub">Start analyzing your resume</p>
        <div class="field">
          <label class="label">Full name</label>
          <input class="input" id="s-name" placeholder="Jane Smith">
        </div>
        <div class="field">
          <label class="label">Email</label>
          <input class="input" id="s-email" type="email" placeholder="you@example.com">
        </div>
        <div class="field">
          <label class="label">Password <span style="color:var(--ink-3);font-size:0.72rem">(min 6 chars)</span></label>
          <input class="input" id="s-pass" type="password" placeholder="••••••••">
        </div>
        <div class="err-msg" id="s-err"></div>
        <button class="btn btn-primary btn-full" style="margin-top:8px" id="s-btn">Create account</button>
        <p class="auth-switch">Have an account? <a onclick="App.go('login')">Sign in</a></p>
        <p style="text-align:center;margin-top:8px"><a onclick="App.go('home')" style="font-size:0.78rem;color:var(--ink-3);cursor:pointer">← Back to home</a></p>
      </div>
    </div>`;
  },

  // ── DASHBOARD ───────────────────────────────────────────
  dashboard() {
    const u = App.user;
    const reports = Reports.all();
    const avg = reports.length ? Math.round(reports.reduce((s,r)=>s+r.atsScore,0)/reports.length) : 0;

    const historyHTML = reports.length === 0
      ? `<div class="empty"><div class="empty-icon">◌</div><p class="empty-text">No analyses yet. Upload your first resume.</p>
         <button class="btn btn-primary" style="margin-top:14px" onclick="App.go('analyzer')">Analyze resume</button></div>`
      : `<div class="history-list">
          ${reports.slice(0,8).map(r=>`
          <div class="h-card">
            <div class="h-score ${r.scoreLevel}">${r.atsScore}</div>
            <div class="h-info">
              <div class="h-name">📄 ${r.filename}</div>
              <div class="h-date">${UI.date(r.date)}</div>
              <div class="h-bar"><div class="h-bar-fill ${r.scoreLevel}" style="width:${r.atsScore}%"></div></div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn btn-ghost btn-sm" onclick="window.__rid='${r.id}';App.go('result')">View</button>
              <button class="btn btn-sm" style="background:var(--red-bg);color:var(--red);border:1px solid var(--red-line)" onclick="Reports.del('${r.id}');App.go('dashboard')">✕</button>
            </div>
          </div>`).join('')}
        </div>`;

    return `
    <div class="app">
      ${this.sidebar('dashboard')}
      <div class="main">
        ${this.topbar('Dashboard')}
        <div class="body page-in">
          <div style="margin-bottom:24px">
            <h1 style="font-family:var(--f-serif);font-size:1.8rem;margin-bottom:3px">Good to see you, ${u?.name?.split(' ')[0]||'there'}</h1>
            <p style="color:var(--ink-3);font-size:0.875rem">Here's your resume analysis overview.</p>
          </div>

          <div class="stats">
            ${[
              [reports.length,'Analyses'],
              [avg ? avg+'%' : '—','Avg Score'],
              [reports.length ? reports[0].atsScore+'%' : '—','Latest'],
              [reports.filter(r=>r.scoreLevel==='excellent').length,'Excellent'],
            ].map(([v,l])=>`
            <div class="stat">
              <div class="stat-val">${v}</div>
              <div class="stat-lbl">${l}</div>
            </div>`).join('')}
          </div>

          <div style="display:flex;gap:10px;margin-bottom:24px">
            <button class="btn btn-primary" onclick="App.go('analyzer')">New analysis</button>
            <button class="btn btn-ghost" onclick="App.go('profile')">Edit profile</button>
          </div>

          <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
              <h3 class="card-title" style="margin-bottom:0">Recent analyses</h3>
              ${reports.length ? `<span class="tag tag-gray">${reports.length} total</span>` : ''}
            </div>
            ${historyHTML}
          </div>
        </div>
      </div>
    </div>`;
  },

  // ── ANALYZER ────────────────────────────────────────────
  analyzer() {
    return `
    <div class="app">
      ${this.sidebar('analyzer')}
      <div class="main">
        ${this.topbar('Analyze Resume')}
        <div class="body page-in">
          <div style="max-width:620px">
            <h1 style="font-family:var(--f-serif);font-size:1.8rem;margin-bottom:6px">Upload your resume</h1>
            <p style="color:var(--ink-3);font-size:0.875rem;margin-bottom:24px">
              PDF only. Our AI reads your resume and gives you a real ATS score — not a fake one.
            </p>

            <div class="card" style="margin-bottom:16px">
              <div class="upload-area" id="drop-zone">
                <input type="file" id="resume-file" accept=".pdf" onchange="handleFile(event)">
                <div class="upload-icon">↑</div>
                <div class="upload-title">Drop PDF here or click to browse</div>
                <div class="upload-sub">PDF resumes only · Max 10MB</div>
              </div>
              <div class="file-pill" id="file-pill">
                <span>📄</span>
                <span id="file-name" style="flex:1;font-size:0.84rem;font-weight:500"></span>
                <span id="file-size" style="font-size:0.75rem;color:var(--ink-3)"></span>
              </div>
            </div>

            <div class="card" style="margin-bottom:16px">
              <h3 class="card-title" style="font-size:0.95rem;margin-bottom:10px">What the AI checks</h3>
              <div style="font-size:0.82rem;color:var(--ink-2);line-height:1.7">
                Gemini AI analyzes: technical skills, experience clarity, formatting signals, keyword density, field-specific gaps, quantified achievements, and overall ATS compatibility.
              </div>
            </div>

            <div class="err-msg" id="a-err" style="margin-bottom:12px;font-size:0.875rem"></div>

            <button class="btn btn-primary btn-full btn-lg" id="a-btn">
              Run AI analysis
            </button>

            <div class="loading-wrap" id="a-load">
              <div class="spinner"></div>
              <p class="loading-text" id="a-load-txt">Extracting text from PDF…</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ── RESULT ──────────────────────────────────────────────
  result() {
    const id = window.__rid;
    let r = id ? Reports.get(id) : Reports.latest();
    window.__rid = null;

    if (!r) return `
    <div class="app">
      ${this.sidebar('')}
      <div class="main">
        ${this.topbar('Result')}
        <div class="body page-in">
          <div class="empty">
            <div class="empty-icon">◌</div>
            <p class="empty-text">No result to display.</p>
            <button class="btn btn-primary" style="margin-top:14px" onclick="App.go('analyzer')">Analyze a resume</button>
          </div>
        </div>
      </div>
    </div>`;

    const circ = 377;
    const offset = circ - (r.atsScore / 100) * circ;
    const scoreColor = r.scoreLevel==='excellent' ? 'var(--green)' : r.scoreLevel==='good' ? 'var(--amber)' : 'var(--red)';
    const scoreWord  = r.scoreLevel==='excellent' ? 'Excellent' : r.scoreLevel==='good' ? 'Good' : 'Needs work';

    return `
    <div class="app">
      ${this.sidebar('')}
      <div class="main">
        ${this.topbar('Analysis Result')}
        <div class="body page-in">

          <!-- Header row -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px">
            <div>
              <h1 style="font-family:var(--f-serif);font-size:1.7rem;margin-bottom:3px">Resume Analysis</h1>
              <p style="font-size:0.8rem;color:var(--ink-3)">📄 ${r.filename} · ${UI.date(r.date)}</p>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-ghost btn-sm" onclick="App.go('dashboard')">← Dashboard</button>
              <button class="btn btn-ghost btn-sm" onclick="App.go('analyzer')">New analysis</button>
              <button class="btn btn-primary btn-sm" id="dl-btn">Download</button>
            </div>
          </div>

          <!-- Score + summary row -->
          <div class="result-grid" style="margin-bottom:18px">
            <!-- Ring -->
            <div class="card" style="text-align:center;padding:24px 16px">
              <div class="ring-wrap">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle class="ring-bg" cx="70" cy="70" r="60"/>
                  <circle class="ring-fill ${r.scoreLevel}" id="ring" cx="70" cy="70" r="60" style="stroke-dashoffset:${offset}"/>
                </svg>
                <div class="ring-center">
                  <div class="ring-score" style="color:${scoreColor}">${r.atsScore}</div>
                  <div class="ring-label">ATS Score</div>
                </div>
              </div>
              <div style="margin-top:10px;font-size:0.8rem;font-weight:600;color:${scoreColor}">${scoreWord}</div>
            </div>

            <!-- Summary -->
            <div class="card">
              <h3 class="card-title">AI Summary</h3>
              <p style="color:var(--ink-2);font-size:0.875rem;line-height:1.75;margin-bottom:16px">${r.summary||'Analysis complete.'}</p>
              <div style="display:flex;flex-direction:column;gap:8px">
                ${[
                  ['Skills found', r.foundSkills?.length||0, 'var(--green)'],
                  ['Missing skills', r.missingSkills?.length||0, 'var(--red)'],
                  ['Suggestions', r.suggestions?.length||0, 'var(--amber)'],
                ].map(([l,v,c])=>`
                <div style="display:flex;justify-content:space-between;font-size:0.84rem;padding:6px 0;border-bottom:1px solid var(--line)">
                  <span style="color:var(--ink-3)">${l}</span>
                  <span style="font-weight:600;color:${c}">${v}</span>
                </div>`).join('')}
              </div>
            </div>
          </div>

          <!-- Skills row -->
          <div class="result-cols" style="margin-bottom:18px">
            <div class="card">
              <h3 class="card-title" style="font-size:0.95rem">✓ Found skills</h3>
              <div class="chips">
                ${r.foundSkills?.length
                  ? r.foundSkills.map(s=>`<span class="chip chip-found">${s}</span>`).join('')
                  : '<span style="font-size:0.82rem;color:var(--ink-3)">None detected</span>'}
              </div>
            </div>
            <div class="card">
              <h3 class="card-title" style="font-size:0.95rem">✗ Missing skills</h3>
              <div class="chips">
                ${r.missingSkills?.length
                  ? r.missingSkills.map(s=>`<span class="chip chip-missing">${s}</span>`).join('')
                  : '<span style="font-size:0.82rem;color:var(--green)">All key skills present!</span>'}
              </div>
            </div>
          </div>

          <!-- Strengths -->
          ${r.strengths?.length ? `
          <div class="card" style="margin-bottom:18px">
            <h3 class="card-title" style="font-size:0.95rem">★ Strengths</h3>
            <div class="suggestions">
              ${r.strengths.map(s=>`
              <div class="suggestion">
                <span class="suggestion-arrow" style="color:var(--green)">★</span>
                ${s}
              </div>`).join('')}
            </div>
          </div>` : ''}

          <!-- Suggestions -->
          <div class="card" style="margin-bottom:18px">
            <h3 class="card-title" style="font-size:0.95rem">→ Improvement suggestions</h3>
            <div class="suggestions">
              ${r.suggestions?.length
                ? r.suggestions.map(s=>`
                <div class="suggestion">
                  <span class="suggestion-arrow">→</span>${s}
                </div>`).join('')
                : '<p style="font-size:0.84rem;color:var(--ink-3)">No suggestions.</p>'}
            </div>
          </div>

        </div>
      </div>
    </div>`;
  },

  // ── PROFILE ─────────────────────────────────────────────
  profile() {
    const u = App.user;
    return `
    <div class="app">
      ${this.sidebar('profile')}
      <div class="main">
        ${this.topbar('Profile')}
        <div class="body page-in" style="max-width:580px">
          <div class="profile-header">
            <div class="avatar-lg">${u?.initials||'?'}</div>
            <div>
              <div class="profile-name">${u?.name}</div>
              <div class="profile-email">${u?.email}</div>
              <div style="margin-top:6px"><span class="tag tag-green">Active</span></div>
            </div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h3 class="card-title">Edit profile</h3>
            <div class="field">
              <label class="label">Full name</label>
              <input class="input" id="p-name" value="${u?.name||''}">
            </div>
            <div class="field">
              <label class="label">Email</label>
              <input class="input" id="p-email" type="email" value="${u?.email||''}">
            </div>
            <div class="err-msg" id="p-err"></div>
            <button class="btn btn-primary" id="p-save">Save changes</button>
          </div>

          <div class="card">
            <h3 class="card-title">Account</h3>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${[
                ['Member since', UI.date(u?.joined||new Date().toISOString())],
                ['Analyses run', Reports.all().length],
                ['Status', 'Active'],
              ].map(([l,v])=>`
              <div style="display:flex;justify-content:space-between;font-size:0.875rem;padding:7px 0;border-bottom:1px solid var(--line)">
                <span style="color:var(--ink-3)">${l}</span>
                <span>${v}</span>
              </div>`).join('')}
            </div>
            <div class="divider"></div>
            <button class="btn-logout" onclick="Auth.logout()" style="width:auto;padding:9px 16px">Sign out</button>
          </div>
        </div>
      </div>
    </div>`;
  },

  notFound() {
    return `
    ${this.pubNav()}
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px">
      <div style="font-family:var(--f-serif);font-size:5rem;color:var(--ink-3);margin-bottom:12px">404</div>
      <p style="color:var(--ink-3);margin-bottom:20px">Page not found</p>
      <button class="btn btn-primary" onclick="App.go('home')">Go home</button>
    </div>`;
  },

  // ── Event Binding ────────────────────────────────────────
  bind(page) {
    if (page === 'login')    this.bindLogin();
    if (page === 'signup')   this.bindSignup();
    if (page === 'contact')  this.bindContact();
    if (page === 'analyzer') this.bindAnalyzer();
    if (page === 'profile')  this.bindProfile();
    if (page === 'result')   this.bindResult();
  },

  bindLogin() {
    const btn = document.getElementById('l-btn');
    if (!btn) return;
    const go = () => {
      const email = document.getElementById('l-email').value.trim();
      const pass  = document.getElementById('l-pass').value;
      const err   = document.getElementById('l-err');
      if (!email||!pass) { err.textContent='Fill in all fields.'; err.style.display='block'; return; }
      const r = Auth.login(email, pass);
      if (!r.ok) { err.textContent=r.msg; err.style.display='block'; return; }
      UI.toast('Welcome back!','ok');
      App.go('dashboard');
    };
    btn.addEventListener('click', go);
    document.getElementById('l-pass').addEventListener('keydown', e => e.key==='Enter' && go());
  },

  bindSignup() {
    document.getElementById('s-btn')?.addEventListener('click', () => {
      const name  = document.getElementById('s-name').value.trim();
      const email = document.getElementById('s-email').value.trim();
      const pass  = document.getElementById('s-pass').value;
      const err   = document.getElementById('s-err');
      if (!name||!email||!pass) { err.textContent='Fill in all fields.'; err.style.display='block'; return; }
      if (pass.length<6) { err.textContent='Password must be 6+ characters.'; err.style.display='block'; return; }
      const r = Auth.signup(name, email, pass);
      if (!r.ok) { err.textContent=r.msg; err.style.display='block'; return; }
      UI.toast('Account created!','ok');
      App.go('dashboard');
    });
  },

  bindContact() {
    document.getElementById('c-send')?.addEventListener('click', () => {
      const n = document.getElementById('c-name').value.trim();
      const e = document.getElementById('c-email').value.trim();
      const m = document.getElementById('c-msg').value.trim();
      if (!n||!e||!m) { UI.toast('Fill in all fields.','err'); return; }
      document.getElementById('c-name').value='';
      document.getElementById('c-email').value='';
      document.getElementById('c-msg').value='';
      UI.toast('Message sent! We\'ll reply soon.','ok',4000);
    });
  },

  bindAnalyzer() {
    const zone = document.getElementById('drop-zone');
    if (!zone) return;
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('over');
      const f = e.dataTransfer.files[0];
      if (f) { window._file = f; showFilePill(f); }
    });
    document.getElementById('a-btn')?.addEventListener('click', runAnalysis);
  },

  bindProfile() {
    document.getElementById('p-save')?.addEventListener('click', () => {
      const name  = document.getElementById('p-name').value.trim();
      const email = document.getElementById('p-email').value.trim();
      const err   = document.getElementById('p-err');
      if (!name||!email) { err.textContent='Name and email required.'; err.style.display='block'; return; }
      const r = Auth.update(name, email);
      if (!r.ok) { err.textContent=r.msg; err.style.display='block'; return; }
      UI.toast('Profile updated!','ok');
      App.go('profile');
    });
  },

  bindResult() {
    document.getElementById('dl-btn')?.addEventListener('click', downloadReport);
  }
};

// ── Global handlers ──────────────────────────────────────
function handleFile(e) {
  const f = e.target.files[0];
  if (f) { window._file = f; showFilePill(f); }
}

function showFilePill(f) {
  const pill = document.getElementById('file-pill');
  const name = document.getElementById('file-name');
  const size = document.getElementById('file-size');
  if (pill && name && size) {
    name.textContent = f.name;
    size.textContent = (f.size/1024).toFixed(1)+' KB';
    pill.classList.add('show');
  }
}

async function runAnalysis() {
  const file = window._file;
  const errEl = document.getElementById('a-err');
  const btn   = document.getElementById('a-btn');
  const load  = document.getElementById('a-load');
  const txt   = document.getElementById('a-load-txt');

  errEl.style.display = 'none';

  // Validate file selected
  if (!file) {
    errEl.textContent = 'Please select a PDF resume first.';
    errEl.style.display = 'block';
    return;
  }

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    errEl.textContent = 'Only PDF files are supported.';
    errEl.style.display = 'block';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    errEl.textContent = 'File too large. Max 10MB.';
    errEl.style.display = 'block';
    return;
  }

  // Check API key configured
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    errEl.textContent = 'Gemini API key not configured. Please add your key to js/app.js';
    errEl.style.display = 'block';
    return;
  }

  btn.style.display = 'none';
  load.classList.add('show');

  try {
    txt.textContent = 'Reading your PDF…';
    const text = await PDF.extract(file);

    if (!text || text.trim().length < 50) {
      throw new Error('NOT_A_RESUME');
    }

    txt.textContent = 'Sending to Gemini AI…';
    await new Promise(r => setTimeout(r, 500));

    txt.textContent = 'Analyzing your resume…';
    const result = await AI.analyze(text);

    // Save to history
    Reports.save({
      filename: file.name,
      atsScore: result.atsScore,
      scoreLevel: result.scoreLevel,
      foundSkills: result.foundSkills || [],
      missingSkills: result.missingSkills || [],
      strengths: result.strengths || [],
      suggestions: result.suggestions || [],
      summary: result.summary || '',
    });

    window._file = null;
    UI.toast(`Analysis complete! Score: ${result.atsScore}%`, 'ok');
    App.go('result');

  } catch(err) {
    btn.style.display = 'flex';
    load.classList.remove('show');

    if (err.message === 'NOT_A_RESUME') {
      errEl.textContent = 'This doesn\'t appear to be a resume. Please upload a valid resume PDF.';
    } else if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('400')) {
      errEl.textContent = 'Invalid API key. Check your Gemini API key in js/app.js';
    } else if (err.message?.includes('429')) {
      errEl.textContent = 'API quota exceeded. Wait a moment and try again.';
    } else {
      errEl.textContent = 'Analysis failed. Check your API key and try again.';
      console.error(err);
    }
    errEl.style.display = 'block';
  }
}

function downloadReport() {
  const r = Reports.latest();
  if (!r) return;
  const text = `
RESUME ANALYSIS REPORT
======================
File: ${r.filename}
Date: ${UI.date(r.date)}
ATS Score: ${r.atsScore}% (${r.scoreLevel.toUpperCase()})

AI SUMMARY
${r.summary}

FOUND SKILLS (${r.foundSkills?.length||0})
${r.foundSkills?.join(', ')||'None'}

MISSING SKILLS (${r.missingSkills?.length||0})
${r.missingSkills?.join(', ')||'None'}

STRENGTHS
${r.strengths?.map((s,i)=>`${i+1}. ${s}`).join('\n')||'—'}

IMPROVEMENT SUGGESTIONS
${r.suggestions?.map((s,i)=>`${i+1}. ${s}`).join('\n')||'—'}

--
Generated by ResumeAI
  `.trim();
  const blob = new Blob([text], { type:'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `resume-analysis-${r.atsScore}pct.txt`;
  a.click();
  URL.revokeObjectURL(url);
  UI.toast('Report downloaded!','ok');
}
