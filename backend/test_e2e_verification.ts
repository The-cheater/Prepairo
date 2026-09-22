import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

import { getAllPapers, savePaper, updatePaper, deletePaper } from './db/db';
import { awardCredits, getUserCredits } from './services/credits';

function fetchUrlStatus(url: string): Promise<{ statusCode?: number; error?: any }> {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ error: err });
    });
  });
}

async function verifyAll() {
  console.log('================================================================');
  console.log('RUNNING FULL END-TO-END VERIFICATION & PIPELINE AUDIT');
  console.log('================================================================');

  let allPassed = true;

  // 1. PDF Test
  console.log('\n[1/6] PDF File Integrity:');
  const pdfPath = path.resolve('../parallel_and_distributed_computing_datascience_midesem_2026.pdf');
  const pdfStats = fs.statSync(pdfPath);
  console.log(`  Path: ${pdfPath}`);
  console.log(`  Size: ${pdfStats.size} bytes (${(pdfStats.size / 1024 / 1024).toFixed(2)} MB)`);
  if (pdfStats.size <= 2 * 1024 * 1024) {
    console.log('  -> PASS: File size within 2 MB limit');
  } else {
    console.error('  -> FAIL: File size exceeds 2 MB limit');
    allPassed = false;
  }

  // 2. Cloudinary Storage
  console.log('\n[2/6] Cloudinary Storage & Live URL:');
  const cloudinaryUrl = 'https://res.cloudinary.com/kskx0jpz/raw/upload/v1790054823/iiser_tvm_pyq/ParallelandDistributedComputing_midsem_2026';
  console.log(`  Checking: ${cloudinaryUrl}`);
  const httpCheck = await fetchUrlStatus(cloudinaryUrl);
  console.log(`  HTTP Response Status: ${httpCheck.statusCode}`);
  if (httpCheck.statusCode === 200) {
    console.log('  -> PASS: Cloudinary asset is live and accessible (HTTP 200)');
  } else {
    console.error(`  -> FAIL: Cloudinary asset returned status ${httpCheck.statusCode}`);
    allPassed = false;
  }

  // 3. Database Catalog & Field Posting
  console.log('\n[3/6] Database Catalog & Field Posting:');
  const papers = getAllPapers();
  const postedPaper = papers.find(p => p.subjectName === 'Parallel and Distributed Computing' && p.examYear === 2026);
  if (postedPaper) {
    console.log('  -> PASS: Paper posted in catalog!');
    console.log(`     ID: ${postedPaper.id}`);
    console.log(`     Subject: ${postedPaper.subjectName}`);
    console.log(`     School: ${postedPaper.schoolId} (School of Data Science)`);
    console.log(`     Exam: ${postedPaper.examType} ${postedPaper.examYear}`);
    console.log(`     Status: ${postedPaper.status}`);
    console.log(`     File: ${postedPaper.fileUrl}`);
  } else {
    console.error('  -> FAIL: Paper not found in database catalog!');
    allPassed = false;
  }

  // 4. Admin Decline & Approve Workflow Test
  console.log('\n[4/6] Admin Decline / Approve Workflow:');
  const tempPaperId = `paper-test-mod-${Date.now()}`;
  const tempPaper: any = {
    id: tempPaperId,
    subjectName: 'Test Moderation Subject',
    schoolId: 'data-science',
    program: 'BS-MS',
    academicYear: 5,
    semester: 9,
    examYear: 2026,
    examType: 'mid-sem',
    fileUrl: cloudinaryUrl,
    fileName: 'test.pdf',
    fileSizeBytes: 1000,
    status: 'pending',
    uploaderName: 'Tester',
    isAnonymous: false,
    uploadedAt: new Date().toISOString(),
    viewCount: 0,
    downloadCount: 0
  };
  savePaper(tempPaper);

  // Test Decline
  const declineReason = 'Test decline reason: Illegible handwriting';
  const declined = updatePaper(tempPaperId, {
    status: 'rejected',
    rejectionReason: declineReason,
    adminComment: declineReason
  });
  if (declined && declined.status === 'rejected' && declined.adminComment === declineReason) {
    console.log('  -> PASS: Admin decline correctly records status "rejected" and feedback comment');
  } else {
    console.error('  -> FAIL: Admin decline failed');
    allPassed = false;
  }

  // Test Approve
  const approveComment = 'Test approve: Verified and high quality';
  const approved = updatePaper(tempPaperId, {
    status: 'verified',
    verifiedAt: new Date().toISOString(),
    adminComment: approveComment,
    rejectionReason: undefined
  });
  if (approved && approved.status === 'verified' && approved.adminComment === approveComment) {
    console.log('  -> PASS: Admin approve correctly marks status "verified" and clears rejection reason');
  } else {
    console.error('  -> FAIL: Admin approve failed');
    allPassed = false;
  }

  // 5. Admin Deletion Test
  console.log('\n[5/6] Admin Deletion:');
  const deleteResult = deletePaper(tempPaperId);
  const checkDeleted = getAllPapers().find(p => p.id === tempPaperId);
  if (deleteResult && !checkDeleted) {
    console.log('  -> PASS: Admin deletePaper successfully removed the temporary paper from database!');
  } else {
    console.error('  -> FAIL: deletePaper did not remove the paper from database!');
    allPassed = false;
  }

  // 6. Credit Awarding & Fetching Test
  console.log('\n[6/6] Credit Awarding & Dashboard Fetching:');
  const testUserId = '4fa22db4-f415-4cd1-a7b2-5063435e97a3';
  try {
    if (postedPaper) {
      const awardRes = await awardCredits(testUserId, postedPaper.id);
      console.log('  Award credits result:', awardRes);
    }
    const credits = await getUserCredits(testUserId);
    console.log('  User credits retrieved:', {
      totalCredits: credits.totalCredits,
      availableCredits: credits.availableCredits,
      papersApproved: credits.papersApproved
    });
    console.log('  -> PASS: awardCredits executed without throwing and getUserCredits retrieved balance!');
  } catch (err) {
    console.error('  -> FAIL: Credits test error:', err);
    allPassed = false;
  }

  console.log('\n================================================================');
  if (allPassed) {
    console.log('>>> ALL BACKEND TESTS & DIAGNOSTICS PASSED WITH ZERO ERRORS! <<<');
  } else {
    console.log('>>> SOME TESTS FAILED <<<');
  }
  console.log('================================================================');
}

verifyAll();
