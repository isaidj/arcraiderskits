import { useState, useEffect } from "react";

/**
 * Hook para detectar si el dispositivo es móvil
 * @param breakpoint - Ancho en píxeles para considerar móvil (default: 768)
 * @returns true si es móvil, false si no
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar inicialmente
    checkMobile();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}
