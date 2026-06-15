export interface Program {
  id: string;
  uni: string;
  country: string;
  ctry: string;
  prog: string;
  tuition: number;
  work: string;
  greOptional: boolean;
  minBand: number;
  scholar: boolean;
  prestige: number;
  fields: string[];
  phd?: boolean;
}

export interface ScoredProgram extends Program {
  score: number;
  band: 'reach' | 'match' | 'safe' | 'unlock';
  inBudget: boolean;
  stretch: boolean;
  profileGap: number;
}

export interface EvalResult {
  reach: ScoredProgram[];
  match: ScoredProgram[];
  safe: ScoredProgram[];
  unlock: ScoredProgram[];
  flags: { type: string; t: string; d: string }[];
  profile: number;
  phd: boolean;
  budget: number;
}

export interface Answers {
  degree?: string;
  field?: string;
  band?: string;
  test?: string;
  countries?: string[];
  budget?: number;
  [key: string]: string | string[] | number | undefined;
}

export interface Question {
  id: string;
  kind: 'single' | 'multi' | 'slider';
  q: string;
  help?: string;
  opts?: [string, string][];
  min?: number;
  max?: number;
  step?: number;
  def?: number;
}

export const PROGRAMS: Program[] = [
  { id: 'windsor', uni: 'University of Windsor', country: 'Canada', ctry: 'CA', prog: 'MEng · Computer Science', tuition: 20, work: '3-yr post-study work permit', greOptional: true, minBand: 68, scholar: false, prestige: 2, fields: ['cs', 'data', 'eng'] },
  { id: 'concordia', uni: 'Concordia University', country: 'Canada', ctry: 'CA', prog: 'MEng · Computer Science', tuition: 24, work: '3-yr post-study work permit', greOptional: true, minBand: 70, scholar: true, prestige: 3, fields: ['cs', 'data', 'eng'] },
  { id: 'calgary', uni: 'University of Calgary', country: 'Canada', ctry: 'CA', prog: 'MEng · Software Engineering', tuition: 26, work: '3-yr post-study work permit', greOptional: true, minBand: 70, scholar: false, prestige: 3, fields: ['cs', 'data', 'eng'] },
  { id: 'adelaide', uni: 'University of Adelaide', country: 'Australia', ctry: 'AU', prog: 'Master of Computing & Innovation', tuition: 25, work: '4-yr post-study work (PR-friendly)', greOptional: true, minBand: 68, scholar: true, prestige: 3, fields: ['cs', 'data'] },
  { id: 'rmit', uni: 'RMIT University', country: 'Australia', ctry: 'AU', prog: 'Master of IT', tuition: 30, work: '4-yr post-study work (PR-friendly)', greOptional: true, minBand: 70, scholar: false, prestige: 3, fields: ['cs', 'data', 'business'] },
  { id: 'monash', uni: 'Monash University', country: 'Australia', ctry: 'AU', prog: 'Master of IT', tuition: 33, work: '4-yr post-study work (PR-friendly)', greOptional: true, minBand: 74, scholar: false, prestige: 4, fields: ['cs', 'data', 'eng'] },
  { id: 'tcd', uni: 'Trinity College Dublin', country: 'Ireland', ctry: 'IE', prog: 'MSc · Computer Science', tuition: 28, work: '2-yr stay-back visa', greOptional: true, minBand: 74, scholar: false, prestige: 4, fields: ['cs', 'data'] },
  { id: 'asu', uni: 'Arizona State University', country: 'USA', ctry: 'US', prog: 'MS · Computer Science', tuition: 34, work: '3-yr STEM OPT', greOptional: true, minBand: 72, scholar: true, prestige: 4, fields: ['cs', 'data', 'eng'] },
  { id: 'rwth', uni: 'RWTH Aachen', country: 'Germany', ctry: 'DE', prog: 'MSc · Computer Science', tuition: 9, work: '18-month job-seeker visa', greOptional: true, minBand: 78, scholar: true, prestige: 4, fields: ['cs', 'data', 'eng'] },
  { id: 'tum', uni: 'TU Munich', country: 'Germany', ctry: 'DE', prog: 'MSc · Informatics', tuition: 8, work: '18-month job-seeker visa', greOptional: true, minBand: 82, scholar: true, prestige: 5, fields: ['cs', 'data'] },
  { id: 'melb', uni: 'University of Melbourne', country: 'Australia', ctry: 'AU', prog: 'Master of CS', tuition: 44, work: '4-yr post-study work', greOptional: true, minBand: 80, scholar: false, prestige: 5, fields: ['cs', 'data'] },
  { id: 'edin', uni: 'University of Edinburgh', country: 'UK', ctry: 'GB', prog: 'MSc · Computer Science', tuition: 38, work: '2-yr Graduate Route visa', greOptional: true, minBand: 82, scholar: false, prestige: 5, fields: ['cs', 'data', 'eng'] },
  { id: 'neu', uni: 'Northeastern University', country: 'USA', ctry: 'US', prog: 'MS · CS (Align)', tuition: 46, work: '3-yr STEM OPT + co-op', greOptional: true, minBand: 74, scholar: false, prestige: 4, fields: ['cs', 'data'] },
  { id: 'tcd-ph', uni: 'Trinity College Dublin', country: 'Ireland', ctry: 'IE', prog: 'PhD · Computer Science (funded)', tuition: 0, work: '2-yr stay-back visa', greOptional: true, minBand: 80, scholar: true, prestige: 5, phd: true, fields: ['cs', 'data'] },
];

