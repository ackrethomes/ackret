import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, form, answers } = body ?? {};

    if (!form || !answers) {
      return NextResponse.json(
        { error: "Missing form or answers." },
        { status: 400 }
      );
    }

    const ownerNames = [form.owner1, form.owner2, form.owner3].filter(Boolean);

    if (id) {
      const { data, error } = await supabaseAdmin
        .from("condition_report_drafts")
        .update({
          property_address: form.propertyAddress ?? "",
          owner_names: ownerNames,
          form_data: form,
          answers,
        })
        .eq("id", id)
        .select("id")
        .single();

      if (error) throw error;

      return NextResponse.json({ id: data.id });
    }

    const { data, error } = await supabaseAdmin
      .from("condition_report_drafts")
      .insert({
        property_address: form.propertyAddress ?? "",
        owner_names: ownerNames,
        form_data: form,
        answers,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Save draft error:", error);
    return NextResponse.json(
      { error: "Failed to save condition report." },
      { status: 500 }
    );
  }
}