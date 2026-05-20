import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Ensure profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_onboarded")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // Create initial profile
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email ?? "",
            name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
            avatar_url: user.user_metadata?.avatar_url ?? null,
          });
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        if (!profile.is_onboarded) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