const BAND_MID: Record<string, number> = {
  'lt60': 57, '60-70': 65, '70-75': 72, '75-85': 80, '85plus': 88
};

export const COUNTRY_NAME: Record<string, string> = {
  CA: 'Canada', AU: 'Australia', IE: 'Ireland', US: 'USA', DE: 'Germany', GB: 'UK'
};

export function evaluate(input: { degree: string; field?: string; band?: string; test?: string; countries: string[]; budget: number }): EvalResult {
  const profile = BAND_MID[input.band ?? ''] ?? 72;
  const phd = input.degree === 'phd';
  const wantCountries = input.countries.filter(c => c !== 'open');
  const openToAll = input.countries.includes('open') || wantCountries.length === 0;
  const budget = input.budget;
  const testReady = input.test === 'have' ? 1 : input.test === 'prep' ? 0.5 : 0;

  let pool = PROGRAMS.filter(p => phd ? p.phd : !p.phd);
  if (!phd && input.field) pool = pool.filter(p => p.fields.includes(input.field!) || input.field === 'other');
  if (!openToAll) pool = pool.filter(p => wantCountries.includes(p.ctry));

  let relaxedCountry = false;
  if (pool.length < 3) {
    relaxedCountry = !openToAll;
    pool = (phd ? PROGRAMS.filter(p => p.phd) : PROGRAMS.filter(p => !p.phd))
      .filter(p => !input.field || p.fields.includes(input.field!) || input.field === 'other');
  }

  const scored: ScoredProgram[] = pool.map(p => {
    const profileGap = profile - p.minBand;
    const effGap = profileGap > 0 ? Math.min(profileGap, 8) : profileGap;
    const inBudget = phd ? true : p.tuition <= budget;
    const stretch = !phd && p.tuition > budget && p.tuition <= budget * 1.6;
    let s = 58 + effGap * 1.4 + (inBudget ? 12 : stretch ? 3 : -14) + testReady * 7 - (p.prestige - 3) * 4;
    s = Math.max(32, Math.min(96, Math.round(s)));

    let band: ScoredProgram['band'];
    if (!phd && p.tuition > budget) {
      band = stretch && profileGap >= -4 ? 'unlock' : 'reach';
    } else if (profileGap < -6) {
      band = 'reach';
    } else if (profileGap < 4) {
      band = 'match';
    } else {
      band = p.prestige >= 5 ? 'match' : 'safe';
    }

    return { ...p, score: s, band, inBudget, stretch, profileGap };
  }).sort((a, b) => b.score - a.score);

  const unlock = scored.filter(p => p.band === 'unlock').slice(0, 2);
  const reach = scored.filter(p => p.band === 'reach').slice(0, 3);
  const match = scored.filter(p => p.band === 'match').slice(0, 3);
  const safe = scored.filter(p => p.band === 'safe').slice(0, 3);

  const flags: { type: string; t: string; d: string }[] = [];
  if (!phd) {
    const affordable = scored.filter(p => p.inBudget).length;
    if (budget < 18 && affordable < 3) flags.push({ type: 'warn', t: 'Tight budget.', d: 'We\u2019ve prioritised low-tuition countries and financing below.' });
    if (input.test === 'none') flags.push({ type: 'info', t: 'No test scores yet.', d: 'Book your IELTS / GRE to widen these options.' });
    if (profile < 65) flags.push({ type: 'info', t: 'Below the usual bar for top picks.', d: 'A strong SOP and the right country still count.' });
  } else {
    flags.push({ type: 'info', t: 'PhDs are usually funded.', d: 'Ranked by research fit, not budget.' });
  }
  if (relaxedCountry) flags.push({ type: 'info', t: 'We widened your countries.', d: 'Too few matches in your picks alone.' });

  return { reach, match, safe, unlock, flags, profile, phd, budget };
}

