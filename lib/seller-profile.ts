import { createClient } from "@/lib/supabase/server";

export type SellerProfile = {
  id: string;
  user_id: string;
  current_step: string;
  progress: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getOrCreateSellerProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data: existing, error: fetchError } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existing) {
    return existing as SellerProfile;
  }

  const { data: created, error: insertError } = await supabase
    .from("seller_profiles")
    .insert({
      user_id: user.id,
      current_step: "condition-report",
      progress: {},
    })
    .select("*")
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as SellerProfile;
}

export async function updateSellerProfile(params: {
  currentStep?: string;
  progressPatch?: Record<string, any>;
}) {
  const supabase = await createClient();
  const profile = await getOrCreateSellerProfile();

  if (!profile) {
    throw new Error("User is not authenticated.");
  }

  const mergedProgress = {
    ...(profile.progress || {}),
    ...(params.progressPatch || {}),
  };

  const updatePayload: Record<string, any> = {
    progress: mergedProgress,
  };

  if (params.currentStep) {
    updatePayload.current_step = params.currentStep;
  }

  const { data, error } = await supabase
    .from("seller_profiles")
    .update(updatePayload)
    .eq("user_id", profile.user_id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SellerProfile;
}