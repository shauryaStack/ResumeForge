//  ResumeForge — Resume Form Module (resume-form.js)
import { showToast } from './app.js';

let _state = null;
let _onChange = null;

const TECH_SUGGESTIONS = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Kubernetes', 'Git', 'GraphQL', 'REST APIs', 'Machine Learning', 'TensorFlow', 'MongoDB', 'PostgreSQL'];
const SOFT_SUGGESTIONS = ['Leadership', 'Communication', 'Problem-solving', 'Teamwork', 'Adaptability', 'Critical Thinking', 'Time Management', 'Creativity'];

export function initForm(state, onChange) {
  _state = state;
  _onChange = onChange;

  initPersonalInfo();
  initSummary();
  initExperience();
  initEducation();
  initSkills();
  initProjectsAwards();
  hydrateFromState();
}

export function getFormData(state) {
  return state.resumeData;
}

// ==================== STEP 1: Personal Info ====================
function initPersonalInfo() {
  const fields = ['full-name', 'job-title', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'website'];
  const keys = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'website'];

  fields.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      _state.resumeData.personal[keys[i]] = el.value.trim();
      _onChange();
    });
  });
}

// ==================== STEP 2: Summary ====================
function initSummary() {
  const textarea = document.getElementById('summary');
  const counter = document.getElementById('summary-count');

  textarea.addEventListener('input', () => {
    const val = textarea.value;
    counter.textContent = val.length;
    counter.style.color = val.length > 500 ? '#ef4444' : '';
    _state.resumeData.summary = val;
    _onChange();
  });

  // Starter chips
  document.querySelectorAll('.starter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      textarea.value = chip.dataset.text;
      counter.textContent = chip.dataset.text.length;
      _state.resumeData.summary = chip.dataset.text;
      textarea.focus();
      _onChange();
      showToast('✨ Template applied — customize it!', 'success');
    });
  });

  // JD Keyword Analyzer
  document.getElementById('btn-analyze-jd').addEventListener('click', analyzeJobDescription);
}

function analyzeJobDescription() {
  const jdEl = document.getElementById('job-description');
  const jd = jdEl.value.trim();
  if (!jd) { showToast('Please paste a job description first', 'error'); return; }

  const resumeText = buildResumeText(_state.resumeData).toLowerCase();
  const jdWords = extractKeywords(jd);
  const found = [], missing = [];

  jdWords.forEach(kw => {
    (resumeText.includes(kw.toLowerCase()) ? found : missing).push(kw);
  });

  const resultsEl = document.getElementById('keyword-results');
  document.getElementById('keywords-found').innerHTML = found.slice(0, 20).map(k => `<span class="keyword-chip">${k}</span>`).join('');
  document.getElementById('keywords-missing').innerHTML = missing.slice(0, 20).map(k => `<span class="keyword-chip">${k}</span>`).join('');
  resultsEl.classList.remove('hidden');
  showToast(`Found ${found.length} keywords, ${missing.length} missing`, found.length > missing.length ? 'success' : 'error');
}

function extractKeywords(text) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'for', 'to', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'do', 'does', 'did', 'that', 'this', 'these', 'those', 'it', 'its', 'their', 'your', 'our', 'we', 'you', 'they', 'he', 'she', 'i', 'as', 'if', 'so', 'not', 'from', 'by', 'about', 'into', 'through', 'during', 'while', 'after', 'before', 'between', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'than', 'then', 'just', 'because', 'until', 'whether', 'within', 'without', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'up', 'out', 'around', 'down', 'off', 'above', 'below']);
  const words = text.toLowerCase().match(/\b[a-zA-Z][a-zA-Z+#.-]{2,}\b/g) || [];
  const freq = {};
  words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq).filter(([, v]) => v >= 1).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k]) => k);
}

// ==================== STEP 3: Experience ====================
let expCount = 0;

function initExperience() {
  document.getElementById('btn-add-experience').addEventListener('click', () => {
    addExperienceEntry();
    _onChange();
  });
}

function addExperienceEntry(data = {}) {
  expCount++;
  const id = `exp-${expCount}`;
  const idx = _state.resumeData.experience.length;
  _state.resumeData.experience.push({
    id, company: data.company || '', title: data.title || '',
    startDate: data.startDate || '', endDate: data.endDate || '',
    current: data.current || false, location: data.location || '',
    bullets: data.bullets || ['']
  });

  const list = document.getElementById('experience-list');
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = `card-${id}`;
  card.innerHTML = buildExpCardHTML(id, idx, _state.resumeData.experience[idx]);
  list.appendChild(card);

  bindExpCardEvents(card, id, idx);
  showToast('Experience added', 'success');
}

