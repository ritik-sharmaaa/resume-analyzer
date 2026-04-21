/* ============================================================
   AI Resume Analyzer — Core JS (auth, routing, utilities)
   ============================================================ */

// ── App State ──────────────────────────────────────────────
const App = {
  currentUser: null,
  currentPage: 'home',

  /** Boot the application */
  init() {
    this.loadUser();
    this.router();
    window.addEventListener('hashchange', () => this.router());
  },

  /** Load authenticated user from localStorage */
  loadUser() {
    const data = localStorage.getItem('ara_current_user');
    if (data) {
      try { this.currentUser = JSON.parse(data); } catch(e) { this.currentUser = null; }
    }
  },

  /** Simple hash-based router */
  router() {
    const hash = window.location.hash.slice(1) || 'home';
    this.currentPage = hash;

    // Redirect unauthenticated users away from protected pages
    const protected_pages = ['dashboard', 'analyzer', 'result', 'profile'];
    const auth_pages = ['login', 'signup'];

    if (protected_pages.includes(hash) && !this.currentUser) {
      window.location.hash = 'login';
      return;
    }
    if (auth_pages.includes(hash) && this.currentUser) {
      window.location.hash = 'dashboard';
      return;
    }

    Pages.render(hash);
  },

  /** Navigate programmatically */
  navigate(page) {
    window.location.hash = page;
  }
};

// ── Auth ───────────────────────────────────────────────────
const Auth = {
  /** Register new user */
  signup(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, msg: 'An account with this email already exists.' };
    }
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: btoa(password), // base64 – good enough for demo
      createdAt: new Date().toISOString(),
      avatar: name.charAt(0).toUpperCase()
    };
    users.push(user);
    localStorage.setItem('ara_users', JSON.stringify(users));
    this.setCurrentUser(user);
    return { ok: true };
  },

  /** Authenticate existing user */
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === btoa(password));
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    this.setCurrentUser(user);
    return { ok: true };
  },

  /** Logout */
  logout() {
    localStorage.removeItem('ara_current_user');
    App.currentUser = null;
    App.navigate('home');
  },

  setCurrentUser(user) {
    const safe = { ...user, password: undefined }; // don't store pw in session
    localStorage.setItem('ara_current_user', JSON.stringify(user));
    App.currentUser = user;
  },

  getUsers() {
    try { return JSON.parse(localStorage.getItem('ara_users')) || []; } catch { return []; }
  },

  /** Update profile */
  updateProfile(name, email) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === App.currentUser.id);
    if (idx === -1) return { ok: false, msg: 'User not found.' };
    users[idx].name = name;
    users[idx].email = email;
    users[idx].avatar = name.charAt(0).toUpperCase();
    localStorage.setItem('ara_users', JSON.stringify(users));
    this.setCurrentUser(users[idx]);
    return { ok: true };
  }
};

// ── Reports Store ──────────────────────────────────────────
const Reports = {
  /** Save a new analysis report */
  save(report) {
    const all = this.getAll();
    all.unshift({ ...report, id: Date.now().toString(), date: new Date().toISOString() });
    localStorage.setItem('ara_reports', JSON.stringify(all));
  },

  /** Get all reports for current user */
  getAll() {
    try {
      const all = JSON.parse(localStorage.getItem('ara_reports')) || [];
      return all.filter(r => r.userId === (App.currentUser?.id || ''));
    } catch { return []; }
  },

  /** Get single report by id */
  getById(id) {
    try {
      const all = JSON.parse(localStorage.getItem('ara_reports')) || [];
      return all.find(r => r.id === id) || null;
    } catch { return null; }
  },

  /** Delete a report */
  delete(id) {
    try {
      let all = JSON.parse(localStorage.getItem('ara_reports')) || [];
      all = all.filter(r => r.id !== id);
      localStorage.setItem('ara_reports', JSON.stringify(all));
    } catch {}
  }
};

