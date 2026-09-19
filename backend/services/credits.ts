import { createSupabaseServer } from '@/backend/supabase/server';

const CREDITS_PER_PAPER = 10;
const REDEEM_THRESHOLD = 499;

/**
 * Award credits to a user when their paper is approved by admin.
 * Also updates the profile's total_credits and papers_approved counters.
 */
export async function awardCredits(userId: string, paperId: string) {
  const supabase = await createSupabaseServer();

  // Check if credits already awarded for this paper
  const { data: existing } = await supabase
    .from('credits')
    .select('id')
    .eq('user_id', userId)
    .eq('paper_id', paperId)
    .single();

  if (existing) return { alreadyAwarded: true };

  // Insert credit record
  const { error: creditError } = await supabase.from('credits').insert({
    user_id: userId,
    paper_id: paperId,
    amount: CREDITS_PER_PAPER,
    reason: 'Paper approved by admin',
  });

  if (creditError) throw creditError;

  // Update profile counters
  const { error: profileError } = await supabase.rpc('increment_profile_credits', {
    p_user_id: userId,
    p_amount: CREDITS_PER_PAPER,
  });

  // Fallback if RPC doesn't exist yet — direct update
  if (profileError) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_credits, papers_approved')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_credits: (profile.total_credits || 0) + CREDITS_PER_PAPER,
          papers_approved: (profile.papers_approved || 0) + 1,
        })
        .eq('id', userId);
    }
  }

  return { awarded: CREDITS_PER_PAPER };
}

/**
 * Get a user's credit balance and history.
 */
export async function getUserCredits(userId: string) {
  const supabase = await createSupabaseServer();

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_credits, redeemed_credits, papers_approved')
    .eq('id', userId)
    .single();

  const { data: history } = await supabase
    .from('credits')
    .select('id, amount, reason, created_at, paper_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  return {
    totalCredits: profile?.total_credits || 0,
    redeemedCredits: profile?.redeemed_credits || 0,
    availableCredits: (profile?.total_credits || 0) - (profile?.redeemed_credits || 0),
    papersApproved: profile?.papers_approved || 0,
    canRedeem: ((profile?.total_credits || 0) - (profile?.redeemed_credits || 0)) >= REDEEM_THRESHOLD,
    history: history || [],
  };
}

/**
 * Get public leaderboard data.
 */
export async function getLeaderboard(limit = 25) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, department, course, avatar_url, total_credits, papers_approved')
    .gt('total_credits', 0)
    .eq('role', 'student')
    .order('total_credits', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((p, idx) => ({
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
