import fs from 'fs';
import path from 'path';
import { PaperRecord, PaperRequest, SubjectSuggestion, INITIAL_PAPERS, INITIAL_REQUESTS, INITIAL_SUGGESTIONS } from '@/backend/models/mock-papers';

const DATA_DIR = path.join(process.cwd(), 'data');
const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'suggestions.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PAPERS_FILE)) {
    fs.writeFileSync(PAPERS_FILE, JSON.stringify(INITIAL_PAPERS, null, 2), 'utf-8');
  }

  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(INITIAL_REQUESTS, null, 2), 'utf-8');
  }

  if (!fs.existsSync(SUGGESTIONS_FILE)) {
    fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(INITIAL_SUGGESTIONS, null, 2), 'utf-8');
  }
}

let papersCache: PaperRecord[] | null = null;
let lastPapersMtime = 0;

export function getAllPapers(): PaperRecord[] {
  ensureDataFiles();
  try {
    const stats = fs.statSync(PAPERS_FILE);
    if (papersCache && stats.mtimeMs === lastPapersMtime) {
      return papersCache;
    }
    const content = fs.readFileSync(PAPERS_FILE, 'utf-8');
    papersCache = JSON.parse(content);
    lastPapersMtime = stats.mtimeMs;
    return papersCache || [];
  } catch {
    return papersCache || INITIAL_PAPERS;
  }
}

export function savePaper(paper: PaperRecord): PaperRecord {
  ensureDataFiles();
  const papers = getAllPapers().slice();
  // If duplicate ID exists, replace, else prepend
  const idx = papers.findIndex(p => p.id === paper.id);
  if (idx !== -1) {
    papers[idx] = paper;
  } else {
    papers.unshift(paper);
  }
  fs.writeFileSync(PAPERS_FILE, JSON.stringify(papers, null, 2), 'utf-8');
  papersCache = papers;
  try {
    lastPapersMtime = fs.statSync(PAPERS_FILE).mtimeMs;
  } catch {}
  return paper;
}

export function updatePaper(id: string, updates: Partial<PaperRecord>): PaperRecord | null {
  ensureDataFiles();
  const papers = getAllPapers().slice();
  const idx = papers.findIndex(p => p.id === id);
  if (idx === -1) return null;
  papers[idx] = { ...papers[idx], ...updates };
  fs.writeFileSync(PAPERS_FILE, JSON.stringify(papers, null, 2), 'utf-8');
  papersCache = papers;
  try {
    lastPapersMtime = fs.statSync(PAPERS_FILE).mtimeMs;
  } catch {}
  return papers[idx];
}

export function deletePaper(id: string): boolean {
  ensureDataFiles();
  const papers = getAllPapers().slice();
  const idx = papers.findIndex(p => p.id === id);
  if (idx === -1) return false;
  papers.splice(idx, 1);
  fs.writeFileSync(PAPERS_FILE, JSON.stringify(papers, null, 2), 'utf-8');
  papersCache = papers;
  try {
    lastPapersMtime = fs.statSync(PAPERS_FILE).mtimeMs;
  } catch {}
  return true;
}

export function getAllRequests(): PaperRequest[] {
  ensureDataFiles();
  try {
    const content = fs.readFileSync(REQUESTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequest(request: PaperRequest): PaperRequest {
  ensureDataFiles();
  const requests = getAllRequests();
  const idx = requests.findIndex(r => r.id === request.id);
  if (idx !== -1) {
    requests[idx] = request;
  } else {
    requests.unshift(request);
  }
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf-8');
  return request;
}

export function updateRequest(id: string, updates: Partial<PaperRequest>): PaperRequest | null {
  ensureDataFiles();
  const requests = getAllRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx === -1) return null;
  requests[idx] = { ...requests[idx], ...updates };
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf-8');
  return requests[idx];
}

export function getAllSuggestions(): SubjectSuggestion[] {
  ensureDataFiles();
  try {
    const content = fs.readFileSync(SUGGESTIONS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return INITIAL_SUGGESTIONS;
  }
}

export function saveSuggestion(suggestion: SubjectSuggestion): SubjectSuggestion {
  ensureDataFiles();
  const suggestions = getAllSuggestions();
  const idx = suggestions.findIndex(s => s.id === suggestion.id);
  if (idx !== -1) {
    suggestions[idx] = suggestion;
  } else {
    suggestions.unshift(suggestion);
  }
  fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2), 'utf-8');
  return suggestion;
}

export function updateSuggestion(id: string, updates: Partial<SubjectSuggestion>): SubjectSuggestion | null {
  ensureDataFiles();
  const suggestions = getAllSuggestions();
  const idx = suggestions.findIndex(s => s.id === id);
  if (idx === -1) return null;
  suggestions[idx] = { ...suggestions[idx], ...updates };
  fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2), 'utf-8');
  return suggestions[idx];
}