function buildExpCardHTML(id, idx, data) {
  const bulletsHTML = (data.bullets || ['']).map((b, bi) => buildBulletHTML(id, bi, b)).join('');
  return `
    <div class="entry-card-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
      <div>
        <div class="entry-card-title">${data.title || 'New Experience'}</div>
        <div class="entry-card-subtitle">${data.company || 'Company Name'}</div>
      </div>
      <div class="entry-card-actions">
        <button class="entry-btn delete" data-id="${id}" data-type="experience">✕ Remove</button>
      </div>
    </div>
    <div class="entry-card-body">
      <div class="entry-grid-2">
        <div class="form-group"><label class="form-label">Job Title *</label>
          <input class="form-input" data-field="title" placeholder="e.g. Senior Software Engineer" value="${esc(data.title)}" /></div>
        <div class="form-group"><label class="form-label">Company *</label>
          <input class="form-input" data-field="company" placeholder="e.g. Google" value="${esc(data.company)}" /></div>
        <div class="form-group"><label class="form-label">Start Date</label>
          <input class="form-input" type="month" data-field="startDate" value="${data.startDate || ''}" /></div>
        <div class="form-group"><label class="form-label">End Date</label>
          <input class="form-input" type="month" data-field="endDate" value="${data.endDate || ''}" ${data.current ? 'disabled' : ''} />
          <label style="font-size:0.77rem;margin-top:0.25rem;display:flex;align-items:center;gap:0.4rem;cursor:pointer;">
            <input type="checkbox" data-field="current" ${data.current ? 'checked' : ''} /> Currently working here
          </label>
        </div>
        <div class="form-group"><label class="form-label">Location</label>
          <input class="form-input" data-field="location" placeholder="e.g. New York, NY" value="${esc(data.location)}" /></div>
      </div>
      <div class="bullets-section">
        <p class="bullets-label">Key Achievements & Responsibilities</p>
        <div class="bullets-list" data-bullets="${id}">${bulletsHTML}</div>
        <button class="btn-add-bullet" data-add-bullet="${id}">+ Add achievement</button>
      </div>
    </div>
  `;
}

function buildBulletHTML(entryId, bulletIdx, value = '') {
  return `
    <div class="bullet-item" data-bullet-item>
      <span class="bullet-dot">•</span>
      <textarea class="bullet-input" data-bullet="${entryId}" data-bidx="${bulletIdx}" rows="1" placeholder="e.g. Increased revenue by 32% by redesigning checkout funnel...">${esc(value)}</textarea>
      <button class="bullet-remove" data-remove-bullet="${entryId}" data-bidx="${bulletIdx}">✕</button>
    </div>
  `;
}

function bindExpCardEvents(card, id, idx) {
  // Field inputs
  card.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', () => {
      const field = el.dataset.field;
      if (el.type === 'checkbox') {
        _state.resumeData.experience[idx][field] = el.checked;
        const endInput = card.querySelector('[data-field="endDate"]');
        if (endInput) endInput.disabled = el.checked;
      } else {
        _state.resumeData.experience[idx][field] = el.value;
        // Update card header
        const header = card.querySelector('.entry-card-title');
        const subheader = card.querySelector('.entry-card-subtitle');
        if (field === 'title' && header) header.textContent = el.value || 'New Experience';
        if (field === 'company' && subheader) subheader.textContent = el.value || 'Company Name';
      }
      _onChange();
    });
  });

  // Bullet inputs
  card.querySelectorAll('.bullet-input').forEach(el => {
    autoResize(el);
    el.addEventListener('input', () => {
      const bidx = parseInt(el.dataset.bidx);
      _state.resumeData.experience[idx].bullets[bidx] = el.value;
      autoResize(el);
      _onChange();
    });
  });

  // Add bullet
  card.querySelector(`[data-add-bullet="${id}"]`)?.addEventListener('click', () => {
    const bullets = _state.resumeData.experience[idx].bullets;
    bullets.push('');
    const bidx = bullets.length - 1;
    const list = card.querySelector(`[data-bullets="${id}"]`);
    const div = document.createElement('div');
    div.innerHTML = buildBulletHTML(id, bidx, '');
    const item = div.firstElementChild;
    list.appendChild(item);
    bindBulletEvents(item, id, idx, 'experience');
    item.querySelector('.bullet-input').focus();
    _onChange();
  });

  // Remove entry
  card.querySelector(`[data-id="${id}"]`)?.addEventListener('click', e => {
    e.stopPropagation();
    _state.resumeData.experience.splice(idx, 1);
    card.remove();
    _onChange();
    showToast('Entry removed', 'success');
  });

  // Remove bullet
  card.querySelectorAll('[data-remove-bullet]').forEach(btn => {
    btn.addEventListener('click', () => {
      const bidx = parseInt(btn.dataset.bidx);
      _state.resumeData.experience[idx].bullets.splice(bidx, 1);
      btn.closest('[data-bullet-item]').remove();
      _onChange();
    });
  });
}

