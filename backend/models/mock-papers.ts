export interface PaperRecord {
  id: string;
  subjectName: string;
  courseCode?: string;
  schoolId: string;
  program: string;
  academicYear: number;
  semester: number;
  examYear: number;
  examType: 'mid-sem' | 'end-sem' | 'quiz' | 'supplementary';
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
  examType: 'mid-sem' | 'end-sem' | 'quiz' | 'supplementary';
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

export const INITIAL_PAPERS: PaperRecord[] = [
  {
    id: 'paper-1',
    subjectName: 'Principles of Life I',
    courseCode: 'BIO111',
    schoolId: 'foundation',
    program: 'BS-MS',
    academicYear: 1,
    semester: 1,
    examYear: 2024,
    examType: 'end-sem',
    batch: 'Batch 24',
    fileUrl: '/sample-papers/BIO111_EndSem_2024.pdf',
    fileName: 'BIO111_EndSem_2024.pdf',
    fileSizeBytes: 2450000,
    status: 'verified',
    uploaderName: 'Aravind S.',
    isAnonymous: false,
    uploadedAt: '2024-12-15T10:30:00Z',
    verifiedAt: '2024-12-16T14:20:00Z',
    viewCount: 342,
    downloadCount: 189
  },
  {
    id: 'paper-2',
    subjectName: 'Principles of Life I',
    courseCode: 'BIO111',
    schoolId: 'foundation',
    program: 'BS-MS',
    academicYear: 1,
    semester: 1,
    examYear: 2024,
    examType: 'mid-sem',
    batch: 'Batch 24',
    fileUrl: '/sample-papers/BIO111_MidSem_2024.pdf',
    fileName: 'BIO111_MidSem_2024.pdf',
    fileSizeBytes: 1820000,
    status: 'verified',
    uploaderName: 'Anonymous Senior',
    isAnonymous: true,
    uploadedAt: '2024-10-10T08:15:00Z',
    verifiedAt: '2024-10-11T09:00:00Z',
    viewCount: 420,
    downloadCount: 230
  },
  {
    id: 'paper-3',
    subjectName: 'Matrices and Calculus I',
    courseCode: 'MTH111',
    schoolId: 'foundation',
    program: 'BS-MS',
    academicYear: 1,
    semester: 1,
    examYear: 2024,
    examType: 'end-sem',
    batch: 'Batch 24',
    fileUrl: '/sample-papers/MTH111_EndSem_2024.pdf',
    fileName: 'MTH111_EndSem_2024.pdf',
    fileSizeBytes: 3100000,
    status: 'verified',
    uploaderName: 'Divya Nair',
    isAnonymous: false,
    uploadedAt: '2024-12-18T16:00:00Z',
    verifiedAt: '2024-12-19T11:30:00Z',
    viewCount: 512,
    downloadCount: 340
  },
  {
    id: 'paper-4',
    subjectName: 'Mechanics I',
    courseCode: 'PHY111',
    schoolId: 'foundation',
    program: 'BS-MS',
    academicYear: 1,
    semester: 1,
    examYear: 2023,
    examType: 'end-sem',
    batch: 'Batch 23',
    fileUrl: '/sample-papers/PHY111_EndSem_2023.pdf',
    fileName: 'PHY111_EndSem_2023.pdf',
    fileSizeBytes: 2150000,
    status: 'verified',
    uploaderName: 'Rohan J.',
    isAnonymous: false,
    uploadedAt: '2023-12-20T12:00:00Z',
    verifiedAt: '2023-12-21T10:00:00Z',
    viewCount: 680,
    downloadCount: 410
  },
  {
    id: 'paper-5',
    subjectName: 'Classical Mechanics',
    courseCode: 'PHY301',
    schoolId: 'physics',
    program: 'BS-MS',
    academicYear: 3,
    semester: 5,
    examYear: 2024,
    examType: 'mid-sem',
    batch: 'Batch 22',
    fileUrl: '/sample-papers/PHY301_MidSem_2024.pdf',
    fileName: 'PHY301_MidSem_2024.pdf',
    fileSizeBytes: 1950000,
    status: 'verified',
    uploaderName: 'Kavya Menon',
    isAnonymous: false,
    uploadedAt: '2024-10-14T09:20:00Z',
    verifiedAt: '2024-10-15T15:10:00Z',
    viewCount: 290,
    downloadCount: 145
  },
  {
    id: 'paper-6',
    subjectName: 'Quantum Mechanics I',
    courseCode: 'PHY326',
    schoolId: 'physics',
    program: 'BS-MS',
    academicYear: 3,
    semester: 6,
    examYear: 2024,
    examType: 'end-sem',
    batch: 'Batch 22',
    fileUrl: '/sample-papers/PHY326_EndSem_2024.pdf',
    fileName: 'PHY326_EndSem_2024.pdf',
    fileSizeBytes: 2800000,
    status: 'verified',
    uploaderName: 'Varun Sharma',
    isAnonymous: false,
    uploadedAt: '2024-05-10T14:40:00Z',
    verifiedAt: '2024-05-11T12:00:00Z',
    viewCount: 380,
    downloadCount: 215
  },
  {
    id: 'paper-7',
    subjectName: 'Machine Learning I',
    courseCode: 'DSC331',
    schoolId: 'data-science',
    program: 'BS-MS',
    academicYear: 3,
    semester: 5,
    examYear: 2024,
    examType: 'end-sem',
    batch: 'Batch 22',
    fileUrl: '/sample-papers/DSC331_EndSem_2024.pdf',
    fileName: 'DSC331_EndSem_2024.pdf',
    fileSizeBytes: 3400000,
    status: 'verified',
    uploaderName: 'Siddharth Rao',
    isAnonymous: false,
    uploadedAt: '2024-12-14T11:00:00Z',
    verifiedAt: '2024-12-15T09:30:00Z',
    viewCount: 710,
    downloadCount: 480
  },
  {
    id: 'paper-8',
    subjectName: 'Organic Chemistry—Reactions and Mechanisms',
    courseCode: 'CHM316',
    schoolId: 'chemistry',
    program: 'BS-MS',
    academicYear: 3,
    semester: 5,
    examYear: 2024,
    examType: 'end-sem',
    batch: 'Batch 22',
    fileUrl: '/sample-papers/CHM316_EndSem_2024.pdf',
    fileName: 'CHM316_EndSem_2024.pdf',
    fileSizeBytes: 2600000,
    status: 'verified',
    uploaderName: 'Ananya Pillai',
    isAnonymous: false,
    uploadedAt: '2024-12-12T17:00:00Z',
    verifiedAt: '2024-12-13T10:15:00Z',
    viewCount: 220,
    downloadCount: 130
  },
  {
    id: 'paper-9',
    subjectName: 'Introduction to Real Analysis',
    courseCode: 'MTH301',
    schoolId: 'mathematics',
    program: 'BS-MS',
    academicYear: 3,
    semester: 5,
    examYear: 2024,
    examType: 'quiz',
    batch: 'Batch 22',
    fileUrl: '/sample-papers/MTH301_Quiz_2024.pdf',
    fileName: 'MTH301_Quiz_2024.pdf',
    fileSizeBytes: 1200000,
    status: 'verified',
    uploaderName: 'Harish M.',
    isAnonymous: false,
    uploadedAt: '2024-09-22T08:00:00Z',
    verifiedAt: '2024-09-23T11:00:00Z',
    viewCount: 190,
    downloadCount: 95
  },
  {
    id: 'paper-10',
    subjectName: 'Electromagnetism',
    courseCode: 'PHY121',
    schoolId: 'foundation',
    program: 'BS-MS',
    academicYear: 1,
    semester: 2,
    examYear: 2024,
    examType: 'supplementary',
    batch: 'Batch 23/24',
    fileUrl: '/sample-papers/PHY121_Supple_2024.pdf',
    fileName: 'PHY121_Supple_2024.pdf',
    fileSizeBytes: 1750000,
    status: 'pending',
    uploaderName: 'Anonymous Junior',
    isAnonymous: true,
    uploadedAt: '2025-01-05T13:10:00Z',
    viewCount: 42,
    downloadCount: 12
  },
  {
    id: 'paper-11',
    subjectName: 'Deep Learning',
    courseCode: 'DSC421',
    schoolId: 'data-science',
    program: 'BS-MS',
    academicYear: 4,
    semester: 7,
    examYear: 2024,
    examType: 'mid-sem',
    batch: 'Batch 21',
    fileUrl: '/sample-papers/DSC421_MidSem_2024.pdf',
    fileName: 'DSC421_MidSem_2024.pdf',
    fileSizeBytes: 2900000,
    status: 'pending',
    uploaderName: 'Rahul Verma',
    isAnonymous: false,
    uploadedAt: '2025-01-08T18:25:00Z',
    viewCount: 56,
    downloadCount: 19
  }
];

export const INITIAL_REQUESTS: PaperRequest[] = [
  {
    id: 'req-1',
    subjectName: 'Condensed Matter Physics I',
    courseCode: 'PHY316',
    academicYear: 3,
    semester: 6,
    examYear: 2023,
    examType: 'end-sem',
    notes: 'Looking for 2023 end-sem paper for prof lecture notes comparison.',
    requesterName: 'Meera K.',
    status: 'open',
    createdAt: '2025-01-02T10:00:00Z'
  },
  {
    id: 'req-2',
    subjectName: 'Molecular Biology',
    courseCode: 'BIO316',
    academicYear: 3,
    semester: 5,
    examYear: 2024,
    examType: 'quiz',
    notes: 'Need Quiz 1 and Quiz 2 question patterns.',
    requesterName: 'Aditya S.',
    status: 'open',
    createdAt: '2025-01-04T15:30:00Z'
  },
  {
    id: 'req-3',
    subjectName: 'Scientific Writing',
    courseCode: 'IDC200',
    academicYear: 2,
    semester: 4,
    examYear: 2024,
    examType: 'mid-sem',
    notes: 'Mid-sem assignment/test paper if anyone has it.',
    requesterName: 'Pooja R.',
    status: 'open',
    createdAt: '2025-01-06T09:12:00Z'
  }
];

export const INITIAL_SUGGESTIONS: SubjectSuggestion[] = [
  {
    id: 'sug-1',
    suggestedName: 'Advanced Quantum Field Theory',
    courseCode: 'PHY502',
    schoolName: 'School of Physics',
    semester: 9,
    studentName: 'Vivek K.',
    status: 'pending',
    adminNotes: 'Elective offered in Fall 2024 semester.',
    createdAt: '2025-01-07T11:20:00Z'
  },
  {
    id: 'sug-2',
    suggestedName: 'Reinforcement Learning & Robotics',
    courseCode: 'DSC510',
    schoolName: 'School of Data Science',
    semester: 8,
    studentName: 'Sanjay Nair',
    status: 'pending',
    adminNotes: 'New course initiated by visiting faculty.',
    createdAt: '2025-01-08T16:45:00Z'
  }
];
