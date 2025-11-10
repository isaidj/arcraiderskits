import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale } from "./src/config/i18n";

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Verificar si la ruta ya tiene un locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Si la ruta es la raíz, redirigir al idioma detectado
  if (pathname === "/") {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Si la ruta no tiene locale, detectar el idioma y redirigir
  const locale = getLocale(request);
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

function getLocale(request: NextRequest): string {
  // 1. Intentar obtener el idioma de una cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Detectar del header Accept-Language
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // Parsear el header Accept-Language
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, q = "q=1"] = lang.trim().split(";");
        const quality = parseFloat(q.replace("q=", ""));
        return { code: code.toLowerCase(), quality };
      })
      .sort((a, b) => b.quality - a.quality);

    // Buscar el primer idioma soportado
    for (const { code } of languages) {
      // Verificar coincidencia exacta
      if (isValidLocale(code)) {
        return code;
      }

      // Verificar coincidencia de idioma base (ej: 'es-MX' → 'es')
      const baseCode = code.split("-")[0];
      if (isValidLocale(baseCode)) {
        return baseCode;
      }

      // Casos especiales
      if (code.startsWith("zh")) {
        // Chino simplificado vs tradicional
        if (code.includes("cn") || code.includes("hans")) {
          return "zh-CN";
        }
        if (code.includes("tw") || code.includes("hant") || code.includes("hk")) {
          return "zh-TW";
        }
      }

      if (code.startsWith("ko")) return "kr";
      if (code.startsWith("nb") || code.startsWith("nn")) return "no";
    }
  }

  // 3. Fallback al idioma por defecto
  return defaultLocale;
}

export const config = {
  matcher: [
    // Excluir rutas de API, archivos estáticos, y _next
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|txt|xml)).*)",
  ],
};
