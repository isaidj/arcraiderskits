# Arc Raiders Data Integration

Este proyecto integra automáticamente los datos del repositorio oficial de Arc Raiders.

## Repositorio de Datos

Los datos provienen de: [RaidTheory/arcraiders-data](https://github.com/RaidTheory/arcraiders-data)

Este repositorio contiene:
- **items.json** - Base de datos de items del juego
- **quests.json** - Misiones y objetivos
- **projects.json** - Proyectos de investigación
- **hideoutModules.json** - Módulos para mejorar el hideout
- **skillNodes.json** - Árbol de habilidades
- **images/** - Imágenes de items en alta calidad

## Actualización Automática

El sistema está configurado para actualizar los datos automáticamente:

### Durante el desarrollo
```bash
npm run dev
```
Esto ejecuta `update-data` antes de iniciar el servidor de desarrollo.

### Durante el build
```bash
npm run build
```
Los datos se actualizan antes de cada build de producción.

### Después de instalar dependencias
```bash
npm install
```
El script `postinstall` actualiza los datos automáticamente.

### Actualización manual
```bash
npm run update-data
```
Puedes ejecutar este comando en cualquier momento para obtener los datos más recientes.

## Estructura de Datos

Los datos se almacenan en:
```
public/data/
  ├── items.json
  ├── quests.json
  ├── projects.json
  ├── hideoutModules.json
  ├── skillNodes.json
  └── images/
      └── items/
```

## Navegación

El sitio incluye un menú de navegación con las siguientes secciones:

- **🏠 Home** - Página principal con el countdown de expedición
- **🎒 Items** - Base de datos completa de items
- **📜 Quests** - Listado de misiones y objetivos
- **🔧 Projects** - Proyectos de investigación disponibles
- **🏗️ Hideout Modules** - Módulos para mejorar tu hideout
- **🌳 Skill Nodes** - Árbol completo de habilidades

## Tecnología

El script de actualización (`scripts/update-data.js`):
1. Clona el repositorio de datos en `.tmp-arcraiders-data/`
2. Copia los archivos JSON necesarios a `public/data/`
3. Copia las imágenes a `public/data/images/`
4. El directorio temporal no se incluye en el control de versiones

## Atribución

Los datos del juego son propiedad de © Embark Studios AB. Este proyecto es un recurso comunitario y no está afiliado ni respaldado por Embark Studios AB.

Datos proporcionados por: https://github.com/RaidTheory/arcraiders-data
