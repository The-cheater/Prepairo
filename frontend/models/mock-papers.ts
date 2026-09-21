export interface PaperRecord {
  id: string;
  subjectName: string;
  courseCode?: string;
  schoolId: string;
  program: string;
  academicYear: number;
  semester: number;
  examYear: number;
  examType: 'mid-sem' | 'end-sem';
  batch?: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  status: 'verified' | 'pending' | 'rejected';
  uploaderName: string;
  uploaderId?: string;
  isAnonymous: boolean;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  adminComment?: string;
  viewCount: number;
  downloadCount: number;
}

export interface PaperRequest {
  id: string;
  subjectName: string;
  courseCode?: string;
  academicYear: number;
  semester: number;
  examYear: number;
  examType: 'mid-sem' | 'end-sem';
  notes?: string;
  requesterName: string;
  status: 'open' | 'fulfilled';
  createdAt: string;
}

export interface SubjectSuggestion {
  id: string;
  suggestedName: string;
  courseCode?: string;
  schoolName: string;
  semester: number;
  studentName: string;
  status: 'pending' | 'approved' | 'mapped' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

// Clean initial states — no dummy data
export const INITIAL_PAPERS: PaperRecord[] = [];
export const INITIAL_REQUESTS: PaperRequest[] = [];
export const INITIAL_SUGGESTIONS: SubjectSuggestion[] = [];
