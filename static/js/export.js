// =====================================================
//  ResumeForge — Export Module (export.js)
// =====================================================
import { showToast } from './app.js';
import { renderExecutive, renderModern, renderCreative, renderMinimal, renderTech, renderDevOps, renderFullStack } from './templates.js';
import { buildResumeText } from './resume-form.js';

const RENDERERS = {
    executive: renderExecutive,
    modern: renderModern,
    creative: renderCreative,
    minimal: renderMinimal,
    tech: renderTech,
    devops: renderDevOps,
    fullstack: renderFullStack,
};

export function initExport(state) {
    document.getElementById('export-pdf').addEventListener('click', () => exportPDF(state));
    document.getElementById('export-html').addEventListener('click', () => exportHTML(state));
    document.getElementById('export-text').addEventListener('click', () => exportText(state));
}

// =====================================================
//  SHARED INLINE CSS — embedded in every PDF/HTML export
//  so styles work regardless of where the file is opened
// =====================================================
function getFullInlineCSS(template) {
    const baseCSS = `
    *{box-sizing:border-box;margin:0;padding:0;}
    body{margin:0;background:white;font-family:'Inter',system-ui,sans-serif;}
    ul{list-style:none;}
    a{color:inherit;text-decoration:none;}

    /* ---- EXECUTIVE ---- */
    .resume-executive{font-family:'Georgia',Georgia,serif;color:#2d3748;padding:48px 56px;background:white;}
    .resume-executive .r-header{text-align:center;padding-bottom:18px;margin-bottom:18px;border-bottom:2.5px solid #2d3748;}
    .resume-executive .r-name{font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
    .resume-executive .r-title{font-size:12.5px;color:#718096;margin-top:5px;letter-spacing:.12em;text-transform:uppercase;}
    .resume-executive .r-contacts{display:flex;justify-content:center;gap:18px;margin-top:10px;font-size:11px;color:#4a5568;flex-wrap:wrap;}
    .resume-executive .r-section{margin-top:20px;}
    .resume-executive .r-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#2d3748;border-bottom:1px solid #cbd5e0;padding-bottom:4px;margin-bottom:12px;}
    .resume-executive .r-summary{font-size:12px;line-height:1.75;color:#4a5568;}
    .resume-executive .r-entry{margin-bottom:14px;}
    .resume-executive .r-entry-header{display:flex;justify-content:space-between;align-items:baseline;}
    .resume-executive .r-entry-title{font-size:13px;font-weight:700;}
    .resume-executive .r-entry-date{font-size:11px;color:#718096;white-space:nowrap;margin-left:10px;}
    .resume-executive .r-entry-sub{font-size:12px;color:#4a5568;font-style:italic;margin-top:1px;}
    .resume-executive .r-bullets{padding-left:16px;margin-top:6px;}
    .resume-executive .r-bullet{list-style:disc;font-size:11.5px;line-height:1.65;color:#4a5568;margin-bottom:3px;}
    .resume-executive .r-skills-list{display:flex;flex-wrap:wrap;gap:6px;}
    .resume-executive .r-skill-tag{background:#f7fafc;border:1px solid #e2e8f0;padding:3px 10px;border-radius:3px;font-size:11px;color:#4a5568;}

    /* ---- MODERN ---- */
    .resume-modern{font-family:'Inter',system-ui,sans-serif;display:flex;color:#2d3748;min-height:1123px;background:white;}
    .resume-modern .r-sidebar{width:220px;min-width:220px;background:#2d3748;color:#f7fafc;padding:36px 22px;}
    .resume-modern .r-name{font-size:17px;font-weight:800;color:white;margin-bottom:4px;line-height:1.2;}
    .resume-modern .r-title{font-size:9.5px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:20px;}
    .resume-modern .r-sidebar-section{margin-top:20px;}
    .resume-modern .r-sidebar-section-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:rgba(255,255,255,.4);margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:4px;}
    .resume-modern .r-contact-item{font-size:10px;color:rgba(255,255,255,.7);margin-bottom:6px;word-break:break-all;}
    .resume-modern .r-skill-tag{background:rgba(79,142,247,.18);border:1px solid rgba(79,142,247,.35);color:#93bbfc;padding:2px 8px;border-radius:3px;font-size:9.5px;display:inline-block;margin:2px 2px 2px 0;}
    .resume-modern .r-main{flex:1;padding:36px 30px;}
    .resume-modern .r-section-title{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#4f8ef7;border-bottom:2px solid #4f8ef7;padding-bottom:3px;margin:18px 0 10px;}
    .resume-modern .r-summary{font-size:11.5px;color:#4a5568;line-height:1.75;}
    .resume-modern .r-entry-title{font-size:12.5px;font-weight:700;color:#2d3748;}
    .resume-modern .r-entry-sub{font-size:11px;color:#718096;display:flex;justify-content:space-between;margin-top:1px;}
    .resume-modern .r-bullets{padding-left:14px;margin-top:5px;}
    .resume-modern .r-bullet{list-style:disc;font-size:11px;line-height:1.65;color:#4a5568;margin-bottom:2px;}

    /* ---- CREATIVE ---- */
    .resume-creative{font-family:'Inter',system-ui,sans-serif;color:#1a202c;background:white;}
    .resume-creative .r-header{background:linear-gradient(135deg,#7c5cbf 0%,#4f8ef7 100%);padding:36px 48px;color:white;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .resume-creative .r-name{font-size:30px;font-weight:900;letter-spacing:-.01em;}
    .resume-creative .r-title{font-size:13px;opacity:.85;margin-top:5px;}
    .resume-creative .r-contacts{display:flex;gap:16px;margin-top:12px;font-size:11px;opacity:.8;flex-wrap:wrap;}
    .resume-creative .r-body{padding:36px 48px;}
    .resume-creative .r-section-title{font-size:15px;font-weight:800;color:#7c5cbf;margin:20px 0 10px;}
    .resume-creative .r-summary{font-size:12px;color:#4a5568;line-height:1.75;}
    .resume-creative .r-entry-title{font-size:13px;font-weight:700;}
    .resume-creative .r-entry-sub{font-size:11.5px;color:#718096;display:flex;justify-content:space-between;}
    .resume-creative .r-bullets{padding-left:16px;margin-top:6px;}
    .resume-creative .r-bullet{list-style:"→  ";font-size:11.5px;line-height:1.65;color:#4a5568;margin-bottom:3px;}
    .resume-creative .r-skill-tag{background:rgba(124,92,191,.1);border:1px solid rgba(124,92,191,.3);color:#7c5cbf;padding:3px 10px;border-radius:4px;font-size:11px;display:inline-block;margin:2px;font-weight:600;}

    /* ---- MINIMAL ---- */
    .resume-minimal{font-family:'Inter',system-ui,sans-serif;color:#1a202c;padding:52px 60px;background:white;}
    .resume-minimal .r-name{font-size:24px;font-weight:700;letter-spacing:-.01em;}
    .resume-minimal .r-title{font-size:12px;color:#718096;margin-top:3px;}
    .resume-minimal .r-contacts{display:flex;gap:16px;margin-top:8px;font-size:11px;color:#718096;flex-wrap:wrap;}
    .resume-minimal .r-header-divider{height:1px;background:#e2e8f0;margin:16px 0 20px;}
    .resume-minimal .r-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:#a0aec0;margin:22px 0 8px;}
    .resume-minimal .r-summary{font-size:11.5px;color:#4a5568;line-height:1.75;}
    .resume-minimal .r-entry{padding:8px 0;border-bottom:1px solid #f0f4f8;}
    .resume-minimal .r-entry-title{font-size:12.5px;font-weight:700;}
    .resume-minimal .r-entry-sub{font-size:11px;color:#718096;display:flex;justify-content:space-between;margin-top:2px;}
    .resume-minimal .r-bullets{padding-left:14px;margin-top:5px;}
    .resume-minimal .r-bullet{list-style:disc;font-size:11px;line-height:1.65;color:#4a5568;margin-bottom:2px;}
    .resume-minimal .r-skills-row{display:flex;flex-wrap:wrap;gap:4px;}
    .resume-minimal .r-skill-tag{font-size:11px;color:#4a5568;}
    .resume-minimal .r-skill-tag::after{content:" · ";color:#cbd5e0;}
    .resume-minimal .r-skill-tag:last-child::after{content:"";}

    /* ---- TECH ---- */
    .resume-tech{font-family:'Courier New',monospace;color:#e2e8f0;background:#1a202c;padding:36px 44px;min-height:1123px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .resume-tech .r-header{border-bottom:1px solid #2d3748;padding-bottom:16px;margin-bottom:20px;}
    .resume-tech .r-name{font-size:22px;font-weight:700;color:#22d3ee;}
    .resume-tech .r-title{font-size:12px;color:#a0aec0;margin-top:3px;}
    .resume-tech .r-contacts{display:flex;gap:12px;margin-top:8px;font-size:10px;color:#718096;flex-wrap:wrap;}
    .resume-tech .r-section-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#22d3ee;margin:18px 0 8px;padding-left:8px;border-left:3px solid #22d3ee;}
    .resume-tech .r-summary{font-size:11px;color:#a0aec0;line-height:1.75;}
    .resume-tech .r-entry-title{font-size:12px;font-weight:700;color:#f7fafc;}
    .resume-tech .r-entry-sub{font-size:10.5px;color:#718096;display:flex;justify-content:space-between;}
    .resume-tech .r-bullets{padding-left:14px;margin-top:5px;}
    .resume-tech .r-bullet{list-style:"▹ ";font-size:10.5px;line-height:1.65;color:#a0aec0;margin-bottom:3px;}
    .resume-tech .r-skills-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;}
    .resume-tech .r-skill-tag{background:#2d3748;border:1px solid #4a5568;color:#a0aec0;padding:4px 6px;font-size:9.5px;border-radius:3px;text-align:center;}

    /* ---- DEVOPS ---- */
    .resume-devops{font-family:'Courier New',monospace;color:#d4d4d4;background:#0d1117;padding:36px 44px;min-height:1123px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .resume-devops .r-prompt{color:#4ec9b0;font-size:11px;margin-bottom:20px;border-bottom:1px solid #21262d;padding-bottom:12px;}
    .resume-devops .r-name{font-size:24px;font-weight:700;color:#e6edf3;}
    .resume-devops .r-title{font-size:11.5px;color:#7ee787;margin-top:3px;}
    .resume-devops .r-contacts{display:flex;gap:14px;margin-top:8px;font-size:10px;color:#8b949e;flex-wrap:wrap;}
    .resume-devops .r-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#58a6ff;margin:20px 0 10px;display:flex;align-items:center;gap:8px;}
    .resume-devops .r-section-title::before{content:"##";color:#4ec9b0;font-size:13px;}
    .resume-devops .r-summary{font-size:11px;color:#8b949e;line-height:1.75;}
    .resume-devops .r-entry{margin-bottom:14px;padding:10px 12px;background:#161b22;border:1px solid #21262d;border-radius:4px;}
    .resume-devops .r-entry-title{font-size:12.5px;font-weight:700;color:#e6edf3;}
    .resume-devops .r-entry-sub{font-size:10.5px;color:#8b949e;display:flex;justify-content:space-between;margin-top:2px;}
    .resume-devops .r-entry-date{color:#7ee787;font-size:10px;}
    .resume-devops .r-bullets{padding-left:16px;margin-top:7px;}
    .resume-devops .r-bullet{list-style:"$ ";font-size:10.5px;line-height:1.65;color:#c9d1d9;margin-bottom:3px;}
    .resume-devops .r-skills-wrap{display:flex;flex-wrap:wrap;gap:5px;}
    .resume-devops .r-skill-tag{background:#21262d;border:1px solid #30363d;color:#7ee787;padding:3px 10px;border-radius:12px;font-size:10px;}

    /* ---- FULLSTACK ---- */
    .resume-fullstack{font-family:'Inter',system-ui,sans-serif;color:#1e293b;background:white;padding:0;}
    .resume-fullstack .r-header{background:#0f172a;padding:32px 48px;color:white;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .resume-fullstack .r-header-top{display:flex;justify-content:space-between;align-items:flex-start;}
    .resume-fullstack .r-name{font-size:26px;font-weight:800;letter-spacing:-.02em;}
    .resume-fullstack .r-title{font-size:12px;color:#94a3b8;margin-top:4px;}
    .resume-fullstack .r-badge-row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;}
    .resume-fullstack .r-badge{background:rgba(99,102,241,.3);border:1px solid rgba(99,102,241,.5);color:#c7d2fe;padding:3px 10px;border-radius:99px;font-size:9.5px;font-weight:600;}
    .resume-fullstack .r-contacts{display:flex;gap:14px;font-size:10px;color:#64748b;margin-top:12px;flex-wrap:wrap;}
    .resume-fullstack .r-body{padding:32px 48px;}
    .resume-fullstack .r-columns{display:flex;gap:32px;}
    .resume-fullstack .r-col-main{flex:1;}
    .resume-fullstack .r-col-side{width:200px;flex-shrink:0;}
    .resume-fullstack .r-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#6366f1;border-bottom:2px solid #e0e7ff;padding-bottom:4px;margin:18px 0 10px;}
    .resume-fullstack .r-summary{font-size:11.5px;color:#475569;line-height:1.75;}
    .resume-fullstack .r-entry{margin-bottom:14px;}
    .resume-fullstack .r-entry-title{font-size:12.5px;font-weight:700;color:#0f172a;}
    .resume-fullstack .r-entry-sub{font-size:10.5px;color:#64748b;display:flex;justify-content:space-between;margin-top:2px;}
    .resume-fullstack .r-bullets{padding-left:14px;margin-top:5px;}
    .resume-fullstack .r-bullet{list-style:disc;font-size:11px;line-height:1.65;color:#475569;margin-bottom:2px;}
    .resume-fullstack .r-skill-group-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin:10px 0 5px;}
    .resume-fullstack .r-skill-tag{background:#f1f5f9;border:1px solid #e2e8f0;color:#334155;padding:3px 8px;border-radius:4px;font-size:9.5px;display:inline-block;margin:2px;}
  `;
    return baseCSS;
}

