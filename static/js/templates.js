//  ResumeForge — Templates Module (templates.js)

import { showToast } from './app.js';
import { renderPreview } from './preview.js';
import { getFormData } from './resume-form.js';

export function initTemplates(state) {
  // Template grid in modal
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.currentTemplate = card.dataset.template;
      const data = getFormData(state);
      renderPreview(data, state.currentTemplate);
      document.getElementById('template-modal').classList.add('hidden');
      showToast(`✅ Template changed to ${capitalize(state.currentTemplate)}`, 'success');
    });
  });
}

export function setTemplate(state, templateName) {
  state.currentTemplate = templateName;
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// =====================================================
//  Template Renderers — called by preview.js
// =====================================================
export function renderExecutive(data) {
  const p = data.personal;
  return `
  <div class="resume-executive">
    <div class="r-header">
      <div class="r-name">${esc(p.fullName || 'Your Name')}</div>
      <div class="r-title">${esc(p.jobTitle || 'Professional Title')}</div>
      <div class="r-contacts">
        ${contactItem(p.email, '📧')}
        ${contactItem(p.phone, '📱')}
        ${contactItem(p.location, '📍')}
        ${contactItem(p.linkedin, '🔗')}
        ${contactItem(p.portfolio, '💻')}
      </div>
    </div>

    ${data.summary ? `<div class="r-section"><div class="r-section-title">Professional Summary</div><div class="r-summary">${esc(data.summary)}</div></div>` : ''}

    ${data.experience.length ? `
    <div class="r-section">
      <div class="r-section-title">Work Experience</div>
      ${data.experience.map(exp => `
        <div class="r-entry">
          <div class="r-entry-header">
            <div>
              <div class="r-entry-title">${esc(exp.title)}</div>
              <div class="r-entry-sub">${esc(exp.company)}${exp.location ? ' · ' + esc(exp.location) : ''}</div>
            </div>
            <div class="r-entry-date">${formatDate(exp.startDate)}${exp.endDate || exp.current ? ' – ' + (exp.current ? 'Present' : formatDate(exp.endDate)) : ''}</div>
          </div>
          ${renderBullets(exp.bullets, 'r-bullet')}
        </div>
      `).join('')}
    </div>` : ''}

    ${data.education.length ? `
    <div class="r-section">
      <div class="r-section-title">Education</div>
      ${data.education.map(edu => `
        <div class="r-entry">
          <div class="r-entry-header">
            <div>
              <div class="r-entry-title">${esc(edu.degree)}${edu.field ? ' in ' + esc(edu.field) : ''}</div>
              <div class="r-entry-sub">${esc(edu.institution)}${edu.gpa ? ' · GPA: ' + esc(edu.gpa) : ''}</div>
            </div>
            <div class="r-entry-date">${formatDate(edu.startDate)}${edu.endDate ? ' – ' + formatDate(edu.endDate) : ''}</div>
          </div>
          ${edu.honors ? `<div style="font-size:11px;color:#718096;margin-top:3px;font-style:italic;">${esc(edu.honors)}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${renderSkillsSection(data, 'r-skills-list', 'r-skill-tag')}
    ${renderProjects(data, 'r-entry', 'r-entry-title', 'r-entry-sub', 'r-summary')}
    ${renderAwards(data, 'r-entry', 'r-entry-title', 'r-entry-sub')}
  </div>`;
}

export function renderModern(data) {
  const p = data.personal;
  const allSkills = Object.values(data.skills).flat();
  return `
  <div class="resume-modern">
    <div class="r-sidebar">
      <div class="r-name">${esc(p.fullName || 'Your Name')}</div>
      <div class="r-title">${esc(p.jobTitle || 'Professional Title')}</div>
      <div class="r-sidebar-section">
        <div class="r-sidebar-section-title">Contact</div>
        ${p.email ? `<div class="r-contact-item">✉ ${esc(p.email)}</div>` : ''}
        ${p.phone ? `<div class="r-contact-item">📱 ${esc(p.phone)}</div>` : ''}
        ${p.location ? `<div class="r-contact-item">📍 ${esc(p.location)}</div>` : ''}
        ${p.linkedin ? `<div class="r-contact-item">🔗 ${esc(p.linkedin)}</div>` : ''}
        ${p.portfolio ? `<div class="r-contact-item">💻 ${esc(p.portfolio)}</div>` : ''}
      </div>
      ${allSkills.length ? `
      <div class="r-sidebar-section">
        <div class="r-sidebar-section-title">Skills</div>
        ${allSkills.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('')}
      </div>` : ''}
      ${data.education.length ? `
      <div class="r-sidebar-section">
        <div class="r-sidebar-section-title">Education</div>
        ${data.education.map(edu => `
          <div style="margin-bottom:10px;">
            <div style="font-size:10.5px;font-weight:700;color:rgba(255,255,255,0.85);">${esc(edu.degree)}</div>
            <div style="font-size:9.5px;color:rgba(255,255,255,0.55);">${esc(edu.institution)}</div>
            <div style="font-size:9.5px;color:rgba(255,255,255,0.4);">${formatDate(edu.endDate) || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
    <div class="r-main">
      ${data.summary ? `<div class="r-section-title">Summary</div><div class="r-summary">${esc(data.summary)}</div>` : ''}
      ${data.experience.length ? `
      <div class="r-section-title">Experience</div>
      ${data.experience.map(exp => `
        <div style="margin-bottom:14px;">
          <div class="r-entry-title">${esc(exp.title)}</div>
          <div class="r-entry-sub"><span>${esc(exp.company)}</span><span>${formatDate(exp.startDate)}${(exp.endDate || exp.current) ? ' – ' + (exp.current ? 'Present' : formatDate(exp.endDate)) : ''}</span></div>
          ${renderBullets(exp.bullets, 'r-bullet')}
        </div>`).join('')}` : ''}
      ${data.projects.length ? `
      <div class="r-section-title">Projects</div>
      ${data.projects.map(proj => `
        <div style="margin-bottom:10px;">
          <div class="r-entry-title">${esc(proj.name)}</div>
          ${proj.tech ? `<div class="r-entry-sub"><span>${esc(proj.tech)}</span></div>` : ''}
          ${proj.description ? `<div class="r-summary" style="margin-top:3px;">${esc(proj.description)}</div>` : ''}
        </div>`).join('')}` : ''}
    </div>
  </div>`;
}

export function renderCreative(data) {
  const p = data.personal;
  return `
  <div class="resume-creative">
    <div class="r-header">
      <div class="r-name">${esc(p.fullName || 'Your Name')}</div>
      <div class="r-title">${esc(p.jobTitle || 'Professional Title')}</div>
      <div class="r-contacts">
        ${[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
      </div>
    </div>
    <div class="r-body">
      ${data.summary ? `<div class="r-section-title">About Me</div><div class="r-summary">${esc(data.summary)}</div>` : ''}
      ${data.experience.length ? `
      <div class="r-section-title">Experience</div>
      ${data.experience.map(exp => `
        <div style="margin-bottom:14px;">
          <div class="r-entry-title">${esc(exp.title)}</div>
          <div class="r-entry-sub"><span>${esc(exp.company)}${exp.location ? ', ' + esc(exp.location) : ''}</span><span>${formatDate(exp.startDate)}${(exp.endDate || exp.current) ? '–' + (exp.current ? 'Present' : formatDate(exp.endDate)) : ''}</span></div>
          ${renderBullets(exp.bullets, 'r-bullet')}
        </div>`).join('')}` : ''}
      ${data.education.length ? `
      <div class="r-section-title">Education</div>
      ${data.education.map(edu => `
        <div style="margin-bottom:10px;">
          <div class="r-entry-title">${esc(edu.degree)}${edu.field ? ' in ' + esc(edu.field) : ''}</div>
          <div class="r-entry-sub"><span>${esc(edu.institution)}</span><span>${formatDate(edu.endDate) || ''}</span></div>
          ${edu.honors ? `<div style="font-size:11px;color:#718096">${esc(edu.honors)}</div>` : ''}
        </div>`).join('')}` : ''}
      ${renderSkillsSection(data, 'creative-skills', 'r-skill-tag')}
      ${renderProjects(data, '', 'r-entry-title', 'r-entry-sub', 'r-summary')}
    </div>
  </div>`;
}

export function renderMinimal(data) {
  const p = data.personal;
  return `
  <div class="resume-minimal">
    <div class="r-name">${esc(p.fullName || 'Your Name')}</div>
    <div class="r-title">${esc(p.jobTitle || 'Professional Title')}</div>
    <div class="r-contacts">
      ${[p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
    </div>
    <div class="r-header-divider"></div>

    ${data.summary ? `<div class="r-section-title">Summary</div><div class="r-summary">${esc(data.summary)}</div>` : ''}
    ${data.experience.length ? `
    <div class="r-section-title">Experience</div>
    ${data.experience.map(exp => `
      <div class="r-entry">
        <div class="r-entry-title">${esc(exp.title)}</div>
        <div class="r-entry-sub"><span>${esc(exp.company)}${exp.location ? ', ' + esc(exp.location) : ''}</span><span>${formatDate(exp.startDate)}${(exp.endDate || exp.current) ? '–' + (exp.current ? 'Present' : formatDate(exp.endDate)) : ''}</span></div>
        ${renderBullets(exp.bullets, 'r-bullet')}
      </div>`).join('')}` : ''}
    ${data.education.length ? `
    <div class="r-section-title">Education</div>
    ${data.education.map(edu => `
      <div class="r-entry">
        <div class="r-entry-title">${esc(edu.degree)}${edu.field ? ' in ' + esc(edu.field) : ''}</div>
        <div class="r-entry-sub"><span>${esc(edu.institution)}</span><span>${formatDate(edu.endDate) || ''}</span></div>
      </div>`).join('')}` : ''}
    ${data.skills.technical.length || data.skills.tools.length ? `
    <div class="r-section-title">Skills</div>
    <div class="r-skills-row">
      ${[...data.skills.technical, ...data.skills.tools, ...data.skills.soft].map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('')}
    </div>` : ''}
    ${renderProjects(data, 'r-entry', 'r-entry-title', 'r-entry-sub', 'r-summary')}
  </div>`;
}

export function renderTech(data) {
  const p = data.personal;
  const allSkills = Object.values(data.skills).flat();
  return `
  <div class="resume-tech">
    <div class="r-header">
      <div class="r-name">${esc(p.fullName || 'dev.name')}</div>
      <div class="r-title">// ${esc(p.jobTitle || 'professional_title')}</div>
      <div class="r-contacts">
        ${[p.email, p.phone, p.location, p.linkedin, p.portfolio, p.website].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
      </div>
    </div>

    ${data.summary ? `<div class="r-section-title">// about_me</div><div class="r-summary">${esc(data.summary)}</div>` : ''}

    ${data.experience.length ? `
    <div class="r-section-title">// experience</div>
    ${data.experience.map(exp => `
      <div style="margin-bottom:14px;">
        <div class="r-entry-title">${esc(exp.title)}</div>
        <div class="r-entry-sub"><span>${esc(exp.company)}</span><span>${formatDate(exp.startDate)}${(exp.endDate || exp.current) ? '→' + (exp.current ? 'now' : formatDate(exp.endDate)) : ''}</span></div>
        ${renderBullets(exp.bullets, 'r-bullet')}
      </div>`).join('')}` : ''}

    ${allSkills.length ? `
    <div class="r-section-title">// tech_stack</div>
    <div class="r-skills-grid">
      ${allSkills.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('')}
    </div>` : ''}

    ${data.education.length ? `
    <div class="r-section-title">// education</div>
    ${data.education.map(edu => `
      <div style="margin-bottom:8px;">
        <div class="r-entry-title">${esc(edu.degree)}${edu.field ? ' :: ' + esc(edu.field) : ''}</div>
        <div class="r-entry-sub"><span>${esc(edu.institution)}</span><span>${formatDate(edu.endDate) || ''}</span></div>
      </div>`).join('')}` : ''}

    ${data.projects.length ? `
    <div class="r-section-title">// projects</div>
    ${data.projects.map(proj => `
      <div style="margin-bottom:10px;">
        <div class="r-entry-title">${esc(proj.name)}${proj.link ? ` <a href="${esc(proj.link)}" style="font-size:9px;color:#22d3ee;">[link]</a>` : ''}</div>
        ${proj.tech ? `<div class="r-entry-sub"><span>stack: ${esc(proj.tech)}</span></div>` : ''}
        ${proj.description ? `<div class="r-summary" style="margin-top:4px;">${esc(proj.description)}</div>` : ''}
      </div>`).join('')}` : ''}
  </div>`;
}

// =====================================================
//  DevOps Template — GitHub dark theme, terminal aesthetic
// =====================================================
export function renderDevOps(data) {
  const p = data.personal;
  const allSkills = Object.values(data.skills).flat();
  return `
  <div class="resume-devops">
    <div class="r-prompt">
      <span style="color:#7ee787">●</span> &nbsp;
      <span style="color:#58a6ff">resume</span>
      <span style="color:#8b949e"> / </span>
      <span style="color:#e6edf3">${esc(p.fullName || 'your-name')}</span>
      &nbsp;—&nbsp;
      <span style="color:#7ee787">main</span>
      <span style="color:#8b949e"> ⎇</span>
    </div>
    <div class="r-name">${esc(p.fullName || 'Your Name')}</div>
    <div class="r-title">${esc(p.jobTitle || 'DevOps / Cloud Engineer')}</div>
    <div class="r-contacts">
      ${[p.email, p.phone, p.location, p.linkedin, p.portfolio, p.website].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
    </div>

    ${data.summary ? `<div class="r-section-title">About</div><div class="r-summary">${esc(data.summary)}</div>` : ''}

    ${data.experience.length ? `
    <div class="r-section-title">Experience</div>
    ${data.experience.map(exp => `
      <div class="r-entry">
        <div class="r-entry-title">${esc(exp.title)}</div>
        <div class="r-entry-sub">
          <span>${esc(exp.company)}${exp.location ? ' · ' + esc(exp.location) : ''}</span>
          <span class="r-entry-date">${formatDate(exp.startDate)}${(exp.endDate || exp.current) ? ' → ' + (exp.current ? 'present' : formatDate(exp.endDate)) : ''}</span>
        </div>
        ${renderBullets(exp.bullets, 'r-bullet')}
      </div>`).join('')}` : ''}

    ${allSkills.length ? `
    <div class="r-section-title">Tech Stack</div>
    <div class="r-skills-wrap">
      ${allSkills.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('')}
    </div>` : ''}

    ${data.education.length ? `
    <div class="r-section-title">Education</div>
    ${data.education.map(edu => `
      <div class="r-entry">
        <div class="r-entry-title">${esc(edu.degree)}${edu.field ? ' in ' + esc(edu.field) : ''}</div>
        <div class="r-entry-sub"><span>${esc(edu.institution)}</span><span class="r-entry-date">${formatDate(edu.endDate) || ''}</span></div>
      </div>`).join('')}` : ''}

    ${data.projects.length ? `
    <div class="r-section-title">Projects</div>
    ${data.projects.map(proj => `
      <div class="r-entry">
        <div class="r-entry-title">${esc(proj.name)}${proj.link ? ` <span style="font-size:9.5px;color:#58a6ff">[${esc(proj.link)}]</span>` : ''}</div>
        ${proj.tech ? `<div class="r-entry-sub"><span>stack: ${esc(proj.tech)}</span></div>` : ''}
        ${proj.description ? `<div class="r-summary" style="margin-top:5px;">${esc(proj.description)}</div>` : ''}
      </div>`).join('')}` : ''}

    ${renderAwards(data, 'r-entry', 'r-entry-title', 'r-entry-sub')}
  </div>`;
}

// =====================================================
//  Full-Stack Template — dark header, indigo accent, two-column body
// =====================================================
export function renderFullStack(data) {
  const p = data.personal;
  const topSkills = [...data.skills.technical, ...data.skills.tools].slice(0, 20);
  const softAndLang = [...data.skills.soft, ...data.skills.languages];
  return `
  <div class="resume-fullstack">
    <div class="r-header">
      <div class="r-header-top">
        <div>
          <div class="r-name">${esc(p.fullName || 'Your Name')}</div>
          <div class="r-title">${esc(p.jobTitle || 'Full-Stack Engineer')}</div>
          ${topSkills.length ? `<div class="r-badge-row">${topSkills.slice(0, 6).map(s => `<span class="r-badge">${esc(s)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
      <div class="r-contacts">
        ${[p.email, p.phone, p.location, p.linkedin, p.portfolio, p.website].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}
      </div>
    </div>

    <div class="r-body">
      ${data.summary ? `<div class="r-section-title">Profile</div><div class="r-summary">${esc(data.summary)}</div>` : ''}

      <div class="r-columns">
        <div class="r-col-main">
          ${data.experience.length ? `
          <div class="r-section-title">Experience</div>
          ${data.experience.map(exp => `
            <div class="r-entry">
              <div class="r-entry-title">${esc(exp.title)}</div>
              <div class="r-entry-sub">
                <span>${esc(exp.company)}${exp.location ? ', ' + esc(exp.location) : ''}</span>
                <span>${formatDate(exp.startDate)}${(exp.endDate || exp.current) ? ' – ' + (exp.current ? 'Present' : formatDate(exp.endDate)) : ''}</span>
              </div>
              ${renderBullets(exp.bullets, 'r-bullet')}
            </div>`).join('')}` : ''}

          ${data.projects.length ? `
          <div class="r-section-title">Projects</div>
          ${data.projects.map(proj => `
            <div class="r-entry">
              <div class="r-entry-title">${esc(proj.name)}${proj.link ? ` <span style="font-size:9px;color:#6366f1">${esc(proj.link)}</span>` : ''}</div>
              ${proj.tech ? `<div class="r-entry-sub"><span>${esc(proj.tech)}</span></div>` : ''}
              ${proj.description ? `<div class="r-summary" style="margin-top:3px;">${esc(proj.description)}</div>` : ''}
            </div>`).join('')}` : ''}
        </div>

        <div class="r-col-side">
          ${topSkills.length ? `
          <div class="r-section-title">Tech Skills</div>
          <div>${topSkills.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('')}</div>` : ''}

          ${softAndLang.length ? `
          <div class="r-section-title" style="margin-top:14px;">Soft Skills</div>
          <div>${softAndLang.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('')}</div>` : ''}

          ${data.education.length ? `
          <div class="r-section-title" style="margin-top:14px;">Education</div>
          ${data.education.map(edu => `
            <div style="margin-bottom:10px;">
              <div style="font-size:11.5px;font-weight:700;color:#0f172a;">${esc(edu.degree)}</div>
              ${edu.field ? `<div style="font-size:10px;color:#6366f1;">${esc(edu.field)}</div>` : ''}
              <div style="font-size:10px;color:#64748b;">${esc(edu.institution)}</div>
              <div style="font-size:9.5px;color:#94a3b8;">${formatDate(edu.endDate) || ''}${edu.gpa ? ' · GPA: ' + esc(edu.gpa) : ''}</div>
            </div>`).join('')}` : ''}

          ${data.awards.length ? `
          <div class="r-section-title" style="margin-top:14px;">Certifications</div>
          ${data.awards.map(a => `
            <div style="margin-bottom:8px;">
              <div style="font-size:11px;font-weight:700;color:#0f172a;">${esc(a.title)}</div>
              <div style="font-size:9.5px;color:#64748b;">${esc(a.issuer)}${a.date ? ' · ' + formatDate(a.date) : ''}</div>
            </div>`).join('')}` : ''}
        </div>
      </div>
    </div>
  </div>`;
}

// ===================== Shared Helpers =====================
function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(monthStr) {
  if (!monthStr) return '';
  const [y, m] = monthStr.split('-');
  if (!y || !m) return monthStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m) - 1]} ${y}`;
}

function contactItem(val, icon) {
  if (!val) return '';
  return `<span>${icon} ${esc(val)}</span>`;
}

function renderBullets(bullets, cls) {
  const items = (bullets || []).filter(b => b && b.trim());
  if (!items.length) return '';
  return `<ul class="r-bullets">${items.map(b => `<li class="${cls}">${esc(b)}</li>`).join('')}</ul>`;
}

function renderSkillsSection(data, containerCls, tagCls) {
  const cats = [
    { label: 'Technical', key: 'technical' },
    { label: 'Soft Skills', key: 'soft' },
    { label: 'Languages', key: 'languages' },
    { label: 'Tools', key: 'tools' },
  ].filter(c => data.skills[c.key]?.length);
  if (!cats.length) return '';
  return `
    <div class="r-section">
      <div class="r-section-title">Skills</div>
      <div class="${containerCls}" style="display:flex;flex-wrap:wrap;gap:6px;">
        ${cats.flatMap(c => data.skills[c.key].map(s => `<span class="${tagCls}">${esc(s)}</span>`)).join('')}
      </div>
    </div>`;
}

function renderProjects(data, entryClass, titleClass, subClass, descClass) {
  if (!data.projects.length) return '';
  return `
    <div class="r-section">
      <div class="r-section-title">Projects</div>
      ${data.projects.map(proj => `
        <div class="${entryClass}" style="margin-bottom:10px;">
          <div class="${titleClass}">${esc(proj.name)}${proj.link ? ` — <span style="font-size:10px;color:#4f8ef7">${esc(proj.link)}</span>` : ''}</div>
          ${proj.tech ? `<div class="${subClass}">${esc(proj.tech)}</div>` : ''}
          ${proj.description ? `<div class="${descClass}" style="margin-top:3px;font-size:11px;">${esc(proj.description)}</div>` : ''}
        </div>`).join('')}
    </div>`;
}

function renderAwards(data, entryClass, titleClass, subClass) {
  if (!data.awards.length) return '';
  return `
    <div class="r-section">
      <div class="r-section-title">Awards & Certifications</div>
      ${data.awards.map(a => `
        <div class="${entryClass}" style="margin-bottom:8px;">
          <div class="${titleClass}">${esc(a.title)}</div>
          <div class="${subClass}">${esc(a.issuer)}${a.date ? ' · ' + formatDate(a.date) : ''}</div>
          ${a.description ? `<div style="font-size:11px;color:#718096;margin-top:2px;">${esc(a.description)}</div>` : ''}
        </div>`).join('')}
    </div>`;
}
