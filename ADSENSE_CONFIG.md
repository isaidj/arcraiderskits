# Configuración de Google AdSense

## Pasos para configurar AdSense en tu sitio

### 1. Obtener tu ID de publicador de AdSense

1. Ve a [Google AdSense](https://www.google.com/adsense/)
2. Inicia sesión con tu cuenta de Google
3. Completa el proceso de registro si es tu primera vez
4. Una vez aprobado, ve a **Cuenta** → **Configuración**
5. Encontrarás tu ID de publicador con el formato: `ca-pub-XXXXXXXXXXXXXXXX`

### 2. Reemplazar el ID en el código

Abre el archivo `src/app/layout.tsx` y reemplaza `ca-pub-XXXXXXXXXXXXXXXX` con tu ID real:

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-TU_ID_AQUI"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### 3. Verificar tu sitio

1. En tu panel de AdSense, agrega tu sitio web
2. Google AdSense escaneará tu sitio para verificar el código
3. Espera la aprobación (puede tomar de 24 horas a varias semanas)

### 4. Crear unidades de anuncios

Una vez aprobado, puedes crear unidades de anuncios:

#### Ejemplo de anuncio de display:

```tsx
<ins className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### En React/Next.js, crea un componente:

```tsx
// src/components/AdBanner.tsx
'use client';

import { useEffect } from 'react';

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot="TU_SLOT_ID"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
```

### 5. Políticas importantes

- No hagas clic en tus propios anuncios
- No animes a otros a hacer clic
- Asegúrate de tener contenido original y de calidad
- Cumple con las [Políticas de AdSense](https://support.google.com/adsense/answer/48182)

### 6. Tipos de anuncios recomendados para gaming

- **Banner superior**: En la barra de navegación o debajo
- **Sidebar**: En la columna lateral (desktop)
- **In-feed**: Entre contenido de noticias/guías
- **Anuncios de artículo**: Dentro de artículos largos

### Variables de entorno (opcional)

Puedes usar variables de entorno para manejar tu ID:

1. Crea `.env.local`:
```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

2. Usa en tu código:
```tsx
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}"
```

## Notas adicionales

- El script de AdSense ya está incluido en `layout.tsx`
- Usa `strategy="afterInteractive"` para no bloquear la carga inicial
- Los anuncios pueden tardar en aparecer durante el desarrollo
- En localhost, los anuncios no se mostrarán correctamente (es normal)
