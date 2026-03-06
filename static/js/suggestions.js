//  ResumeForge — Smart Suggestions Engine (suggestions.js)

import { buildResumeText } from './resume-form.js';

const WEAK_TO_STRONG = {
    'worked on': 'engineered',
    'helped with': 'contributed to',
    'was responsible for': 'led',
    'did': 'executed',
    'made': 'delivered',
    'got': 'secured',
    'tried to': 'successfully',
    'worked with': 'collaborated with',
};

export function generateSuggestions(data, score) {
    const suggestions = [];

    // ---------- Completeness checks ----------
    if (!data.personal.fullName) suggestions.push({ type: 'error', icon: '👤', message: 'Add your full name — it\'s required for ATS parsing.' });
    if (!data.personal.email) suggestions.push({ type: 'error', icon: '📧', message: 'Add your email address to be contacted by recruiters.' });
    if (!data.personal.phone) suggestions.push({ type: 'warning', icon: '📱', message: 'Add your phone number — 78% of recruiters call before emailing.' });
    if (!data.personal.linkedIn && !data.personal.linkedin) suggestions.push({ type: 'warning', icon: '🔗', message: 'Add your LinkedIn URL — it boosts credibility by 23%.' });
    if (!data.personal.jobTitle) suggestions.push({ type: 'error', icon: '💼', message: 'Add a professional title that matches the job posting.' });

    // ---------- Summary checks ----------
    if (!data.summary) {
        suggestions.push({ type: 'error', icon: '📝', message: 'Write a professional summary — it\'s the first thing ATS and recruiters scan.' });
    } else {
        if (data.summary.length < 80) suggestions.push({ type: 'warning', icon: '📝', message: 'Your summary is too short. Aim for 120–300 characters for best ATS results.' });
        if (data.summary.length > 500) suggestions.push({ type: 'warning', icon: '📝', message: 'Your summary exceeds 500 characters. Trim it to keep recruiters engaged.' });
        checkWeakVerbs(data.summary, suggestions);
    }

    // ---------- Experience checks ----------
    if (data.experience.length === 0) {
        suggestions.push({ type: 'error', icon: '🏢', message: 'Add at least one work experience entry — it\'s the most important resume section.' });
    } else {
        data.experience.forEach((exp, i) => {
            const bullets = (exp.bullets || []).filter(b => b.trim());
            if (bullets.length < 2) suggestions.push({ type: 'warning', icon: '📌', message: `"${exp.title || 'Job ' + (i + 1)}": Add at least 2–4 achievement bullets.` });
            if (bullets.length > 8) suggestions.push({ type: 'warning', icon: '📌', message: `"${exp.title || 'Job ' + (i + 1)}": Too many bullets. Limit to 4–6 strong achievements.` });

            const hasQuantified = bullets.some(b => /\d/.test(b));
            if (!hasQuantified && bullets.length > 0) {
                suggestions.push({ type: 'warning', icon: '📊', message: `"${exp.title || 'Job ' + (i + 1)}": Add numbers/metrics. E.g., "Increased sales by 32%", "Managed team of 8".` });
            }

            bullets.forEach(b => checkWeakVerbs(b, suggestions, exp.title));
        });
    }

    // ---------- Education checks ----------
    if (data.education.length === 0) {
        suggestions.push({ type: 'warning', icon: '🎓', message: 'Add your education history. Even older degrees help ATS systems categorize you.' });
    }

    // ---------- Skills checks ----------
    const totalSkills = Object.values(data.skills).flat().length;
    if (totalSkills < 5) suggestions.push({ type: 'error', icon: '🛠️', message: 'Add at least 5 skills. ATS scans skills sections for keyword matching.' });
    if (totalSkills < 10) suggestions.push({ type: 'warning', icon: '🛠️', message: 'Aim for 10–20 skills. Include exact tool names from the job description.' });

    // ---------- Projects / extras ----------
    if (data.projects.length === 0 && data.experience.length < 2) {
        suggestions.push({ type: 'warning', icon: '🚀', message: 'Add personal projects to demonstrate skills outside of work experience.' });
    }

    // ---------- Positive reinforcements ----------
    if (score >= 80) suggestions.push({ type: 'success', icon: '🏆', message: 'Excellent ATS score! Your resume is well-optimized and ready to submit.' });
    else if (score >= 60) suggestions.push({ type: 'success', icon: '✅', message: 'Good score! Address the warnings above to push past 80.' });

    return suggestions.slice(0, 8); // Show max 8 suggestions
}

function checkWeakVerbs(text, suggestions, context = '') {
    const lower = text.toLowerCase();
    for (const [weak, strong] of Object.entries(WEAK_TO_STRONG)) {
        if (lower.includes(weak)) {
            const ctxStr = context ? ` in "${context}"` : '';
            suggestions.push({
                type: 'warning',
                icon: '✏️',
                message: `Weak verb${ctxStr}: Replace "${weak}" with a stronger verb like "${strong}".`
            });
            break; // One suggestion per entry to avoid spam
        }
    }
}
