import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener información del cliente
    const userAgent = request.headers.get("user-agent") || "unknown";
    const forwarded = request.headers.get("x-forwarded-for");
    const userIp = forwarded ? forwarded.split(",")[0] : "unknown";

    // Generar un session ID básico (en producción podrías usar cookies o un sistema más robusto)
    const sessionId = request.cookies.get("session_id")?.value || `session_${Date.now()}_${Math.random()}`;

    // Insertar el registro de vista
    const { error } = await supabase.from("item_views").insert({
      item_id: itemId,
      user_ip: userIp,
      user_agent: userAgent,
      session_id: sessionId,
    });

    if (error) {
      console.error("Error tracking item view:", error);
      return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });

    // Establecer cookie de sesión si no existe
    if (!request.cookies.get("session_id")) {
      response.cookies.set("session_id", sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 días
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Error in track-item route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
