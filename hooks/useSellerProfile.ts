"use client";

import { useEffect, useState } from "react";

export function useSellerProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seller-profile", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load profile.");
        return;
      }

      setProfile(data);
    } catch {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(params: {
    currentStep?: string;
    progressPatch?: Record<string, any>;
  }) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/seller-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save profile.");
        return null;
      }

      setProfile(data);
      return data;
    } catch {
      setError("Failed to save profile.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    saving,
    error,
    saveProfile,
    reloadProfile: loadProfile,
  };
}