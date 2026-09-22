import fs from 'fs';
import path from 'path';
import { createSupabaseServer } from '@/backend/supabase/server';
import { getAllPapers } from '@/backend/db/db';

const CREDITS_PER_PAPER = 10;
const REDEEM_THRESHOLD = 499;

function getCreditsFile(): string {
  const cwd = process.cwd();
  const rootFrontendData = path.join(cwd, 'frontend', 'data');
  if (fs.existsSync(rootFrontendData)) {
    return path.join(rootFrontendData, 'credits.json');
  }
  const cwdData = path.join(cwd, 'data');
  if (fs.existsSync(cwdData)) {
    return path.join(cwdData, 'credits.json');
  }
  if (fs.existsSync(path.join(cwd, 'frontend'))) {
    return path.join(rootFrontendData, 'credits.json');
  }
  return path.join(cwdData, 'credits.json');
}

interface LocalCreditRecord {
  id: string;
  userId: string;
  paperId?: string;
  amount: number;
  reason: string;
  createdAt: string;
}

function getLocalCredits(): LocalCreditRecord[] {
  try {
    const file = getCreditsFile();
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content) || [];
  } catch {
    return [];
  }
}

function saveLocalCredit(rec: LocalCreditRecord) {
  try {
    const file = getCreditsFile();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const list = getLocalCredits();
    list.unshift(rec);
    fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Local credits save warning:', err);
  }
}

/**
 * Award credits to a user when their paper is approved by admin.
 * Updates both the persistent local ledger and attempts Supabase counter updates.
 */
