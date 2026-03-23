import { NextResponse } from "next/server";
import {
  getOrCreateSellerProfile,
  updateSellerProfile,
} from "@/lib/seller-profile";

export async function GET() {
  try {
    const profile = await getOrCreateSellerProfile();

    if (!profile) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET seller-profile error:", error);

    return NextResponse.json(
      { error: "Failed to load seller profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const profile = await updateSellerProfile({
      currentStep: body.currentStep,
      progressPatch: body.progressPatch,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PATCH seller-profile error:", error);

    return NextResponse.json(
      { error: "Failed to update seller profile." },
      { status: 500 }
    );
  }
}