// ── Analyzer ───────────────────────────────────────────────
const Analyzer = {
  // Required skills to check against
  REQUIRED_SKILLS: [
    'HTML', 'CSS', 'JavaScript', 'React', 'Python',
    'SQL', 'Git', 'Azure', 'TypeScript', 'Node.js',
    'MongoDB', 'Docker', 'REST API', 'Agile', 'Java'
  ],

  BONUS_KEYWORDS: [
    'leadership', 'communication', 'teamwork', 'problem solving',
    'project management', 'agile', 'scrum', 'ci/cd', 'aws', 'gcp'
  ],

  /**
   * Analyze extracted resume text
   * Returns: { score, foundSkills, missingSkills, bonusKeywords, suggestions, level }
   */
  analyze(text) {
    const lower = text.toLowerCase();

    // ── Skill matching ──
    const foundSkills = this.REQUIRED_SKILLS.filter(s => lower.includes(s.toLowerCase()));
    const missingSkills = this.REQUIRED_SKILLS.filter(s => !lower.includes(s.toLowerCase()));
    const foundBonus = this.BONUS_KEYWORDS.filter(k => lower.includes(k));

    // ── Score calculation ──
    const skillScore  = (foundSkills.length / this.REQUIRED_SKILLS.length) * 60; // 60 pts
    const bonusScore  = Math.min(foundBonus.length * 2, 15);                      // 15 pts
    const lengthScore = this.calcLengthScore(text);                               // 15 pts
    const formatScore = this.calcFormatScore(text);                               // 10 pts

    const raw = skillScore + bonusScore + lengthScore + formatScore;
    const score = Math.round(Math.min(Math.max(raw, 5), 99));

    // ── Suggestions ──
    const suggestions = this.buildSuggestions(missingSkills, text, foundBonus);

    // ── Level ──
    const level = score >= 75 ? 'excellent' : score >= 45 ? 'good' : 'poor';

    return { score, foundSkills, missingSkills, bonusKeywords: foundBonus, suggestions, level };
  },

  calcLengthScore(text) {
    const words = text.trim().split(/\s+/).length;
    if (words > 400) return 15;
    if (words > 200) return 10;
    if (words > 100) return 5;
    return 2;
  },

  calcFormatScore(text) {
    let score = 0;
    if (/experience/i.test(text))   score += 2;
    if (/education/i.test(text))    score += 2;
    if (/skills/i.test(text))       score += 2;
    if (/project/i.test(text))      score += 2;
    if (/@[a-z]+\.[a-z]+/i.test(text)) score += 1; // email
    if (/\d{3}[-.\s]\d{3}/i.test(text)) score += 1; // phone
    return Math.min(score, 10);
  },

  buildSuggestions(missingSkills, text, foundBonus) {
    const suggestions = [];

    // Skill-based suggestions
    if (missingSkills.length > 0) {
      const top = missingSkills.slice(0, 3).join(', ');
      suggestions.push(`Add prominent mentions of ${top} in your skills section to boost ATS match.`);
    }

    if (!foundBonus.includes('leadership')) {
      suggestions.push('Include leadership examples or accomplishments to stand out.');
    }

    if (!/quantif|%|increased|reduced|improved|achieved/i.test(text)) {
      suggestions.push('Quantify achievements (e.g. "Increased performance by 30%") to demonstrate impact.');
    }

    if (!/github|portfolio|linkedin/i.test(text)) {
      suggestions.push('Add links to your GitHub, LinkedIn or portfolio for recruiters to review your work.');
    }

    if (!/summary|objective|profile/i.test(text)) {
      suggestions.push('Include a professional summary at the top of your resume to immediately capture attention.');
    }

    if (text.trim().split(/\s+/).length < 300) {
      suggestions.push('Your resume seems short. A 1–2 page resume with detailed experiences performs better with ATS.');
    }

    if (missingSkills.includes('Git')) {
      suggestions.push('Mention Git version control experience — it\'s expected in virtually all tech roles.');
    }

    return suggestions.slice(0, 5); // max 5
  }
};

// ── UI Helpers ─────────────────────────────────────────────
const UI = {
  /** Show a toast notification */
  toast(msg, type = 'default', duration = 3500) {
    let el = document.getElementById('global-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = `toast ${type}`;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), duration);
  },

  /** Format a date string */
  formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  },

  /** Animate a progress circle */
  animateCircle(el, score) {
    const circumference = 440;
    const offset = circumference - (score / 100) * circumference;
    requestAnimationFrame(() => {
      el.style.strokeDashoffset = offset;
    });
  },

  /** Sidebar toggle */
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('show');
  },

  closeSidebar() {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('show');
  }
};

// ── PDF Text Extraction ────────────────────────────────────
const PDFReader = {
  /**
   * Extract text from a PDF File object using PDF.js
   * Returns a Promise<string>
   */
  async extract(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArr = new Uint8Array(e.target.result);

          // PDF.js loaded globally from CDN
          const pdf = await pdfjsLib.getDocument({ data: typedArr }).promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }

          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.readAsArrayBuffer(file);
    });
  }
};

// ── Start on DOM ready ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
