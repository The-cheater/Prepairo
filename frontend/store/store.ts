'use client';

import { INITIAL_PAPERS, INITIAL_REQUESTS, INITIAL_SUGGESTIONS, PaperRecord, PaperRequest, SubjectSuggestion } from '@/backend/models/mock-papers';
import { ALL_SUBJECTS, SubjectItem } from '@/backend/models/subjects-seed';

const PAPERS_STORAGE_KEY = 'pyq_hub_papers_v1';
const REQUESTS_STORAGE_KEY = 'pyq_hub_requests_v1';
const SUGGESTIONS_STORAGE_KEY = 'pyq_hub_suggestions_v1';

export class StoreManager {
  private static instance: StoreManager;
  private papers: PaperRecord[] = [];
  private requests: PaperRequest[] = [];
  private suggestions: SubjectSuggestion[] = [];
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  private init() {
    if (typeof window === 'undefined') {
      this.papers = INITIAL_PAPERS;
      this.requests = INITIAL_REQUESTS;
      this.suggestions = INITIAL_SUGGESTIONS;
      return;
    }

    try {
      const storedPapers = localStorage.getItem(PAPERS_STORAGE_KEY);
      this.papers = storedPapers ? JSON.parse(storedPapers) : INITIAL_PAPERS;

      const storedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);
      this.requests = storedRequests ? JSON.parse(storedRequests) : INITIAL_REQUESTS;

      const storedSuggestions = localStorage.getItem(SUGGESTIONS_STORAGE_KEY);
      this.suggestions = storedSuggestions ? JSON.parse(storedSuggestions) : INITIAL_SUGGESTIONS;
    } catch {
      this.papers = INITIAL_PAPERS;
      this.requests = INITIAL_REQUESTS;
      this.suggestions = INITIAL_SUGGESTIONS;
    }
    this.initialized = true;
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(this.papers));
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(this.requests));
      localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(this.suggestions));
    } catch (e) {
      console.warn('Failed to persist to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Papers
  public getPapers(status?: 'verified' | 'pending' | 'rejected'): PaperRecord[] {
    if (!status) return this.papers;
    return this.papers.filter(p => p.status === status);
  }

  public getPaperById(id: string): PaperRecord | undefined {
    return this.papers.find(p => p.id === id);
  }

  public addPaper(paper: Omit<PaperRecord, 'id' | 'status' | 'uploadedAt' | 'viewCount' | 'downloadCount'>): PaperRecord {
    const newRecord: PaperRecord = {
      ...paper,
      id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0
    };
    this.papers.unshift(newRecord);
    this.persist();
    return newRecord;
  }

  public updatePaperStatus(id: string, status: 'verified' | 'rejected', reason?: string, comment?: string): boolean {
    const paper = this.papers.find(p => p.id === id);
    if (!paper) return false;
    paper.status = status;
    if (status === 'verified') {
      paper.verifiedAt = new Date().toISOString();
      paper.adminComment = comment || reason;
      delete paper.rejectionReason;
    } else {
      paper.rejectionReason = reason || 'Does not match metadata or corrupted document.';
      paper.adminComment = comment || reason || 'Does not match metadata or corrupted document.';
    }
    this.persist();
    return true;
  }

  public getUserPapers(userIdOrName: string): PaperRecord[] {
    return this.papers.filter(p => 
      (p.uploaderId && p.uploaderId === userIdOrName) ||
      (p.uploaderName && p.uploaderName.toLowerCase() === userIdOrName.toLowerCase())
    );
  }

  public updatePaperMetadata(id: string, metadata: Partial<PaperRecord>): boolean {
    const idx = this.papers.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.papers[idx] = { ...this.papers[idx], ...metadata };
    this.persist();
    return true;
  }

  public checkDuplicates(subjectName: string, examYear: number, examType: string, semester: number): PaperRecord[] {
    return this.papers.filter(p => 
      p.subjectName.toLowerCase() === subjectName.toLowerCase() &&
      p.examYear === examYear &&
      p.examType.toLowerCase() === examType.toLowerCase() &&
      p.semester === semester
    );
  }

  // Requests
  public getRequests(status?: 'open' | 'fulfilled'): PaperRequest[] {
    if (!status) return this.requests;
    return this.requests.filter(r => r.status === status);
  }

  public addRequest(req: Omit<PaperRequest, 'id' | 'status' | 'createdAt'>): PaperRequest {
    const newReq: PaperRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    this.requests.unshift(newReq);
    this.persist();
    return newReq;
  }

  public fulfillRequest(id: string): boolean {
    const req = this.requests.find(r => r.id === id);
    if (!req) return false;
    req.status = 'fulfilled';
    this.persist();
    return true;
  }

  // Subject Suggestions ("Can't find my subject")
  public getSuggestions(status?: 'pending' | 'approved' | 'mapped' | 'rejected'): SubjectSuggestion[] {
    if (!status) return this.suggestions;
    return this.suggestions.filter(s => s.status === status);
  }

  public addSuggestion(sug: Omit<SubjectSuggestion, 'id' | 'status' | 'createdAt'>): SubjectSuggestion {
    const newSug: SubjectSuggestion = {
      ...sug,
      id: `sug-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.suggestions.unshift(newSug);
    this.persist();
    return newSug;
  }

  public updateSuggestionStatus(id: string, status: 'approved' | 'mapped' | 'rejected', notes?: string): boolean {
    const sug = this.suggestions.find(s => s.id === id);
    if (!sug) return false;
    sug.status = status;
    if (notes) sug.adminNotes = notes;
    this.persist();
    return true;
  }

  // Stats
  public getStats() {
    const verified = this.papers.filter(p => p.status === 'verified').length;
    const subjects = ALL_SUBJECTS.length;
    const contributors = new Set(this.papers.map(p => p.uploaderName)).size;
    const requestsFulfilled = this.requests.filter(r => r.status === 'fulfilled').length;
    return {
      verifiedPapers: verified,
      totalSubjects: subjects,
      contributorsCount: contributors,
      requestsFulfilled
    };
  }
}

export const store = StoreManager.getInstance();