export function whyText(p: ScoredProgram, ctx: { phd: boolean; budget: number }): string {
  if (!ctx.phd && p.inBudget && p.profileGap >= 4) return 'In budget · profile clears the bar';
  if (!ctx.phd && p.inBudget) return 'In budget · profile in range';
  if (p.profileGap >= 4) return 'Profile clears the bar comfortably';
  if (p.profileGap >= -4) return 'In range for recent admits';
  return 'A stretch on grades, but worth a shot';
}

export const QUESTIONS: Question[] = [
  { id: 'degree', kind: 'single', q: 'What are you aiming for?', opts: [['ms', 'Master\u2019s'], ['phd', 'PhD'], ['unsure', 'Not sure yet']] },
  { id: 'field', kind: 'single', q: 'Which field?', opts: [['cs', 'Computer Science'], ['data', 'Data / AI'], ['eng', 'Engineering'], ['business', 'Business'], ['other', 'Something else']] },
  { id: 'band', kind: 'single', q: 'Your academic score?', help: 'An estimate is fine.', opts: [['lt60', 'Below 60%'], ['60-70', '60–70%'], ['70-75', '70–75%'], ['75-85', '75–85%'], ['85plus', '85%+']] },
  { id: 'test', kind: 'single', q: 'IELTS / GRE status?', opts: [['none', 'Not started'], ['prep', 'Preparing'], ['have', 'Have my scores']] },
  { id: 'countries', kind: 'multi', q: 'Where do you want to study?', opts: [['CA', '🇨🇦 Canada'], ['AU', '🇦🇺 Australia'], ['IE', '🇮🇪 Ireland'], ['GB', '🇬🇧 UK'], ['US', '🇺🇸 USA'], ['DE', '🇩🇪 Germany'], ['open', 'Open to suggestions']] },
  { id: 'budget', kind: 'slider', q: 'Your comfortable budget?', help: 'Total tuition + living.', min: 8, max: 60, step: 1, def: 28 },
];

export function getMeta(a: Answers) {
  return {
    fieldName: ({ cs: 'Computer Science', data: 'Data / AI', eng: 'Engineering', business: 'Business', other: 'Your field' } as Record<string, string>)[a.field ?? ''] || 'Your field',
    countryName: (a.countries || []).filter(c => c !== 'open').map(c => COUNTRY_NAME[c]).join(', ') || 'Open',
    gradeName: ({ lt60: '<60%', '60-70': '60–70%', '70-75': '70–75%', '75-85': '75–85%', '85plus': '85%+' } as Record<string, string>)[a.band ?? ''] || '—',
    degreeName: ({ ms: 'Master\u2019s', phd: 'PhD', unsure: 'Exploring' } as Record<string, string>)[a.degree ?? ''] || null,
    testName: ({ none: 'Not started', prep: 'Preparing', have: 'Have scores' } as Record<string, string>)[a.test ?? ''] || null,
  };
}

export function resultFor(a: Answers) {
  return evaluate({
    degree: a.degree === 'phd' ? 'phd' : 'ms',
    field: a.field,
    band: a.band,
    test: a.test,
    countries: a.countries || [],
    budget: a.budget ?? 28,
  });
}

export function answerLabel(q: Question, a: Answers): string {
  const v = a[q.id];
  if (q.kind === 'slider') return '₹' + (v ?? q.def) + 'L total';
  if (q.kind === 'multi') {
    const arr = (v as string[]) || [];
    if (arr.includes('open') || arr.length === 0) return 'Open to suggestions';
    return arr.map(c => COUNTRY_NAME[c] || c).join(', ');
  }
  const f = q.opts?.find(o => o[0] === v);
  return f ? f[1] : '';
}

export function liveCount(a: Answers): number {
  let n = 1500;
  if (a.field) n *= 0.18;
  if (a.degree === 'phd') n *= 0.32;
  const cc = (a.countries || []).filter(c => c !== 'open');
  if (cc.length) n *= Math.min(1, 0.16 + cc.length / 6 * 0.82);
  if (a.band) n *= 0.86;
  if (a.budget != null) n *= 0.36 + Math.min(0.58, (a.budget - 8) / 52 * 0.58);
  if (a.test === 'have') n *= 1.06;
  return Math.max(5, Math.round(n));
}
