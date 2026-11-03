/* ============================================================
   ResumeAI: pages and event binding
   ============================================================ */

const ICONS = {
  menu: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  upload: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const Pages = {
  current: null, // report shown on the result page

  render(page) {
    const root = document.getElementById('app');
    if (!root) return;
    const map = {
      home: 'home', about: 'about', features: 'features',
      contact: 'contact', login: 'login', signup: 'signup',
      dashboard: 'dashboard', analyzer: 'analyzer',
      result: 'result', profile: 'profile',
      privacy: 'privacy', terms: 'terms'
    };
    const name = map[page] || 'notFound';
    root.innerHTML = this[name]();
    document.title = this.titles[name] ? `${this.titles[name]} | ResumeAI` : 'ResumeAI | Resume analysis with Google Gemini';
    this.bind(page);
  },

  titles: {
    about: 'About', features: 'Features', contact: 'Contact', login: 'Log in',
    signup: 'Sign up', dashboard: 'Dashboard', analyzer: 'Analyze resume',
    result: 'Analysis result', profile: 'Profile', privacy: 'Privacy Policy',
    terms: 'Terms and Conditions', notFound: 'Page not found'
  },

  // ── Shared: Public Nav ──────────────────────────────────
  pubNav() {
    const right = App.user
      ? `<a class="btn btn-primary btn-sm" href="#dashboard">Dashboard</a>`
      : `<a class="btn btn-ghost btn-sm" href="#login">Log in</a>
         <a class="btn btn-primary btn-sm" href="#signup">Sign up</a>`;
    return `
    <nav class="pub-nav">
      <a class="logo" href="#home">
        <span class="logo-dot"></span>
        <span class="logo-name">ResumeAI</span>
      </a>
      <div class="pub-nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#features">Features</a>
        <a href="#contact">Contact</a>
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
        <a class="logo" href="#home" onclick="UI.closeSidebar()">
          <span class="logo-dot"></span>
          <span class="logo-name">ResumeAI</span>
        </a>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Menu</div>
        ${items.map(x => `
          <a class="nav-item ${active===x.id?'active':''}" href="#${x.id}" onclick="UI.closeSidebar()">
            <span class="nav-dot"></span>${x.label}
          </a>`).join('')}
        <div class="nav-label" style="margin-top:8px">Pages</div>
        ${pubItems.map(x => `
          <a class="nav-item" href="#${x.id}" onclick="UI.closeSidebar()">
            <span class="nav-dot"></span>${x.label}
          </a>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="user-row">
          <div class="avatar">${UI.esc(u?.initials||'?')}</div>
          <div style="min-width:0">
            <div class="user-name-sm">${UI.esc(u?.name||'User')}</div>
            <div class="user-email-sm">${UI.esc(u?.email||'')}</div>
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
        <button class="hamburger" onclick="UI.toggleSidebar()" aria-label="Open menu">${ICONS.menu}</button>
        <span class="topbar-title">${title}</span>
      </div>
    </header>`;
  },

  footer() {
    const year = new Date().getFullYear();
    return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <a class="logo" href="#home">
            <span class="logo-dot"></span>
            <span class="logo-name">ResumeAI</span>
          </a>
          <p class="footer-text">&copy; ${year} ${UI.esc(SITE.owner || SITE.name)}</p>
        </div>
        <div class="footer-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms and Conditions</a>
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
        <p class="hero-badge">Uses Google Gemini</p>
        <h1 class="hero-title">Find out what your<br>resume is missing</h1>
        <p class="hero-sub">
          Upload a PDF resume and get an estimated ATS score, the skills it lists, the skills it leaves out, and specific edits to make.
        </p>
        <div class="hero-btns">
          <a class="btn btn-primary btn-lg" href="#${App.user?'analyzer':'signup'}">Analyze my resume</a>
          <a class="btn btn-ghost btn-lg" href="#features">How it works</a>
        </div>

        <div class="hero-facts">
          ${[['Your own API key','Analysis runs on Google Gemini'],['Stored on your device','Reports stay in this browser'],['Free','No payment to use ResumeAI']].map(([v,l])=>`
          <div class="hero-fact">
            <div class="hero-fact-v">${v}</div>
            <div class="hero-fact-l">${l}</div>
          </div>`).join('')}
        </div>
      </section>

      <section class="section">
        <p class="section-eyebrow">What you get</p>
        <h2 class="section-title">A score, and the reasons behind it</h2>
        <p class="section-sub">Each report is written for the resume you upload, so the suggestions point at your actual content.</p>
        <div class="feat-grid">
          ${[
            ['Estimated ATS score','A score out of 100 based on keywords, formatting, how clearly your experience reads, and skill coverage.'],
            ['Skills found and missing','The skills your resume mentions, and skills that are commonly expected in your field but absent.'],
            ['Specific suggestions','Four or five edits that refer to what is in your resume, or what is not.'],
            ['PDF text extraction','Text is read from your PDF in the browser. Scanned image PDFs have no text layer and cannot be read.'],
            ['History','Every analysis is saved in your browser so you can compare versions as you edit.'],
            ['No server storage','We do not run a database. Your resume text goes only to the Gemini API, using your key.'],
          ].map(([title,desc])=>`
          <div class="feat-card">
            <h3 class="feat-title">${title}</h3>
            <p class="feat-desc">${desc}</p>
          </div>`).join('')}
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="cta-box">
          <h2 class="cta-title">Ready to check your resume?</h2>
          <p class="cta-sub">
            You need a PDF resume and a Gemini API key. You can create a key in
            <a class="text-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>.
          </p>
          <a class="btn btn-primary btn-lg" href="#${App.user?'analyzer':'signup'}">Get started</a>
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
        <p class="section-eyebrow">About</p>
        <h1 class="section-title">A small tool for checking resumes</h1>
        <p class="prose-lead">
          ResumeAI reads your resume with Google Gemini and tells you what to fix. You get a score out of 100, the skills it found, the skills that are commonly expected for your field, and a short list of edits. The score is an estimate produced by an AI model. It is not taken from any employer's applicant tracking system.
        </p>

        <h2 class="section-title" style="font-size:1.6rem;margin-top:12px">How it works</h2>
        <div class="steps">
          ${[
            ['1','Read','Your browser extracts the text from your PDF using PDF.js. The file itself is never uploaded.'],
            ['2','Analyze','The first 4,000 characters of that text are sent, with your API key, directly to Google\'s Gemini API.'],
            ['3','Save','The result is stored in your browser, on this device, so you can come back to it.'],
          ].map(([n,t,d])=>`
          <div class="card">
            <div class="step-n">${n}</div>
            <h3 class="card-title">${t}</h3>
            <p class="card-text">${d}</p>
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
        <p class="section-eyebrow">Features</p>
        <h1 class="section-title">What ResumeAI does</h1>
        <p class="section-sub">Everything below works today. There are no paid tiers.</p>
        <div class="feat-grid">
          ${[
            ['Gemini analysis','Your resume text is analyzed by Google\'s Gemini model, not a keyword counter.'],
            ['Estimated ATS score','Weighted across keyword density, formatting signals, experience clarity and skill coverage.'],
            ['Field-specific gaps','The model works out your field from the resume and lists relevant skills you have not mentioned.'],
            ['Specific suggestions','Each suggestion refers to something in your resume, or something missing from it.'],
            ['Resume check','Files that do not look like a resume are rejected before anything is sent to Gemini.'],
            ['History','Past analyses are stored in your browser. You can view or delete each one.'],
            ['Download report','Save any analysis as a plain text file.'],
            ['Privacy','Your key is used for one request and not saved. Your resume is not stored on any server we run.'],
          ].map(([t,d])=>`
          <div class="feat-card">
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
    const emailCard = SITE.email ? `
      <div class="card" style="padding:16px 18px">
        <div class="meta-label">Email</div>
        <a class="text-link" href="mailto:${UI.esc(SITE.email)}">${UI.esc(SITE.email)}</a>
      </div>` : '';
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <section class="section">
        <p class="section-eyebrow">Contact</p>
        <h1 class="section-title">Get in touch</h1>
        <p class="section-sub">Questions, bug reports or feedback are all welcome.</p>

        <div class="contact-grid">
          <div style="display:flex;flex-direction:column;gap:12px">
            ${emailCard}
            <div class="card" style="padding:16px 18px">
              <div class="meta-label">Based in</div>
              <div style="font-size:0.875rem;font-weight:500">India</div>
            </div>
          </div>
          <div class="card">
            <h3 class="card-title">Send a message</h3>
            <div class="field">
              <label class="label" for="c-name">Name</label>
              <input class="input" id="c-name" placeholder="Your name">
            </div>
            <div class="field">
              <label class="label" for="c-msg">Message</label>
              <textarea class="input" id="c-msg" placeholder="What would you like to tell us?"></textarea>
            </div>
            <button class="btn btn-primary btn-full" id="c-send">Open in my email app</button>
            <p class="hint">This opens your email app with the message filled in. Nothing is sent until you press send there.</p>
          </div>
        </div>
      </section>
      ${this.footer()}
    </main>`;
  },

  // ── PRIVACY POLICY ──────────────────────────────────────
  contactLine() {
    return SITE.email
      ? `email <a class="text-link" href="mailto:${UI.esc(SITE.email)}">${UI.esc(SITE.email)}</a>`
      : `use our <a class="text-link" href="#contact">Contact page</a>`;
  },

  privacy() {
    const who = SITE.owner ? `${UI.esc(SITE.name)} is operated by ${UI.esc(SITE.owner)} ("we", "us").` : `${UI.esc(SITE.name)} ("we", "us") is an independent project.`;
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <article class="section legal">
        <p class="section-eyebrow">Legal</p>
        <h1 class="section-title">Privacy Policy</h1>
        <p class="legal-date">Last updated: ${SITE.updated}</p>

        <p>${who} This policy explains what happens to your information when you use the website${SITE.domain ? ` at ${UI.esc(SITE.domain)}` : ''}.</p>

        <h2>1. The short version</h2>
        <p>We do not run a server database. Your account and your reports are stored in your own browser. To analyze a resume, the text of your resume is sent from your browser directly to Google's Gemini API using the API key you enter.</p>

        <h2>2. Information stored in your browser</h2>
        <p>When you sign up, your name, email address and password are saved in your browser's local storage on the device you are using. Your analysis reports (file name, score, skills, strengths, suggestions and summary) are saved there too. This information is not sent to us. It stays on that device until you delete it.</p>
        <p>Local storage is not encrypted. Anyone who can use your browser profile can view this information, so avoid creating an account on a shared computer and do not reuse a password you use elsewhere.</p>

        <h2>3. Resume text sent to Google</h2>
        <p>When you run an analysis, your browser extracts the text from your PDF. The PDF file itself is not uploaded anywhere. Up to the first 4,000 characters of the extracted text are sent, together with your API key, to the Google Gemini API. Google processes that request under its own terms and privacy policy, which you accepted when you created your key:</p>
        <ul>
          <li><a class="text-link" href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener">Gemini API Additional Terms of Service</a></li>
          <li><a class="text-link" href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a></li>
        </ul>
        <p>Depending on the type of Google account and plan behind your key, Google may use content sent through unpaid API services to improve its products. Read Google's terms before uploading a resume that contains information you do not want to share.</p>

        <h2>4. Your API key</h2>
        <p>Your Gemini API key is used for the single request you start and is not saved by ResumeAI.</p>

        <h2>5. Other services that load with this site</h2>
        <p>Like any website, loading these pages involves requests to other services, which receive standard technical information such as your IP address and browser type:</p>
        <ul>
          <li>Our hosting provider, Vercel, which serves the website and may keep request logs.</li>
          <li>Google Fonts, which provides the typefaces.</li>
          <li>cdnjs (Cloudflare), which provides the PDF.js library used to read your PDF.</li>
        </ul>

        <h2>6. Cookies and tracking</h2>
        <p>ResumeAI does not set cookies and does not use analytics or advertising trackers. It uses browser local storage only for the purposes described in section 2.</p>

        <h2>7. Deleting your information</h2>
        <p>You can delete any report from your dashboard, and delete your whole account and all of its reports from the Profile page. You can also clear this site's data in your browser settings. Because we never receive this information, we cannot recover it once it is deleted, and we cannot delete it for you from your device.</p>

        <h2>8. Age</h2>
        <p>ResumeAI is intended for people aged 18 and over.</p>

        <h2>9. Changes to this policy</h2>
        <p>If we change how ResumeAI handles information, we will update this page and the date at the top.</p>

        <h2>10. Contact</h2>
        <p>For questions about this policy, ${this.contactLine()}.</p>
      </article>
      ${this.footer()}
    </main>`;
  },

  // ── TERMS AND CONDITIONS ────────────────────────────────
  terms() {
    const who = SITE.owner ? `${UI.esc(SITE.name)}, operated by ${UI.esc(SITE.owner)}` : UI.esc(SITE.name);
    return `
    ${this.pubNav()}
    <main style="padding-top:60px">
      <article class="section legal">
        <p class="section-eyebrow">Legal</p>
        <h1 class="section-title">Terms and Conditions</h1>
        <p class="legal-date">Last updated: ${SITE.updated}</p>

        <p>These terms apply to your use of ${who} ("ResumeAI", "we", "us"). By creating an account or running an analysis, you agree to them. If you do not agree, please do not use the service.</p>

        <h2>1. The service</h2>
        <p>ResumeAI is a free tool that sends the text of your resume to Google's Gemini API and shows you the response: an estimated score, a list of skills, and suggestions. Accounts and reports are stored in your browser, as described in our <a class="text-link" href="#privacy">Privacy Policy</a>.</p>

        <h2>2. Your API key</h2>
        <p>You need your own Gemini API key. You are responsible for that key, for complying with Google's terms for it, and for any usage limits or charges on your Google account.</p>

        <h2>3. Your content</h2>
        <p>You keep all rights to the resumes you upload. You confirm that you have the right to submit any resume you upload, and that if it contains another person's information, you have their permission.</p>

        <h2>4. Acceptable use</h2>
        <p>Do not use ResumeAI to break the law, to process other people's personal data without permission, to interfere with the website, or to try to get around Google's usage limits.</p>

        <h2>5. AI output</h2>
        <p>Scores and suggestions are generated by an AI model and can be wrong, incomplete or inconsistent between runs. The score is an estimate. It is not produced by, and does not predict the result of, any employer's applicant tracking system. ResumeAI does not guarantee interviews, job offers or any other outcome. Use the feedback as one input and apply your own judgment.</p>

        <h2>6. Availability and data loss</h2>
        <p>The service is provided as it is and as available. We may change or stop it at any time. Because your data lives in your browser, it can be lost if you clear your browser data, change device, or use private browsing. Keep your own copy of anything important, for example by downloading reports.</p>

        <h2>7. Limitation of liability</h2>
        <p>To the extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of ResumeAI, including loss of data or of employment opportunities. Nothing in these terms limits any rights you have that cannot be limited by law.</p>

        <h2>8. Governing law</h2>
        <p>These terms are governed by the laws of ${UI.esc(SITE.law)}.</p>

        <h2>9. Changes</h2>
        <p>We may update these terms. The date at the top shows when they last changed. Continuing to use ResumeAI after a change means you accept the updated terms.</p>

        <h2>10. Contact</h2>
        <p>For questions about these terms, ${this.contactLine()}.</p>
      </article>
      ${this.footer()}
    </main>`;
  },

  // ── LOGIN ───────────────────────────────────────────────
  login() {
    return `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="auth-logo">
          <a class="logo" style="justify-content:center" href="#home">
            <span class="logo-dot"></span>
            <span class="logo-name">ResumeAI</span>
          </a>
        </div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-sub">Sign in to your account</p>
        <div class="field">
          <label class="label" for="l-email">Email</label>
          <input class="input" id="l-email" type="email" autocomplete="email" placeholder="you@example.com">
        </div>
        <div class="field">
          <label class="label" for="l-pass">Password</label>
          <input class="input" id="l-pass" type="password" autocomplete="current-password" placeholder="Your password">
        </div>
        <div class="err-msg" id="l-err"></div>
        <button class="btn btn-primary btn-full" style="margin-top:8px" id="l-btn">Sign in</button>
        <p class="auth-switch">No account? <a href="#signup">Sign up</a></p>
        <p class="auth-switch" style="margin-top:8px"><a href="#home" class="muted-link">Back to home</a></p>
      </div>
    </div>`;
  },

  // ── SIGNUP ──────────────────────────────────────────────
  signup() {
    return `
    <div class="auth-wrap">
      <div class="auth-box">
        <div class="auth-logo">
          <a class="logo" style="justify-content:center" href="#home">
            <span class="logo-dot"></span>
            <span class="logo-name">ResumeAI</span>
          </a>
        </div>
        <h2 class="auth-title">Create account</h2>
        <p class="auth-sub">Your account is stored in this browser only</p>
        <div class="field">
          <label class="label" for="s-name">Full name</label>
          <input class="input" id="s-name" autocomplete="name" placeholder="Your name">
        </div>
        <div class="field">
          <label class="label" for="s-email">Email</label>
          <input class="input" id="s-email" type="email" autocomplete="email" placeholder="you@example.com">
        </div>
        <div class="field">
          <label class="label" for="s-pass">Password <span style="color:var(--ink-3);font-size:0.72rem">(at least 6 characters)</span></label>
          <input class="input" id="s-pass" type="password" autocomplete="new-password" placeholder="Choose a password">
        </div>
        <label class="check">
          <input type="checkbox" id="s-agree">
          <span>I agree to the <a class="text-link" href="#terms">Terms and Conditions</a> and have read the <a class="text-link" href="#privacy">Privacy Policy</a>.</span>
        </label>
        <div class="err-msg" id="s-err"></div>
        <button class="btn btn-primary btn-full" style="margin-top:8px" id="s-btn">Create account</button>
        <p class="auth-switch">Have an account? <a href="#login">Sign in</a></p>
        <p class="auth-switch" style="margin-top:8px"><a href="#home" class="muted-link">Back to home</a></p>
      </div>
    </div>`;
  },

  // ── DASHBOARD ───────────────────────────────────────────
  dashboard() {
    const u = App.user;
    const reports = Reports.all();
    const avg = reports.length ? Math.round(reports.reduce((s,r)=>s+r.atsScore,0)/reports.length) : 0;

    const historyHTML = reports.length === 0
      ? `<div class="empty"><p class="empty-text">No analyses yet. Upload your first resume.</p>
         <a class="btn btn-primary" style="margin-top:14px" href="#analyzer">Analyze resume</a></div>`
      : `<div class="history-list">
          ${reports.slice(0,8).map(r=>`
          <div class="h-card">
            <div class="h-score ${UI.esc(r.scoreLevel)}">${Number(r.atsScore)}</div>
            <div class="h-info">
              <div class="h-name">${UI.esc(r.filename)}</div>
              <div class="h-date">${UI.date(r.date)}</div>
              <div class="h-bar"><div class="h-bar-fill ${UI.esc(r.scoreLevel)}" style="width:${Number(r.atsScore)}%"></div></div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn btn-ghost btn-sm" onclick="window.__rid='${UI.esc(r.id)}';App.go('result')">View</button>
              <button class="btn btn-sm btn-danger" onclick="Reports.del('${UI.esc(r.id)}');Pages.render('dashboard')">Delete</button>
            </div>
          </div>`).join('')}
        </div>`;

    return `
    <div class="app">
      ${this.sidebar('dashboard')}
      <div class="main">
        ${this.topbar('Dashboard')}
        <div class="body">
          <div style="margin-bottom:24px">
            <h1 class="page-h1">Good to see you, ${UI.esc(u?.name?.split(' ')[0]||'there')}</h1>
            <p class="page-sub">Here is an overview of your resume analyses.</p>
          </div>

          <div class="stats">
            ${[
              [reports.length,'Analyses'],
              [reports.length ? avg : 'None yet','Average score'],
              [reports.length ? reports[0].atsScore : 'None yet','Latest score'],
              [reports.filter(r=>r.scoreLevel==='excellent').length,'Rated excellent'],
            ].map(([v,l])=>`
            <div class="stat">
              <div class="stat-val">${v}</div>
              <div class="stat-lbl">${l}</div>
            </div>`).join('')}
          </div>

          <div style="display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap">
            <a class="btn btn-primary" href="#analyzer">New analysis</a>
            <a class="btn btn-ghost" href="#profile">Edit profile</a>
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
        <div class="body">
          <div style="max-width:620px">
            <h1 class="page-h1">Upload your resume</h1>
            <p class="page-sub" style="margin-bottom:24px">
              PDF only. The PDF must contain selectable text; scanned images cannot be read.
            </p>

            <div class="card" style="margin-bottom:16px">
              <div class="upload-area" id="drop-zone">
                <input type="file" id="resume-file" accept=".pdf,application/pdf" onchange="handleFile(event)" aria-label="Choose a PDF resume">
                <div class="upload-icon">${ICONS.upload}</div>
                <div class="upload-title">Drop a PDF here or click to browse</div>
                <div class="upload-sub">PDF resumes only, up to 10 MB</div>
              </div>
              <div class="file-pill" id="file-pill">
                <span id="file-name" style="flex:1;font-size:0.84rem;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
                <span id="file-size" style="font-size:0.75rem;color:var(--ink-3)"></span>
              </div>
            </div>

            <div class="card" style="margin-bottom:16px">
              <label class="label" for="gemini-key">Gemini API key</label>
              <input class="input" id="gemini-key" type="password" autocomplete="off" placeholder="Enter your key for this analysis">
              <p class="hint">Used for this request only and not saved. No key yet? Create one in <a class="text-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>.</p>
            </div>

            <div class="card" style="margin-bottom:16px">
              <h3 class="card-title" style="font-size:0.95rem;margin-bottom:10px">What the analysis looks at</h3>
              <p class="card-text">
                Technical skills, how clearly your experience is described, formatting signals, keyword density, skills that are commonly expected in your field, and quantified achievements.
              </p>
            </div>

            <div class="err-msg" id="a-err" style="margin-bottom:12px;font-size:0.875rem"></div>

            <button class="btn btn-primary btn-full btn-lg" id="a-btn">Run analysis</button>

            <div class="loading-wrap" id="a-load" role="status">
              <div class="spinner"></div>
              <p class="loading-text" id="a-load-txt">Reading your PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ── RESULT ──────────────────────────────────────────────
  result() {
    const id = window.__rid;
    const r = id ? Reports.get(id) : Reports.latest();
    window.__rid = null;
    this.current = r;

    if (!r) return `
    <div class="app">
      ${this.sidebar('')}
      <div class="main">
        ${this.topbar('Result')}
        <div class="body">
          <div class="empty">
            <p class="empty-text">No result to display.</p>
            <a class="btn btn-primary" style="margin-top:14px" href="#analyzer">Analyze a resume</a>
          </div>
        </div>
      </div>
    </div>`;

    const score = Number(r.atsScore) || 0;
    const level = ['excellent','good','poor'].includes(r.scoreLevel) ? r.scoreLevel : 'poor';
    const circ = 377;
    const offset = circ - (score / 100) * circ;
    const scoreColor = level==='excellent' ? 'var(--green)' : level==='good' ? 'var(--amber)' : 'var(--red)';
    const scoreWord  = level==='excellent' ? 'Excellent' : level==='good' ? 'Good' : 'Needs work';
    const list = a => Array.isArray(a) ? a : [];

    return `
    <div class="app">
      ${this.sidebar('')}
      <div class="main">
        ${this.topbar('Analysis Result')}
        <div class="body">

          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px">
            <div style="min-width:0">
              <h1 class="page-h1">Resume analysis</h1>
              <p style="font-size:0.8rem;color:var(--ink-3);overflow-wrap:anywhere">${UI.esc(r.filename)} · ${UI.date(r.date)}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a class="btn btn-ghost btn-sm" href="#dashboard">Dashboard</a>
              <a class="btn btn-ghost btn-sm" href="#analyzer">New analysis</a>
              <button class="btn btn-primary btn-sm" id="dl-btn">Download</button>
            </div>
          </div>

          <div class="result-grid" style="margin-bottom:18px">
            <div class="card" style="text-align:center;padding:24px 16px">
              <div class="ring-wrap">
                <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
                  <circle class="ring-bg" cx="70" cy="70" r="60"/>
                  <circle class="ring-fill ${level}" cx="70" cy="70" r="60" style="stroke-dashoffset:${offset}"/>
                </svg>
                <div class="ring-center">
                  <div class="ring-score" style="color:${scoreColor}">${score}</div>
                  <div class="ring-label">Est. ATS score</div>
                </div>
              </div>
              <div style="margin-top:10px;font-size:0.8rem;font-weight:600;color:${scoreColor}">${scoreWord}</div>
            </div>

            <div class="card">
              <h3 class="card-title">Summary</h3>
              <p class="card-text" style="margin-bottom:16px">${UI.esc(r.summary||'Analysis complete.')}</p>
              <div style="display:flex;flex-direction:column;gap:8px">
                ${[
                  ['Skills found', list(r.foundSkills).length, 'var(--green)'],
                  ['Missing skills', list(r.missingSkills).length, 'var(--red)'],
                  ['Suggestions', list(r.suggestions).length, 'var(--amber)'],
                ].map(([l,v,c])=>`
                <div class="kv">
                  <span style="color:var(--ink-3)">${l}</span>
                  <span style="font-weight:600;color:${c}">${v}</span>
                </div>`).join('')}
              </div>
            </div>
          </div>

          <div class="result-cols" style="margin-bottom:18px">
            <div class="card">
              <h3 class="card-title" style="font-size:0.95rem">Skills found</h3>
              <div class="chips">
                ${list(r.foundSkills).length
                  ? list(r.foundSkills).map(s=>`<span class="chip chip-found">${UI.esc(s)}</span>`).join('')
                  : '<span style="font-size:0.82rem;color:var(--ink-3)">None detected</span>'}
              </div>
            </div>
            <div class="card">
              <h3 class="card-title" style="font-size:0.95rem">Missing skills</h3>
              <div class="chips">
                ${list(r.missingSkills).length
                  ? list(r.missingSkills).map(s=>`<span class="chip chip-missing">${UI.esc(s)}</span>`).join('')
                  : '<span style="font-size:0.82rem;color:var(--ink-3)">No major gaps found</span>'}
              </div>
            </div>
          </div>

          ${list(r.strengths).length ? `
          <div class="card" style="margin-bottom:18px">
            <h3 class="card-title" style="font-size:0.95rem">Strengths</h3>
            <ul class="suggestions">
              ${list(r.strengths).map(s=>`<li class="suggestion"><span class="suggestion-mark ok"></span><span>${UI.esc(s)}</span></li>`).join('')}
            </ul>
          </div>` : ''}

          <div class="card" style="margin-bottom:18px">
            <h3 class="card-title" style="font-size:0.95rem">Suggested changes</h3>
            ${list(r.suggestions).length
              ? `<ol class="suggestions">${list(r.suggestions).map(s=>`<li class="suggestion"><span class="suggestion-mark"></span><span>${UI.esc(s)}</span></li>`).join('')}</ol>`
              : '<p style="font-size:0.84rem;color:var(--ink-3)">No suggestions.</p>'}
          </div>

          <p class="hint">This score is an AI estimate. It is not produced by any employer's applicant tracking system and results can vary between runs.</p>

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
        <div class="body" style="max-width:580px">
          <div class="profile-header">
            <div class="avatar-lg">${UI.esc(u?.initials||'?')}</div>
            <div style="min-width:0">
              <div class="profile-name">${UI.esc(u?.name)}</div>
              <div class="profile-email">${UI.esc(u?.email)}</div>
            </div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h3 class="card-title">Edit profile</h3>
            <div class="field">
              <label class="label" for="p-name">Full name</label>
              <input class="input" id="p-name" value="${UI.esc(u?.name||'')}">
            </div>
            <div class="field">
              <label class="label" for="p-email">Email</label>
              <input class="input" id="p-email" type="email" value="${UI.esc(u?.email||'')}">
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
                ['Stored', 'In this browser only'],
              ].map(([l,v])=>`
              <div class="kv">
                <span style="color:var(--ink-3)">${l}</span>
                <span>${v}</span>
              </div>`).join('')}
            </div>
            <div class="divider"></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn-logout" onclick="Auth.logout()" style="width:auto;padding:9px 16px">Sign out</button>
              <button class="btn btn-sm btn-danger" id="p-delete">Delete account and reports</button>
            </div>
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
      <a class="btn btn-primary" href="#home">Go home</a>
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
      UI.toast('Signed in.','ok');
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
      const agree = document.getElementById('s-agree').checked;
      const err   = document.getElementById('s-err');
      if (!name||!email||!pass) { err.textContent='Fill in all fields.'; err.style.display='block'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent='Enter a valid email address.'; err.style.display='block'; return; }
      if (pass.length<6) { err.textContent='Password must be at least 6 characters.'; err.style.display='block'; return; }
      if (!agree) { err.textContent='Please accept the Terms and Conditions to continue.'; err.style.display='block'; return; }
      const r = Auth.signup(name, email, pass);
      if (!r.ok) { err.textContent=r.msg; err.style.display='block'; return; }
      UI.toast('Account created.','ok');
      App.go('dashboard');
    });
  },

  bindContact() {
    document.getElementById('c-send')?.addEventListener('click', () => {
      const n = document.getElementById('c-name').value.trim();
      const m = document.getElementById('c-msg').value.trim();
      if (!n||!m) { UI.toast('Add your name and a message.','err'); return; }
      if (!SITE.email) { UI.toast('A contact address has not been set up yet.','err'); return; }
      const subject = encodeURIComponent(`ResumeAI message from ${n}`);
      const body = encodeURIComponent(m);
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    });
  },

  bindAnalyzer() {
    window._file = null;
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
      if (!name||!email) { err.textContent='Name and email are required.'; err.style.display='block'; return; }
      const r = Auth.update(name, email);
      if (!r.ok) { err.textContent=r.msg; err.style.display='block'; return; }
      UI.toast('Profile updated.','ok');
      Pages.render('profile');
    });

    const del = document.getElementById('p-delete');
    del?.addEventListener('click', () => {
      if (del.dataset.confirm !== '1') {
        del.dataset.confirm = '1';
        del.textContent = 'Click again to permanently delete';
        return;
      }
      Auth.deleteAccount();
      UI.toast('Your account and reports were deleted from this browser.','ok',4000);
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
    errEl.textContent = 'File too large. The limit is 10 MB.';
    errEl.style.display = 'block';
    return;
  }

  const apiKey = document.getElementById('gemini-key').value.trim();
  if (!apiKey) {
    errEl.textContent = 'Enter your Gemini API key to run the analysis.';
    errEl.style.display = 'block';
    return;
  }

  if (typeof pdfjsLib === 'undefined') {
    errEl.textContent = 'The PDF reader did not load. Check your connection and refresh the page.';
    errEl.style.display = 'block';
    return;
  }

  btn.style.display = 'none';
  load.classList.add('show');

  try {
    txt.textContent = 'Reading your PDF';
    const text = await PDF.extract(file);

    if (!text || text.trim().length < 50) {
      throw new Error('NO_TEXT');
    }

    txt.textContent = 'Analyzing with Gemini';
    const result = await AI.analyze(text, apiKey);

    const saved = Reports.save({
      filename: file.name,
      atsScore: result.atsScore,
      scoreLevel: result.scoreLevel,
      foundSkills: Array.isArray(result.foundSkills) ? result.foundSkills : [],
      missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      summary: result.summary || '',
    });

    window._file = null;
    window.__rid = saved.id;
    UI.toast(`Analysis complete. Score: ${result.atsScore}`, 'ok');
    App.go('result');

  } catch(err) {
    btn.style.display = 'flex';
    load.classList.remove('show');

    const m = err.message || '';
    if (m === 'NOT_A_RESUME') {
      errEl.textContent = 'This does not look like a resume. Please upload a resume PDF.';
    } else if (m === 'NO_TEXT') {
      errEl.textContent = 'No text could be read from this PDF. If it is a scanned image, export it again as a text PDF.';
    } else if (m.includes('API_KEY_INVALID') || m.includes('API key not valid') || m.startsWith('400') || m.startsWith('403')) {
      errEl.textContent = 'The API key was not accepted. Check the key entered above.';
    } else if (m.startsWith('429')) {
      errEl.textContent = 'Your Gemini quota has been reached. Wait a moment and try again.';
    } else if (err instanceof SyntaxError) {
      errEl.textContent = 'Gemini returned a response that could not be read. Please try again.';
    } else {
      errEl.textContent = 'Analysis failed. Check your API key and connection, then try again.';
      console.error(err);
    }
    errEl.style.display = 'block';
  }
}

function downloadReport() {
  const r = Pages.current || Reports.latest();
  if (!r) return;
  const lines = (a) => Array.isArray(a) && a.length ? a.map((s,i)=>`${i+1}. ${s}`).join('\n') : 'None';
  const text = `
RESUME ANALYSIS REPORT
======================
File: ${r.filename}
Date: ${UI.date(r.date)}
Estimated ATS score: ${r.atsScore} / 100 (${String(r.scoreLevel).toUpperCase()})

SUMMARY
${r.summary}

SKILLS FOUND (${r.foundSkills?.length||0})
${r.foundSkills?.join(', ')||'None'}

MISSING SKILLS (${r.missingSkills?.length||0})
${r.missingSkills?.join(', ')||'None'}

STRENGTHS
${lines(r.strengths)}

SUGGESTED CHANGES
${lines(r.suggestions)}

This score is an AI estimate and is not produced by any employer's applicant tracking system.
  `.trim();
  const blob = new Blob([text], { type:'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const base = String(r.filename || 'resume').replace(/\.pdf$/i, '').replace(/[^\w.-]+/g, '-');
  a.href = url; a.download = `${base}-analysis.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  UI.toast('Report downloaded.','ok');
}