function bindBulletEvents(item, entryId, idx, type) {
  const textarea = item.querySelector('.bullet-input');
  autoResize(textarea);
  textarea.addEventListener('input', () => {
    const bidx = parseInt(textarea.dataset.bidx);
    _state.resumeData[type][idx].bullets[bidx] = textarea.value;
    autoResize(textarea);
    _onChange();
  });
  const removeBtn = item.querySelector('[data-remove-bullet]');
  removeBtn?.addEventListener('click', () => {
    const bidx = parseInt(removeBtn.dataset.bidx);
    _state.resumeData[type][idx].bullets.splice(bidx, 1);
    item.remove();
    _onChange();
  });
}

// ==================== STEP 4: Education ====================
let eduCount = 0;

function initEducation() {
  document.getElementById('btn-add-education').addEventListener('click', () => {
    addEducationEntry();
    _onChange();
  });
}

function addEducationEntry(data = {}) {
  eduCount++;
  const id = `edu-${eduCount}`;
  const idx = _state.resumeData.education.length;
  _state.resumeData.education.push({
    id, institution: data.institution || '', degree: data.degree || '',
    field: data.field || '', startDate: data.startDate || '',
    endDate: data.endDate || '', gpa: data.gpa || '', honors: data.honors || ''
  });

  const list = document.getElementById('education-list');
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = `card-${id}`;
  card.innerHTML = buildEduCardHTML(id, _state.resumeData.education[idx]);
  list.appendChild(card);
  bindEduCardEvents(card, id, idx);
  showToast('Education added', 'success');
}

function buildEduCardHTML(id, data) {
  return `
    <div class="entry-card-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
      <div>
        <div class="entry-card-title">${data.degree || 'New Education'}</div>
        <div class="entry-card-subtitle">${data.institution || 'Institution'}</div>
      </div>
      <div class="entry-card-actions">
        <button class="entry-btn delete" data-id="${id}" data-type="education">✕ Remove</button>
      </div>
    </div>
    <div class="entry-card-body">
      <div class="entry-grid-2">
        <div class="form-group"><label class="form-label">Degree *</label>
          <input class="form-input" data-field="degree" placeholder="e.g. Bachelor of Science" value="${esc(data.degree)}" /></div>
        <div class="form-group"><label class="form-label">Institution *</label>
          <input class="form-input" data-field="institution" placeholder="e.g. MIT" value="${esc(data.institution)}" /></div>
        <div class="form-group"><label class="form-label">Field of Study</label>
          <input class="form-input" data-field="field" placeholder="e.g. Computer Science" value="${esc(data.field)}" /></div>
        <div class="form-group"><label class="form-label">GPA (optional)</label>
          <input class="form-input" data-field="gpa" placeholder="e.g. 3.8/4.0" value="${esc(data.gpa)}" /></div>
        <div class="form-group"><label class="form-label">Start Date</label>
          <input class="form-input" type="month" data-field="startDate" value="${data.startDate || ''}" /></div>
        <div class="form-group"><label class="form-label">End Date (or Expected)</label>
          <input class="form-input" type="month" data-field="endDate" value="${data.endDate || ''}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Honors / Achievements</label>
        <input class="form-input" data-field="honors" placeholder="e.g. Cum Laude, Dean's List, Relevant Coursework: ..." value="${esc(data.honors)}" /></div>
    </div>
  `;
}

