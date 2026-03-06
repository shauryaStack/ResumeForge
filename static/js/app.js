//  ResumeForge — Core App State Manager (app.js)
import { initForm, getFormData } from './resume-form.js';
import { renderPreview } from './preview.js';
import { calculateATSScore } from './ats-analyzer.js';
import { generateSuggestions } from './suggestions.js';
import { initTemplates, setTemplate } from './templates.js';
import { initExport } from './export.js';

// ---- Application State ----
export const state = {
  currentStep: 1,
  totalSteps: 6,
  currentTemplate: 'executive',
  previewZoom: 0.75,
  resumeData: {
    personal: {
      fullName: '', jobTitle: '', email: '', phone: '',
      location: '', linkedin: '', portfolio: '', website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      technical: [], soft: [], languages: [], tools: []
    },
    projects: [],
    awards: []
  }
};

const STEP_META = [
  { title: 'Personal Information', desc: "Let's start with the basics" },
  { title: 'Professional Summary', desc: 'Your headline statement' },
  { title: 'Work Experience', desc: 'Where you have worked' },
  { title: 'Education', desc: 'Degrees and certifications' },
  { title: 'Skills', desc: 'Technical and soft skills' },
  { title: 'Projects & Awards', desc: 'Showcase your best work' },
];

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  setupLandingPage();
  initForm(state, onDataChange);
  initTemplates(state);
  initExport(state);
  setupStepNav();
  setupModalButtons();
  setupPreviewZoom();
  loadFromStorage();
});

// ---- Landing Page ----
function setupLandingPage() {
  const landing = document.getElementById('landing-page');
  const app = document.getElementById('app');

  const goToApp = () => {
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    refreshAll();
  };

  document.getElementById('landing-cta').addEventListener('click', goToApp);
  document.getElementById('hero-cta').addEventListener('click', goToApp);
  document.getElementById('start-from-templates').addEventListener('click', goToApp);
  document.getElementById('view-templates-btn').addEventListener('click', () => {
    document.getElementById('templates-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('btn-home').addEventListener('click', () => {
    landing.classList.remove('hidden');
    app.classList.add('hidden');
  });
}

// ---- Step Navigation ----
function setupStepNav() {
  document.querySelectorAll('.step-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step);
      goToStep(step);
    });
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    if (state.currentStep < state.totalSteps) goToStep(state.currentStep + 1);
  });
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (state.currentStep > 1) goToStep(state.currentStep - 1);
  });
  document.getElementById('btn-save').addEventListener('click', saveToStorage);
}

export function goToStep(step) {
  // Hide current, show new
  document.getElementById(`step-${state.currentStep}`).classList.add('hidden');
  state.currentStep = step;
  document.getElementById(`step-${step}`).classList.remove('hidden');

  // Update step nav items
  document.querySelectorAll('.step-nav-item').forEach(item => {
    const n = parseInt(item.dataset.step);
    item.classList.toggle('active', n === step);
    if (n < step) item.classList.add('completed');
  });

  // Update header
  document.getElementById('form-step-title').textContent = STEP_META[step - 1].title;
  document.getElementById('form-step-desc').textContent = STEP_META[step - 1].desc;
  document.getElementById('progress-text').textContent = `Step ${step} of ${state.totalSteps}`;
  document.getElementById('progress-fill').style.width = `${(step / state.totalSteps) * 100}%`;

  // Prev / Next buttons
  document.getElementById('btn-prev').disabled = (step === 1);
  document.getElementById('btn-next').textContent = (step === state.totalSteps) ? '🎉 Finish' : 'Next Step →';
}

// ---- Data Change Callback ----
export function onDataChange() {
  saveToStorageDebounced();
  refreshAll();
}

function refreshAll() {
  const data = getFormData(state);
  renderPreview(data, state.currentTemplate);
  const score = calculateATSScore(data);
  updateATSWidget(score);
  const suggestions = generateSuggestions(data, score);
  updateSuggestions(suggestions);
}

// ---- ATS Widget ----
function updateATSWidget(score) {
  const number = document.getElementById('ats-score-number');
  const fill = document.getElementById('ats-ring-fill');
  const grade = document.getElementById('ats-grade');

  const circumference = 314.16;
  const offset = circumference - (score / 100) * circumference;

  number.textContent = Math.round(score);
  fill.style.strokeDashoffset = offset;

  let color, gradeText;
  if (score >= 80) { color = '#22c55e'; gradeText = '🟢 Excellent — ATS ready!'; }
  else if (score >= 60) { color = '#f59e0b'; gradeText = '🟡 Good — a few improvements'; }
  else if (score >= 40) { color = '#f97316'; gradeText = '🟠 Fair — needs more content'; }
  else { color = '#ef4444'; gradeText = '🔴 Weak — fill in key sections'; }

  fill.style.stroke = color;
  number.style.color = color;
  grade.textContent = gradeText;
}

// ---- Suggestions Panel ----
function updateSuggestions(suggestions) {
  const list = document.getElementById('suggestions-list');
  const count = document.getElementById('suggestion-count');

  if (!suggestions || suggestions.length === 0) {
    list.innerHTML = '<div class="no-suggestions">Great job! Keep adding details to improve your score.</div>';
    count.classList.remove('visible');
    return;
  }

  count.textContent = suggestions.length;
  count.classList.add('visible');
  document.getElementById('suggestion-count').textContent = suggestions.length;

  list.innerHTML = suggestions.map(s => `
    <div class="suggestion-item ${s.type}">
      <span class="suggestion-icon">${s.icon}</span>
      <span>${s.message}</span>
    </div>
  `).join('');
}

// ---- Modal Buttons ----
function setupModalButtons() {
  // Template Modal
  const templateModal = document.getElementById('template-modal');
  document.getElementById('btn-templates').addEventListener('click', () => templateModal.classList.remove('hidden'));
  document.getElementById('close-template-modal').addEventListener('click', () => templateModal.classList.add('hidden'));
  templateModal.addEventListener('click', e => { if (e.target === templateModal) templateModal.classList.add('hidden'); });

  // Export Modal
  const exportModal = document.getElementById('export-modal');
  document.getElementById('btn-export').addEventListener('click', () => exportModal.classList.remove('hidden'));
  document.getElementById('close-export-modal').addEventListener('click', () => exportModal.classList.add('hidden'));
  exportModal.addEventListener('click', e => { if (e.target === exportModal) exportModal.classList.add('hidden'); });
}

// ---- Preview Zoom ----
function setupPreviewZoom() {
  const preview = document.getElementById('resume-preview');
  const zoomLabel = document.getElementById('zoom-level');

  const applyZoom = () => {
    preview.style.transform = `scale(${state.previewZoom})`;
    zoomLabel.textContent = `${Math.round(state.previewZoom * 100)}%`;
  };
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    state.previewZoom = Math.min(state.previewZoom + 0.1, 1.2);
    applyZoom();
  });
  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    state.previewZoom = Math.max(state.previewZoom - 0.1, 0.4);
    applyZoom();
  });
  applyZoom();
}

// ---- LocalStorage Persistence ----
const STORAGE_KEY = 'resumeforge_data';
let saveTimer = null;

function saveToStorageDebounced() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveToStorage, 1000);
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.resumeData));
    showToast('💾 Progress saved', 'success');
  } catch (e) {
    console.error('Save failed', e);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state.resumeData, parsed);
      // Hydrate form fields – handled by resume-form.js on init
    }
  } catch (e) {
    console.error('Load failed', e);
  }
}

// ---- Toast Notifications ----
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
