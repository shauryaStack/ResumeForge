//  ResumeForge — Preview Renderer (preview.js)
import { renderExecutive, renderModern, renderCreative, renderMinimal, renderTech, renderDevOps, renderFullStack } from './templates.js';

const RENDERERS = {
  executive: renderExecutive,
  modern: renderModern,
  creative: renderCreative,
  minimal: renderMinimal,
  tech: renderTech,
  devops: renderDevOps,
  fullstack: renderFullStack,
};

export function renderPreview(data, template = 'executive') {
  const container = document.getElementById('resume-preview');
  if (!container) return;

  const renderer = RENDERERS[template] || renderExecutive;

  // Only show empty state if truly empty
  const hasContent = data.personal.fullName || data.personal.email || data.summary || data.experience.length;
  if (!hasContent) {
    container.innerHTML = `
      <div class="empty-preview">
        <div class="empty-preview-icon">📄</div>
        <p>Start filling in your details to see your resume come to life!</p>
      </div>`;
    return;
  }

  container.innerHTML = renderer(data);
}