export async function awardCredits(userId: string, paperId: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paperId);

  // 1. Record in persistent local ledger
  saveLocalCredit({
    id: `crd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    paperId,
    amount: CREDITS_PER_PAPER,
    reason: `Paper approved by admin (${paperId})`,
    createdAt: new Date().toISOString()
  });

  // 2. Also attempt Supabase insert & counter update
  try {
    const supabase = await createSupabaseServer();
    const insertPayload: Record<string, any> = {
      user_id: userId,
      amount: CREDITS_PER_PAPER,
      reason: `Paper approved by admin (${paperId})`,
    };
    if (isUuid) {
      insertPayload.paper_id = paperId;
    }
    await supabase.from('credits').insert(insertPayload);
  } catch (err) {
    console.warn('Credits ledger Supabase notice:', err);
  }

  return { awarded: CREDITS_PER_PAPER };
}

/**
 * Get a user's credit balance and history, synthesizing verified papers,
 * local ledger, and Supabase profile.
 */
export async function getUserCredits(userId: string, username?: string, fullName?: string) {
  // 1. Compute verified papers authored by this user
  const allPapers = getAllPapers();
  const cleanId = (userId || '').trim().toLowerCase();
  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanFullName = (fullName || '').trim().toLowerCase();
  const cleanAlphaNumericId = cleanId.replace(/[^a-z0-9]/g, '');

  const userVerifiedPapers = allPapers.filter(p => {
    if (p.status !== 'verified') return false;
    if (p.uploaderId && (p.uploaderId === userId || p.uploaderId.toLowerCase() === cleanId)) return true;
    if (p.uploaderName) {
      const uName = p.uploaderName.trim().toLowerCase();
      if (cleanUsername && (uName === cleanUsername || uName.includes(cleanUsername) || cleanUsername.includes(uName))) return true;
      if (cleanFullName && (uName === cleanFullName || uName.includes(cleanFullName) || cleanFullName.includes(uName))) return true;
      const cleanUName = uName.replace(/[^a-z0-9]/g, '');
      if (cleanAlphaNumericId && cleanUName && (cleanUName === cleanAlphaNumericId || cleanUName.includes(cleanAlphaNumericId) || cleanAlphaNumericId.includes(cleanUName))) return true;
    }
    return false;
  });

  const verifiedPapersCount = userVerifiedPapers.length;
  const paperCredits = verifiedPapersCount * CREDITS_PER_PAPER;

  // 2. Compute local ledger credits
  const localList = getLocalCredits();
  const userLedger = localList.filter(c => {
    if (c.userId === userId || c.userId.toLowerCase() === cleanId) return true;
    if (cleanUsername && c.userId.toLowerCase().includes(cleanUsername)) return true;
    return false;
  });
  const ledgerCredits = userLedger.reduce((sum, c) => sum + (c.amount || 0), 0);

  // 3. Query Supabase
  let supabaseTotal = 0;
  let supabaseApproved = 0;
  let supabaseRedeemed = 0;
  let history: any[] = [];

  try {
    const supabase = await createSupabaseServer();
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_credits, redeemed_credits, papers_approved')
      .eq('id', userId)
      .single();

    if (profile) {
      supabaseTotal = profile.total_credits || 0;
      supabaseApproved = profile.papers_approved || 0;
      supabaseRedeemed = profile.redeemed_credits || 0;
    }

    const { data: remoteHistory } = await supabase
      .from('credits')
      .select('id, amount, reason, created_at, paper_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (remoteHistory && remoteHistory.length > 0) {
      history = remoteHistory;
    }
  } catch {}

  const finalTotal = Math.max(paperCredits, ledgerCredits, supabaseTotal);
  const finalApproved = Math.max(verifiedPapersCount, supabaseApproved);
  const finalAvailable = Math.max(0, finalTotal - supabaseRedeemed);

  return {
    totalCredits: finalTotal,
    redeemedCredits: supabaseRedeemed,
    availableCredits: finalAvailable,
    papersApproved: finalApproved,
    history: history.length > 0 ? history : userLedger.map(l => ({
      id: l.id,
      amount: l.amount,
      reason: l.reason,
      created_at: l.createdAt,
      paper_id: l.paperId
    })),
  };
}

/**
 * Get public live leaderboard data from real contributors.
 */
export async function getLeaderboard(limit = 25) {
  // 1. Gather all verified papers from catalog
  const allPapers = getAllPapers().filter(p => p.status === 'verified');
  const contributorMap: Record<string, any> = {};

  for (const paper of allPapers) {
    const idKey = paper.uploaderId || '';
    const nameKey = (paper.uploaderName || '').trim().toLowerCase();

    let existingKey = Object.keys(contributorMap).find(k => {
      const entry = contributorMap[k];
      if (idKey && entry.id === idKey) return true;
      if (nameKey && entry.username.toLowerCase() === nameKey) return true;
      if (nameKey && entry.full_name.toLowerCase() === nameKey) return true;
      return false;
    });

    const key = existingKey || idKey || paper.uploaderName || `usr_${Math.random().toString(36).substring(2, 6)}`;
    if (!contributorMap[key]) {
      const isRohan = (paper.uploaderId === '4fa22db4-f415-4cd1-a7b2-5063435e97a3') || 
                      (paper.uploaderName && paper.uploaderName.toLowerCase().includes('rohan'));
      contributorMap[key] = {
        id: paper.uploaderId || `usr_${Math.random().toString(36).substring(2, 6)}`,
        username: isRohan ? 'rohanjena' : (paper.uploaderName || 'Contributor'),
        full_name: paper.uploaderName || 'Student Contributor',
        department: isRohan ? 'Data Science' : (paper.schoolId === 'data-science' ? 'Data Science' : paper.schoolId === 'physics' ? 'School of Physics' : paper.schoolId || 'IISER TVM'),
        course: isRohan ? 'Ph.D.' : 'Student',
        avatar_url: '/logo.png',
        papers_approved: 0,
        total_credits: 0,
      };
    }
    contributorMap[key].papers_approved += 1;
    contributorMap[key].total_credits += CREDITS_PER_PAPER;
  }

  // 2. Also query Supabase profiles
  try {
    const supabase = await createSupabaseServer();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name, department, course, avatar_url, total_credits, papers_approved');

    if (profiles && profiles.length > 0) {
      for (const p of profiles) {
        let matchKey = Object.keys(contributorMap).find(k => {
          const entry = contributorMap[k];
          if (p.id && entry.id === p.id) return true;
          if (p.username && entry.username.toLowerCase() === (p.username || '').toLowerCase()) return true;
          if (p.full_name && entry.full_name.toLowerCase() === (p.full_name || '').toLowerCase()) return true;
          const cleanP = (p.full_name || p.username || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanE = (entry.full_name || entry.username || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleanP && cleanE && (cleanP.includes(cleanE) || cleanE.includes(cleanP))) return true;
          return false;
        });

        const key: string = matchKey || p.id || p.username || `profile_${Math.random()}`;
        if (!contributorMap[key]) {
          contributorMap[key] = {
            id: p.id,
            username: p.username || 'Contributor',
            full_name: p.full_name || p.username,
            department: p.department || 'IISER TVM',
            course: p.course || 'Student',
            avatar_url: p.avatar_url || '',
            papers_approved: p.papers_approved || 0,
            total_credits: p.total_credits || 0,
          };
        } else {
          contributorMap[key].total_credits = Math.max(contributorMap[key].total_credits, p.total_credits || 0);
          contributorMap[key].papers_approved = Math.max(contributorMap[key].papers_approved, p.papers_approved || 0);
          if (p.avatar_url) contributorMap[key].avatar_url = p.avatar_url;
          if (p.full_name) contributorMap[key].full_name = p.full_name;
          if (p.username) contributorMap[key].username = p.username;
          if (p.department) contributorMap[key].department = p.department;
          if (p.course) contributorMap[key].course = p.course;
        }
      }
    }
  } catch {}

  // 3. Ensure profile overrides are cleanly applied
  for (const item of Object.values(contributorMap)) {
    if (item.id === '4fa22db4-f415-4cd1-a7b2-5063435e97a3' || 
        (item.username && item.username.toLowerCase().includes('rohan')) || 
        (item.full_name && item.full_name.toLowerCase().includes('rohan'))) {
      if (!item.course || item.course === 'BS-MS' || item.course === 'Student') {
        item.course = 'Ph.D.';
      }
      if (!item.department || item.department === 'Foundation' || item.department === 'IISER TVM') {
        item.department = 'Data Science';
      }
      if (item.username === 'Rohan Kumar Jena' || !item.username) {
        item.username = 'rohanjena';
      }
    }
  }

  const list = Object.values(contributorMap);
  list.sort((a, b) => b.total_credits - a.total_credits);

  return list.slice(0, limit).map((p, idx) => ({
    rank: idx + 1,
    ...p,
  }));
}

/**
 * Submit a redeem request.
 */
export async function requestRedeem(userId: string, amount: number, paymentInfo: string) {
  const supabase = await createSupabaseServer();

  // Verify user has enough credits
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_credits, redeemed_credits')
    .eq('id', userId)
    .single();

  if (!profile) throw new Error('Profile not found');

  const available = (profile.total_credits || 0) - (profile.redeemed_credits || 0);
  if (available < REDEEM_THRESHOLD) {
    throw new Error(`Insufficient credits. You need ${REDEEM_THRESHOLD} but have ${available}.`);
  }
  if (amount > available) {
    throw new Error(`Cannot redeem ${amount} credits. Available: ${available}.`);
  }

  // Create redeem request
  const { data: request, error } = await supabase
    .from('redeem_requests')
    .insert({
      user_id: userId,
      amount,
      payment_info: paymentInfo,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Update redeemed_credits on profile
  await supabase
    .from('profiles')
    .update({ redeemed_credits: (profile.redeemed_credits || 0) + amount })
    .eq('id', userId);

  return request;
}

export { CREDITS_PER_PAPER, REDEEM_THRESHOLD };
