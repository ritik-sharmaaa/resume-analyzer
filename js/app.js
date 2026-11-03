/* ============================================================
   ResumeAI: core (config, auth, router, storage, PDF, utils)
   ============================================================ */

// ── Site details ──────────────────────────────────────────
// Fill these in before launch. They appear on the Contact,
// Privacy Policy and Terms pages. Leave a value empty and the
// pages will leave that line out instead of showing a placeholder.
const SITE = {
  name:      'ResumeAI',
  owner:     '',          // Your full legal name or company name
  email:     '',          // Public contact address, e.g. on your custom domain
  domain:    '',          // e.g. 'resumeai.in' once connected in Vercel
  updated:   '3 November 2026',
  law:       'India'
};

// ── Config ────────────────────────────────────────────────
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

// ── App ───────────────────────────────────────────────────
const App = {
  user: null,

  init() {
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    this.loadUser();
    this.route();
    window.addEventListener('hashchange', () => this.route());
  },

  loadUser() {
    try {
      const d = localStorage.getItem('ru_user');
      this.user = d ? JSON.parse(d) : null;
    } catch { this.user = null; }
  },

  route() {
    const hash = window.location.hash.slice(1) || 'home';
    const protected_ = ['dashboard','analyzer','result','profile'];
    const authOnly   = ['login','signup'];

    if (protected_.includes(hash) && !this.user) { location.hash = 'login'; return; }
    if (authOnly.includes(hash)   && this.user)  { location.hash = 'dashboard'; return; }

    Pages.render(hash);
    window.scrollTo(0,0);
  },

  go(page) { location.hash = page; }
};

// ── Auth ──────────────────────────────────────────────────
const Auth = {
  users() {
    try { return JSON.parse(localStorage.getItem('ru_users')) || []; } catch { return []; }
  },

  saveUsers(u) { localStorage.setItem('ru_users', JSON.stringify(u)); },

  setUser(u) {
    localStorage.setItem('ru_user', JSON.stringify(u));
    App.user = u;
  },

  signup(name, email, pass) {
    const users = this.users();
    if (users.find(u => u.email === email))
      return { ok: false, msg: 'Email already registered.' };
    const u = {
      id: Date.now().toString(),
      name, email,
      pass: btoa(pass),
      joined: new Date().toISOString(),
      initials: name.slice(0,2).toUpperCase()
    };
    users.push(u);
    this.saveUsers(users);
    this.setUser(u);
    return { ok: true };
  },

  login(email, pass) {
    const u = this.users().find(u => u.email === email && u.pass === btoa(pass));
    if (!u) return { ok: false, msg: 'Wrong email or password.' };
    this.setUser(u);
    return { ok: true };
  },

  logout() {
    localStorage.removeItem('ru_user');
    App.user = null;
    App.go('home');
  },

  update(name, email) {
    const users = this.users();
    const i = users.findIndex(u => u.id === App.user.id);
    if (i < 0) return { ok: false, msg: 'User not found.' };
    if (users.some((u, j) => j !== i && u.email === email))
      return { ok: false, msg: 'That email is used by another account.' };
    users[i] = { ...users[i], name, email, initials: name.slice(0,2).toUpperCase() };
    this.saveUsers(users);
    this.setUser(users[i]);
    return { ok: true };
  },

  // Removes the account and all of its reports from this browser.
  deleteAccount() {
    const id = App.user?.id;
    if (!id) return;
    this.saveUsers(this.users().filter(u => u.id !== id));
    try {
      const all = JSON.parse(localStorage.getItem('ru_reports')) || [];
      localStorage.setItem('ru_reports', JSON.stringify(all.filter(r => r.uid !== id)));
    } catch {}
    this.logout();
  }
};