function bindEduCardEvents(card, id, idx) {
  card.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', () => {
      _state.resumeData.education[idx][el.dataset.field] = el.value;
      const header = card.querySelector('.entry-card-title');
      const sub = card.querySelector('.entry-card-subtitle');
      if (el.dataset.field === 'degree' && header) header.textContent = el.value || 'New Education';
      if (el.dataset.field === 'institution' && sub) sub.textContent = el.value || 'Institution';
      _onChange();
    });
  });
  card.querySelector(`[data-id="${id}"]`)?.addEventListener('click', e => {
    e.stopPropagation();
    _state.resumeData.education.splice(idx, 1);
    card.remove();
    _onChange();
  });
}

// ==================== STEP 5: Skills ====================
function initSkills() {
  const categories = [
    { inputId: 'technical-skills-input', tagsId: 'technical-skills-tags', key: 'technical' },
    { inputId: 'soft-skills-input', tagsId: 'soft-skills-tags', key: 'soft' },
    { inputId: 'language-skills-input', tagsId: 'language-skills-tags', key: 'languages' },
    { inputId: 'tools-skills-input', tagsId: 'tools-skills-tags', key: 'tools' },
  ];

  categories.forEach(cat => {
    const input = document.getElementById(cat.inputId);
    const tagsContainer = document.getElementById(cat.tagsId);
    if (!input || !tagsContainer) return;

    input.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
        e.preventDefault();
        addSkillTag(input.value.trim(), cat.key, tagsContainer);
        input.value = '';
        _onChange();
      }
    });
  });

  // Populate tech suggestions
  const sugContainer = document.getElementById('suggested-technical');
  if (sugContainer) {
    TECH_SUGGESTIONS.slice(0, 12).forEach(skill => {
      const chip = document.createElement('span');
      chip.className = 'suggest-chip';
      chip.textContent = skill;
      chip.addEventListener('click', () => {
        addSkillTag(skill, 'technical', document.getElementById('technical-skills-tags'));
        _onChange();
      });
      sugContainer.appendChild(chip);
    });
  }
}

function addSkillTag(skill, category, container) {
  if (!skill || _state.resumeData.skills[category].includes(skill)) return;
  _state.resumeData.skills[category].push(skill);
  renderSkillTag(skill, category, container);
}

function renderSkillTag(skill, category, container) {
  const tag = document.createElement('span');
  tag.className = 'skill-tag';
  tag.innerHTML = `${esc(skill)}<button class="skill-tag-remove" title="Remove">✕</button>`;
  tag.querySelector('.skill-tag-remove').addEventListener('click', () => {
    _state.resumeData.skills[category] = _state.resumeData.skills[category].filter(s => s !== skill);
    tag.remove();
    _onChange();
  });
  container.appendChild(tag);
}

// ==================== STEP 6: Projects & Awards ====================
let projCount = 0, awardCount = 0;

function initProjectsAwards() {
  document.getElementById('btn-add-project').addEventListener('click', () => { addProjectEntry(); _onChange(); });
  document.getElementById('btn-add-award').addEventListener('click', () => { addAwardEntry(); _onChange(); });
}

function addProjectEntry(data = {}) {
  projCount++;
  const id = `proj-${projCount}`;
  const idx = _state.resumeData.projects.length;
  _state.resumeData.projects.push({ id, name: data.name || '', description: data.description || '', link: data.link || '', tech: data.tech || '' });

  const list = document.getElementById('projects-list');
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.innerHTML = `
    <div class="entry-card-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
      <div><div class="entry-card-title">${data.name || 'New Project'}</div></div>
      <div class="entry-card-actions">
        <button class="entry-btn delete" data-id="${id}" data-type="projects">✕ Remove</button>
      </div>
    </div>
    <div class="entry-card-body">
      <div class="entry-grid-2">
        <div class="form-group"><label class="form-label">Project Name *</label>
          <input class="form-input" data-field="name" placeholder="e.g. E-commerce Platform" value="${esc(data.name)}" /></div>
        <div class="form-group"><label class="form-label">Tech Stack / Tools</label>
          <input class="form-input" data-field="tech" placeholder="e.g. React, Node.js, PostgreSQL" value="${esc(data.tech)}" /></div>
        <div class="form-group"><label class="form-label">Project Link</label>
          <input class="form-input" data-field="link" type="url" placeholder="github.com/..." value="${esc(data.link)}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Description & Impact</label>
        <textarea class="form-textarea" data-field="description" rows="3" placeholder="Describe what you built and what impact it had...">${esc(data.description)}</textarea></div>
    </div>
  `;
  list.appendChild(card);
  bindGenericCardEvents(card, id, idx, 'projects', 'name', 'New Project');
  showToast('Project added', 'success');
}