// =====================================================
//  PDF EXPORT — fully self-contained with inline CSS
// =====================================================
function exportPDF(state) {
    const resumeHtml = getResumeHTML(state);
    const name = state.resumeData.personal.fullName || 'Resume';

    const printDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${escTxt(name)} — Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    ${getFullInlineCSS(state.currentTemplate)}
    @page { margin: 10mm; size: A4; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .resume-devops, .resume-tech { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    html, body { margin: 0; padding: 0; background: white; }
  </style>
</head>
<body>${resumeHtml}</body>
</html>`;

    const blob = new Blob([printDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');

    if (win) {
        win.onload = () => {
            // Wait for Google Fonts to load before printing
            setTimeout(() => {
                win.focus();
                win.print();
                // Revoke only after print dialog closes
                win.onafterprint = () => URL.revokeObjectURL(url);
            }, 1200);
        };
    } else {
        showToast('❌ Pop-up blocked! Allow pop-ups to export PDF.', 'error');
        URL.revokeObjectURL(url);
    }

    document.getElementById('export-modal').classList.add('hidden');
    showToast('🖨️ Opening print dialog — choose "Save as PDF"', 'success');
}

// =====================================================
//  HTML EXPORT — self-contained downloadable file
// =====================================================
function exportHTML(state) {
    const name = state.resumeData.personal.fullName || 'Resume';
    const resumeHtml = getResumeHTML(state);

    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escTxt(name)} — Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    ${getFullInlineCSS(state.currentTemplate)}
    body { padding: 40px 20px; background: #f1f5f9; display: flex; justify-content: center; }
    .resume-wrapper { max-width: 794px; width: 100%; box-shadow: 0 4px 40px rgba(0,0,0,0.15); }
  </style>
</head>
<body>
  <div class="resume-wrapper">${resumeHtml}</div>
</body>
</html>`;

    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('export-modal').classList.add('hidden');
    showToast('📥 Resume downloaded as HTML', 'success');
}

// =====================================================
//  PLAIN TEXT EXPORT — clipboard copy
// =====================================================
function exportText(state) {
    const data = state.resumeData;
    const p = data.personal;
    let text = '';

    text += `${p.fullName || ''}\n${p.jobTitle || ''}\n`;
    text += [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(' | ') + '\n\n';

    if (data.summary) text += `PROFESSIONAL SUMMARY\n${'-'.repeat(40)}\n${data.summary}\n\n`;

    if (data.experience.length) {
        text += `WORK EXPERIENCE\n${'-'.repeat(40)}\n`;
        data.experience.forEach(exp => {
            const dates = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ');
            text += `${exp.title} | ${exp.company}${exp.location ? ', ' + exp.location : ''}${dates ? ' | ' + dates : ''}\n`;
            (exp.bullets || []).filter(Boolean).forEach(b => { text += `• ${b}\n`; });
            text += '\n';
        });
    }

    if (data.education.length) {
        text += `EDUCATION\n${'-'.repeat(40)}\n`;
        data.education.forEach(edu => {
            text += `${edu.degree}${edu.field ? ' in ' + edu.field : ''} | ${edu.institution}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}\n`;
            if (edu.honors) text += `${edu.honors}\n`;
            text += '\n';
        });
    }

    const allSkills = Object.values(data.skills).flat();
    if (allSkills.length) text += `SKILLS\n${'-'.repeat(40)}\n${allSkills.join(' · ')}\n\n`;

    if (data.projects.length) {
        text += `PROJECTS\n${'-'.repeat(40)}\n`;
        data.projects.forEach(proj => {
            text += `${proj.name}${proj.tech ? ' | ' + proj.tech : ''}${proj.link ? ' | ' + proj.link : ''}\n`;
            if (proj.description) text += `${proj.description}\n`;
            text += '\n';
        });
    }

    if (data.awards.length) {
        text += `AWARDS & CERTIFICATIONS\n${'-'.repeat(40)}\n`;
        data.awards.forEach(a => { text += `${a.title}${a.issuer ? ' | ' + a.issuer : ''}${a.date ? ' | ' + a.date : ''}\n`; });
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Plain text copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Copy failed — please allow clipboard access', 'error');
    });

    document.getElementById('export-modal').classList.add('hidden');
}

// ---- Helpers ----
function getResumeHTML(state) {
    const renderer = RENDERERS[state.currentTemplate] || RENDERERS.executive;
    return renderer(state.resumeData);
}

function escTxt(str) { return (str || '').replace(/[<>"&]/g, ''); }
