# Configuración de i18n (Internacionalización)

## Idiomas configurados

El sitio soporta los siguientes idiomas:
- **Español (es)** - Idioma predeterminado
- **English (en)**

## Estructura de archivos

```
messages/
├── es.json  # Traducciones en español
└── en.json  # Traducciones en inglés

src/
├── i18n.ts          # Configuración de i18n
├── middleware.ts    # Middleware para detección de idioma
└── app/
    ├── layout.tsx   # Layout raíz
    └── [locale]/    # Carpeta dinámica para cada idioma
        ├── layout.tsx
        └── page.tsx
```

## Cómo usar traducciones en componentes

### En componentes de cliente ('use client')

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### En componentes de servidor

```tsx
import {useTranslations} from 'next-intl';

export default async function MyServerComponent() {
  const t = await useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
```

### Obtener el idioma actual

```tsx
import { useLocale } from 'next-intl';

export default function MyComponent() {
  const locale = useLocale(); // 'es' o 'en'
  
  return <p>Idioma actual: {locale}</p>;
}
```

## Agregar un nuevo idioma

### 1. Crear archivo de traducciones

Crea un nuevo archivo en `messages/` con el código del idioma:

```bash
messages/pt.json  # Para portugués
messages/fr.json  # Para francés
```

### 2. Agregar el idioma a la configuración

Edita `src/i18n.ts`:

```typescript
export const locales = ['es', 'en', 'pt', 'fr'] as const;
```

### 3. Estructura del archivo de traducciones

```json
{
  "nav": {
    "home": "Traducción",
    "tools": "Traducción"
  },
  "home": {
    "title": "Traducción",
    "subtitle": "Traducción"
  }
}
```

## Agregar nuevas traducciones

### 1. Agregar claves en todos los idiomas

**messages/es.json:**
```json
{
  "common": {
    "welcome": "Bienvenido"
  }
}
```

**messages/en.json:**
```json
{
  "common": {
    "welcome": "Welcome"
  }
}
```

### 2. Usar en el componente

```tsx
const t = useTranslations('common');
<p>{t('welcome')}</p>
```

## Traducciones con variables

### En el archivo de traducciones:

```json
{
  "home": {
    "endsOn": "Finaliza el {date}"
  }
}
```

### En el componente:

```tsx
t('endsOn', {date: '10 de Septiembre, 2025'})
```

## URLs con idiomas

El sistema usa rutas con prefijo de idioma:

- `/es` o `/` - Español (predeterminado)
- `/en` - English
- `/es/herramientas` - Herramientas en español
- `/en/herramientas` - Tools en inglés (misma ruta, diferente idioma)

## Cambiar entre idiomas

El componente Navbar ya incluye un selector de idioma. Para implementarlo en otro lugar:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    const currentPath = pathname.replace(`/${locale}`, '');
    window.location.href = `/${newLocale}${currentPath}`;
  };

  return (
    <button onClick={toggleLocale}>
      {locale === 'es' ? 'English' : 'Español'}
    </button>
  );
}
```

## Mejores prácticas

1. **Mantén las claves organizadas**: Usa nombres descriptivos y agrúpalas lógicamente
2. **Sincroniza todos los idiomas**: Asegúrate de que todas las claves existan en todos los archivos de idioma
3. **Usa variables para contenido dinámico**: En lugar de concatenar strings
4. **Prueba en todos los idiomas**: Verifica que las traducciones se vean bien en la UI

## Metadata y SEO

El metadata (título, descripción) ya está configurado para traducirse automáticamente según el idioma:

```tsx
// En src/app/[locale]/layout.tsx
export async function generateMetadata({params}: {params: {locale: string}}) {
  const messages = await getMessages({locale: params.locale});
  
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}
```

## Detección automática de idioma

El middleware detecta automáticamente el idioma preferido del navegador y redirige:
- Usuario con navegador en español → `/es` o `/`
- Usuario con navegador en inglés → `/en`

## Testing local

Puedes probar los diferentes idiomas accediendo a:
- http://localhost:3000 o http://localhost:3000/es - Español
- http://localhost:3000/en - English