function addAwardEntry(data = {}) {
  awardCount++;
  const id = `award-${awardCount}`;
  const idx = _state.resumeData.awards.length;
  _state.resumeData.awards.push({ id, title: data.title || '', issuer: data.issuer || '', date: data.date || '', description: data.description || '' });

  const list = document.getElementById('awards-list');
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.innerHTML = `
    <div class="entry-card-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
      <div><div class="entry-card-title">${data.title || 'New Award / Certification'}</div></div>
      <div class="entry-card-actions">
        <button class="entry-btn delete" data-id="${id}" data-type="awards">✕ Remove</button>
      </div>
    </div>
    <div class="entry-card-body">
      <div class="entry-grid-2">
        <div class="form-group"><label class="form-label">Award / Certification *</label>
          <input class="form-input" data-field="title" placeholder="e.g. AWS Certified Solutions Architect" value="${esc(data.title)}" /></div>
        <div class="form-group"><label class="form-label">Issuing Organization</label>
          <input class="form-input" data-field="issuer" placeholder="e.g. Amazon Web Services" value="${esc(data.issuer)}" /></div>
        <div class="form-group"><label class="form-label">Date</label>
          <input class="form-input" type="month" data-field="date" value="${data.date || ''}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label>
        <input class="form-input" data-field="description" placeholder="Brief description (optional)" value="${esc(data.description)}" /></div>
    </div>
  `;
  list.appendChild(card);
  bindGenericCardEvents(card, id, idx, 'awards', 'title', 'New Award / Certification');
  showToast('Award / Certification added', 'success');
}

function bindGenericCardEvents(card, id, idx, type, titleField, placeholder) {
  card.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', () => {
      _state.resumeData[type][idx][el.dataset.field] = el.value;
      if (el.dataset.field === titleField) {
        const header = card.querySelector('.entry-card-title');
        if (header) header.textContent = el.value || placeholder;
      }
      _onChange();
    });
  });
  card.querySelector(`[data-id="${id}"]`)?.addEventListener('click', e => {
    e.stopPropagation();
    _state.resumeData[type].splice(idx, 1);
    card.remove();
    _onChange();
  });
}

// ==================== Hydrate from State ====================
function hydrateFromState() {
  const d = _state.resumeData;
  const p = d.personal;

  // Personal
  const fields = { 'full-name': p.fullName, 'job-title': p.jobTitle, 'email': p.email, 'phone': p.phone, 'location': p.location, 'linkedin': p.linkedin, 'portfolio': p.portfolio, 'website': p.website };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });

  // Summary
  const sumEl = document.getElementById('summary');
  if (sumEl && d.summary) { sumEl.value = d.summary; document.getElementById('summary-count').textContent = d.summary.length; }

  // Experience
  d.experience.forEach(exp => addExperienceEntry(exp));

  // Education
  d.education.forEach(edu => addEducationEntry(edu));

  // Skills
  const cats = ['technical', 'soft', 'languages', 'tools'];
  const tagIds = ['technical-skills-tags', 'soft-skills-tags', 'language-skills-tags', 'tools-skills-tags'];
  cats.forEach((cat, i) => {
    const container = document.getElementById(tagIds[i]);
    if (container) {
      const existing = [...(d.skills[cat] || [])];
      d.skills[cat] = [];
      existing.forEach(skill => addSkillTag(skill, cat, container));
    }
  });

  // Projects
  d.projects.forEach(proj => addProjectEntry(proj));

  // Awards
  d.awards.forEach(award => addAwardEntry(award));
}

// ==================== Utilities ====================
function esc(str) { return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function autoResize(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }

// Expose for global resumeText building in JD analyzer
export function buildResumeText(data) {
  const parts = [
    Object.values(data.personal).join(' '),
    data.summary,
    data.experience.map(e => [e.title, e.company, ...(e.bullets || [])].join(' ')).join(' '),
    data.education.map(e => [e.degree, e.field, e.institution, e.honors].join(' ')).join(' '),
    Object.values(data.skills).flat().join(' '),
    data.projects.map(p => [p.name, p.description, p.tech].join(' ')).join(' '),
    data.awards.map(a => [a.title, a.issuer].join(' ')).join(' '),
  ];
  return parts.join(' ');
}
