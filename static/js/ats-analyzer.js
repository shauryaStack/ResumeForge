//  ResumeForge — ATS Score Analyzer (ats-analyzer.js)
import { buildResumeText } from './resume-form.js';

const STRONG_ACTION_VERBS = ['achieved', 'accelerated', 'accomplished', 'administered', 'analyzed', 'architected', 'automated', 'built', 'championed', 'coached', 'collaborated', 'created', 'delivered', 'designed', 'developed', 'directed', 'drove', 'engineered', 'established', 'executed', 'expanded', 'generated', 'grew', 'implemented', 'improved', 'increased', 'innovated', 'launched', 'led', 'managed', 'mentored', 'optimized', 'orchestrated', 'oversaw', 'produced', 'reduced', 'resolved', 'scaled', 'shipped', 'spearheaded', 'streamlined', 'supervised', 'transformed', 'unified'];

const WEAK_VERBS = ['did', 'made', 'worked', 'helped', 'was', 'got', 'went', 'tried', 'used', 'had', 'handled'];

const QUANTIFICATION_PATTERNS = [/\d+%/, /\$[\d,]+/, /\d+x/, /\d+k\b/i, /\d+\s*(million|billion|thousand)/i, /team of \d+/i, /\d+\s*(users|customers|clients|employees)/i];

export function calculateATSScore(data) {
    let score = 0;
    const weights = {
        completeness: 35,
        keywords: 20,
        format: 20,
        achievements: 15,
        length: 10,
    };

    score += calcCompleteness(data) * weights.completeness;
    score += calcKeywords(data) * weights.keywords;
    score += calcFormat(data) * weights.format;
    score += calcAchievements(data) * weights.achievements;
    score += calcLength(data) * weights.length;

    return Math.min(100, Math.round(score));
}

// ---- Completeness (0–1) ----
function calcCompleteness(data) {
    const checks = [
        !!data.personal.fullName,
        !!data.personal.jobTitle,
        !!data.personal.email,
        !!data.personal.phone,
        !!data.personal.location,
        !!data.summary && data.summary.length > 50,
        data.experience.length > 0,
        data.education.length > 0,
        getTotalSkills(data) >= 5,
        !!data.personal.linkedin,
    ];
    return checks.filter(Boolean).length / checks.length;
}

// ---- Keyword richness (0–1) ----
function calcKeywords(data) {
    const text = buildResumeText(data).toLowerCase();
    const actionVerbsFound = STRONG_ACTION_VERBS.filter(v => text.includes(v));
    const weakVerbsFound = WEAK_VERBS.filter(v => new RegExp(`\\b${v}\\b`).test(text));
    const verbScore = Math.min(1, actionVerbsFound.length / 8);
    const penalty = Math.max(0, 1 - weakVerbsFound.length * 0.1);
    return verbScore * penalty;
}

// ---- Format score (0–1) ----
function calcFormat(data) {
    let pts = 0;
    if (data.personal.email && data.personal.email.includes('@')) pts += 0.2;
    if (data.personal.phone) pts += 0.1;
    if (data.personal.linkedin) pts += 0.15;
    if (data.personal.portfolio) pts += 0.1;
    if (data.summary && data.summary.length >= 80 && data.summary.length <= 600) pts += 0.25;
    if (data.experience.every(e => e.bullets && e.bullets.filter(b => b.trim()).length >= 2)) pts += 0.2;
    return Math.min(1, pts);
}

// ---- Quantified achievements (0–1) ----
function calcAchievements(data) {
    const allBullets = data.experience.flatMap(e => e.bullets || []).filter(Boolean);
    if (!allBullets.length) return 0;
    const quantified = allBullets.filter(b => QUANTIFICATION_PATTERNS.some(rx => rx.test(b)));
    return Math.min(1, quantified.length / Math.max(allBullets.length * 0.5, 1));
}

// ---- Length / depth (0–1) ----
function calcLength(data) {
    const text = buildResumeText(data);
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 50) return 0.1;
    if (words < 150) return 0.4;
    if (words < 300) return 0.7;
    if (words < 600) return 1.0;
    return 0.85; // Too long is slightly penalized
}

// ---- Helpers ----
function getTotalSkills(data) {
    return Object.values(data.skills).flat().length;
}

export function getATSBreakdown(data) {
    return {
        completeness: Math.round(calcCompleteness(data) * 100),
        keywords: Math.round(calcKeywords(data) * 100),
        format: Math.round(calcFormat(data) * 100),
        achievements: Math.round(calcAchievements(data) * 100),
        length: Math.round(calcLength(data) * 100),
    };
}