// ── Reports ───────────────────────────────────────────────
const Reports = {
  all() {
    try {
      const all = JSON.parse(localStorage.getItem('ru_reports')) || [];
      return all.filter(r => r.uid === App.user?.id);
    } catch { return []; }
  },

  save(r) {
    const all = (() => {
      try { return JSON.parse(localStorage.getItem('ru_reports')) || []; } catch { return []; }
    })();
    const report = { ...r, id: Date.now().toString(), date: new Date().toISOString(), uid: App.user.id };
    all.unshift(report);
    try { localStorage.setItem('ru_reports', JSON.stringify(all)); } catch {}
    return report;
  },

  get(id) {
    return this.all().find(r => r.id === id) || null;
  },

  del(id) {
    try {
      const all = JSON.parse(localStorage.getItem('ru_reports')) || [];
      localStorage.setItem('ru_reports', JSON.stringify(all.filter(r => !(r.id === id && r.uid === App.user?.id))));
    } catch {}
  },

  latest() { return this.all()[0] || null; }
};

// ── PDF Reader ────────────────────────────────────────────
const PDF = {
  async extract(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arr = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: arr }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(x => x.str).join(' ') + '\n';
          }
          res(text.trim());
        } catch(err) { rej(err); }
      };
      reader.onerror = () => rej(new Error('File read failed'));
      reader.readAsArrayBuffer(file);
    });
  }
};

// ── Gemini AI Analyzer ────────────────────────────────────
const AI = {
  async analyze(resumeText, apiKey) {
    const words = resumeText.trim().split(/\s+/).filter(Boolean);
    if (words.length < 30) {
      throw new Error('NOT_A_RESUME');
    }

    const resumeSignals = ['experience', 'education', 'skills', 'work', 'university',
      'college', 'degree', 'project', 'job', 'career', 'professional', 'resume',
      'cv', 'qualification', 'employment', 'position', 'role', 'company', 'intern'];
    const lower = resumeText.toLowerCase();
    const signalCount = resumeSignals.filter(s => lower.includes(s)).length;

    if (signalCount < 2) {
      throw new Error('NOT_A_RESUME');
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the following resume text and provide a detailed assessment.

RESUME TEXT:
"""
${resumeText.slice(0, 4000)}
"""

Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "atsScore": <number between 1-100>,
  "scoreLevel": "<excellent|good|poor>",
  "foundSkills": [<array of technical skills found in resume>],
  "missingSkills": [<array of important skills missing from this resume based on its field>],
  "strengths": [<2-3 specific strengths found in this resume>],
  "suggestions": [<4-5 specific, actionable improvement suggestions based on the actual content>],
  "summary": "<2 sentence honest assessment of this resume>"
}

Rules:
- atsScore: Be honest and realistic. Score based on: keyword density (30%), formatting signals (20%), experience clarity (25%), skills completeness (25%)
- excellent: 75-100, good: 45-74, poor: 1-44
- foundSkills: Only list skills explicitly mentioned in the resume
- missingSkills: Based on the resume's apparent field/role, what important skills are absent
- suggestions: Must be SPECIFIC to this actual resume content, not generic advice
- Do not use em dashes in any text field
- If the text is not a proper resume, set atsScore to 0 and summary to "This does not appear to be a resume."`;

    const response = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
      })
    });

    if (!response.ok) {
      let msg = `API error ${response.status}`;
      try { const err = await response.json(); msg = `${response.status} ${err.error?.message || ''}`; } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    if (result.atsScore === 0) throw new Error('NOT_A_RESUME');

    // Keep the score and level consistent with each other.
    const score = Math.max(1, Math.min(100, Math.round(Number(result.atsScore) || 0)));
    result.atsScore = score;
    result.scoreLevel = score >= 75 ? 'excellent' : score >= 45 ? 'good' : 'poor';

    return result;
  }
};

// ── UI Utils ──────────────────────────────────────────────
const UI = {
  // Escape text before it goes into innerHTML (file names, AI output, profile fields).
  esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  },

  toast(msg, type = 'default', ms = 3200) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = `toast ${type === 'ok' ? 'ok' : type === 'err' ? 'err' : ''}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  },

  date(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  toggleSidebar() {
    document.querySelector('.sidebar')?.classList.toggle('open');
    document.querySelector('.overlay')?.classList.toggle('show');
  },

  closeSidebar() {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.overlay')?.classList.remove('show');
  }
};

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
