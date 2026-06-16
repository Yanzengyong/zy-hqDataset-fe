# TCM Dataset Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite + Vue3 demo system for high-quality Traditional Chinese Medicine dataset construction, with a Three.js immersive build-flow page and dataset marketplace list/detail pages.

**Architecture:** Create the Vite project in the current workspace root, preserving `docs/`. Vue Router owns page navigation, mock API modules own all demo data, Vue components own UI state, and Three.js is isolated inside the build-flow scene component with a CSS fallback. The homepage is intentionally minimal until the user provides its final design.

**Tech Stack:** Vite, Vue3, Vue Router, Three.js, lucide-vue-next, plain CSS, npm.

---

## File Structure

Project root:

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite entry HTML.
- `vite.config.js`: Vite Vue plugin config.
- `.gitignore`: ignore dependencies, build output, local visual brainstorming files.

Source files:

- `src/main.js`: create Vue app, install router, import global CSS.
- `src/App.vue`: application shell with top navigation and router outlet.
- `src/router/index.js`: four routes: `/`, `/build`, `/market`, `/market/:id`.
- `src/styles/base.css`: reset, variables, global layout utilities, responsive defaults.
- `src/data/buildStages.js`: build-flow stage data and top metrics.
- `src/data/datasets.js`: marketplace categories and demo dataset records.
- `src/services/mockApi.js`: promise-based mock API functions.

Views:

- `src/views/HomeView.vue`: minimal homepage placeholder with navigation to build and market pages.
- `src/views/BuildView.vue`: orchestration for the build-flow screen.
- `src/views/MarketView.vue`: dataset marketplace list page.
- `src/views/DatasetDetailView.vue`: dataset detail page.
- `src/views/NotFoundView.vue`: route fallback.

Shared components:

- `src/components/layout/AppHeader.vue`: top navigation.
- `src/components/layout/Breadcrumb.vue`: breadcrumb trail.
- `src/components/common/TagBadge.vue`: reusable tag badge.
- `src/components/common/LoadingState.vue`: loading state.
- `src/components/common/EmptyState.vue`: empty state.

Build page components:

- `src/components/build/BuildMetrics.vue`: top metrics.
- `src/components/build/BuildScene.vue`: Three.js scene and CSS fallback.
- `src/components/build/StageInfoPanel.vue`: active stage details.
- `src/components/build/FlowControls.vue`: play/pause and stage buttons.

Marketplace components:

- `src/components/market/FilterSidebar.vue`: category filter catalog.
- `src/components/market/DatasetSearchBar.vue`: keyword search, publish button, sort controls.
- `src/components/market/DatasetCard.vue`: dataset list card.
- `src/components/market/DatasetSummary.vue`: detail page top summary.
- `src/components/market/DatasetTabs.vue`: detail page tab switching.
- `src/components/market/MetadataTable.vue`: metadata table.
- `src/components/market/ProviderPanel.vue`: provider information.
- `src/components/market/RelatedDatasets.vue`: related dataset list.

## Task 1: Scaffold Project

**Files:**

- Create: `.gitignore`
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/router/index.js`
- Create: `src/styles/base.css`

- [ ] **Step 1: Initialize Git for checkpoints**

Run:

```bash
git init
```

Expected: repository initialized in `/Users/yzy/Documents/高质量数据集构建演示系统`.

- [ ] **Step 2: Create package manifest**

Create `package.json`:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-vue": "latest",
    "vite": "latest",
    "vue": "latest",
    "vue-router": "latest",
    "three": "latest",
    "lucide-vue-next": "latest"
  },
  "devDependencies": {}
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules/` and `package-lock.json` are created.

- [ ] **Step 4: Create Vite entry files**

Create `index.html` with a `#app` mount node.

Create `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

Create `src/main.js` with:

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 5: Add router skeleton**

Create `src/router/index.js` with route-level lazy imports for:

- `/` -> `HomeView`
- `/build` -> `BuildView`
- `/market` -> `MarketView`
- `/market/:id` -> `DatasetDetailView`
- `/:pathMatch(.*)*` -> `NotFoundView`

- [ ] **Step 6: Add minimal views and app shell**

Create the five view files with simple titles so every route renders. Create `App.vue` with `AppHeader` and `<RouterView />`.

- [ ] **Step 7: Verify scaffold**

Run:

```bash
npm run build
```

Expected: build succeeds and creates `dist/`.

- [ ] **Step 8: Commit scaffold**

Run:

```bash
git add .gitignore package.json package-lock.json index.html vite.config.js src docs
git commit -m "chore: scaffold vue dataset demo"
```

Expected: commit succeeds.

## Task 2: Mock Data And API

**Files:**

- Create: `src/data/buildStages.js`
- Create: `src/data/datasets.js`
- Create: `src/services/mockApi.js`

- [ ] **Step 1: Add build-flow data**

Create `src/data/buildStages.js` exporting:

- `buildMetrics`: total sources, standardization rate, quality levels, dataset products.
- `buildStages`: four records with `id`, `title`, `subtitle`, `description`, `sourceTypes`, `capabilities`, `metrics`, and `accent`.

The four stage ids must be:

- `source`
- `collect`
- `annotate`
- `product`

- [ ] **Step 2: Add marketplace data**

Create `src/data/datasets.js` exporting:

- `marketCategories`: grouped filters for 中医文本、医学影像、临床数据、知识资产.
- `datasets`: at least six dataset records with complete fields matching the design document.

Required dataset ids:

- `formula-syndrome-corpus`
- `tongue-image-constitution`
- `medical-case-qa`
- `herb-image-recognition`
- `special-disease-followup`
- `tcm-evaluation-benchmark`

- [ ] **Step 3: Add mock API**

Create `src/services/mockApi.js` with promise-based functions:

```js
export function getBuildOverview()
export function getMarketCategories()
export function getDatasets({ keyword, category, sort } = {})
export function getDatasetDetail(id)
export function getRelatedDatasets(id)
export function toggleFavorite(id)
export function simulateDownload(id)
```

Each function should wait about 180ms using a local `delay` helper so loading states are visible without making the app feel slow.

- [ ] **Step 4: Verify imports**

Run:

```bash
npm run build
```

Expected: build succeeds with no unresolved imports.

- [ ] **Step 5: Commit data layer**

Run:

```bash
git add src/data src/services
git commit -m "feat: add mock dataset api"
```

Expected: commit succeeds.

## Task 3: App Shell And Common Components

**Files:**

- Create: `src/components/layout/AppHeader.vue`
- Create: `src/components/layout/Breadcrumb.vue`
- Create: `src/components/common/TagBadge.vue`
- Create: `src/components/common/LoadingState.vue`
- Create: `src/components/common/EmptyState.vue`
- Modify: `src/App.vue`
- Modify: `src/styles/base.css`

- [ ] **Step 1: Implement header**

`AppHeader` should show the system name, route links for 首页、数据集构建、数据集超市, and a compact status badge reading `中医药数据资产演示`.

- [ ] **Step 2: Implement breadcrumb and common states**

`Breadcrumb` accepts `items` with `{ label, to }`. `TagBadge` accepts `tone`. `LoadingState` and `EmptyState` render restrained inline states suitable for list and detail pages.

- [ ] **Step 3: Wire shell**

Update `App.vue` to render `AppHeader` once and use route-specific pages inside `<main class="app-main">`.

- [ ] **Step 4: Add global style foundation**

Add CSS variables for dark ink, blue, teal, gold, border, panel, and muted text. Add responsive defaults and avoid full-page single-hue styling.

- [ ] **Step 5: Verify navigation**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit shell**

Run:

```bash
git add src/App.vue src/components src/styles/base.css
git commit -m "feat: add application shell"
```

Expected: commit succeeds.

## Task 4: Build Flow Page

**Files:**

- Modify: `src/views/BuildView.vue`
- Create: `src/components/build/BuildMetrics.vue`
- Create: `src/components/build/BuildScene.vue`
- Create: `src/components/build/StageInfoPanel.vue`
- Create: `src/components/build/FlowControls.vue`

- [ ] **Step 1: Write build page state**

`BuildView` loads `getBuildOverview()`, stores `stages`, `metrics`, `activeStageId`, `isPlaying`, and interval cleanup. Auto-play advances every 2600ms when `isPlaying` is true.

- [ ] **Step 2: Implement metrics bar**

`BuildMetrics` renders four compact metrics from `buildMetrics`, using icon buttons or small icon+label treatments from lucide-vue-next where useful.

- [ ] **Step 3: Implement Three.js scene**

`BuildScene` accepts `stages`, `activeStageId`, and `isPlaying`. It creates:

- scene, camera, renderer.
- center sphere for 中医药高质量数据集.
- four clickable stage nodes placed around the center.
- particle-like line geometry or animated points between stage nodes and center.
- low-opacity pulse line and herb-inspired background accents using CSS overlay.

Emit `select-stage` when a node is clicked. Dispose renderer, geometry, and animation frame on unmount.

- [ ] **Step 4: Implement CSS fallback**

If WebGL or Three.js setup throws, `BuildScene` switches to a CSS fallback with center core, four stage cards, and glowing lines.

- [ ] **Step 5: Implement information panel**

`StageInfoPanel` renders active stage title, description, source types, capabilities, and stage metrics. Content must use中医药语义 from `buildStages.js`.

- [ ] **Step 6: Implement controls**

`FlowControls` renders play/pause and four stage buttons. Clicking a stage emits `select-stage`; clicking play/pause emits `toggle-play`.

- [ ] **Step 7: Verify build page**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 8: Browser verify**

Start dev server:

```bash
npm run dev
```

Open `/build` and verify:

- center star core is visible.
- four stage nodes are visible.
- active node changes automatically.
- clicking a node changes the right-side panel.
- play/pause works.
- no console errors.

- [ ] **Step 9: Commit build page**

Run:

```bash
git add src/views/BuildView.vue src/components/build src/data/buildStages.js
git commit -m "feat: add tcm build flow screen"
```

Expected: commit succeeds.

## Task 5: Marketplace List Page

**Files:**

- Modify: `src/views/MarketView.vue`
- Create: `src/components/market/FilterSidebar.vue`
- Create: `src/components/market/DatasetSearchBar.vue`
- Create: `src/components/market/DatasetCard.vue`

- [ ] **Step 1: Write list page state**

`MarketView` loads categories and datasets. State includes `keyword`, `activeCategory`, `sort`, `loading`, and `datasets`.

- [ ] **Step 2: Implement filter sidebar**

`FilterSidebar` renders grouped categories in the screenshot style. It highlights the active filter and emits `select-category`.

- [ ] **Step 3: Implement search bar**

`DatasetSearchBar` renders tabs, keyword input, search button, publish button, advanced search menu label, and sort selector label. Search emits current keyword. Publish button can show a disabled/demo toast-like state.

- [ ] **Step 4: Implement dataset card**

`DatasetCard` renders logo, title, summary, tags, provider, downloads, size, update date, and favorite button. The card title or body links to `/market/:id`.

- [ ] **Step 5: Implement filtering behavior**

`MarketView` calls `getDatasets({ keyword, category, sort })` when keyword, category, or sort changes. Empty results show `EmptyState`.

- [ ] **Step 6: Verify list page**

Run:

```bash
npm run build
```

Expected: build succeeds.

Browser verify `/market`:

- left catalog renders.
- search filters by dataset name, summary, and tags.
- category filters update cards.
- clicking a card opens the detail route.

- [ ] **Step 7: Commit marketplace list**

Run:

```bash
git add src/views/MarketView.vue src/components/market src/data/datasets.js src/services/mockApi.js
git commit -m "feat: add dataset marketplace list"
```

Expected: commit succeeds.

## Task 6: Dataset Detail Page

**Files:**

- Modify: `src/views/DatasetDetailView.vue`
- Create: `src/components/market/DatasetSummary.vue`
- Create: `src/components/market/DatasetTabs.vue`
- Create: `src/components/market/MetadataTable.vue`
- Create: `src/components/market/ProviderPanel.vue`
- Create: `src/components/market/RelatedDatasets.vue`

- [ ] **Step 1: Load detail data**

`DatasetDetailView` reads `route.params.id`, calls `getDatasetDetail(id)` and `getRelatedDatasets(id)`, and renders loading, found, and not-found states.

- [ ] **Step 2: Implement summary**

`DatasetSummary` matches the list-card information density and includes favorite and download controls.

- [ ] **Step 3: Implement tabs**

`DatasetTabs` supports `intro`, `samples`, and `metadata`. The introduction tab renders overview, use cases, data source, annotation rules, quality control, and usage limits. The samples tab renders two or three sample rows from the dataset. The metadata tab renders `MetadataTable`.

- [ ] **Step 4: Implement document preview**

Below tabs, render a data specification preview area with a download button. `simulateDownload(id)` changes the button label to show a short success state.

- [ ] **Step 5: Implement side panels**

`ProviderPanel` renders provider information. `RelatedDatasets` renders related dataset cards linking to their detail pages.

- [ ] **Step 6: Verify detail page**

Run:

```bash
npm run build
```

Expected: build succeeds.

Browser verify `/market/formula-syndrome-corpus`:

- summary card renders.
- tabs switch without navigation.
- metadata table renders.
- related dataset links work.
- invalid id renders not-found state.

- [ ] **Step 7: Commit detail page**

Run:

```bash
git add src/views/DatasetDetailView.vue src/components/market src/services/mockApi.js
git commit -m "feat: add dataset detail page"
```

Expected: commit succeeds.

## Task 7: Responsive Polish And Homepage Placeholder

**Files:**

- Modify: `src/views/HomeView.vue`
- Modify: `src/styles/base.css`
- Modify: relevant component styles in `.vue` files.

- [ ] **Step 1: Keep homepage minimal**

`HomeView` should only provide a clean entry screen with links to `/build` and `/market`, plus a clear note in code comments that the final homepage will be implemented from the user's later requirements.

- [ ] **Step 2: Add desktop polish**

Ensure:

- cards have radius no larger than 8px unless scene panels need larger structural radius.
- text does not overflow buttons.
- marketplace panels follow the reference image's clean white/light-blue layout.
- build page remains dark, immersive, and TCM-specific.

- [ ] **Step 3: Add mobile rules**

At mobile width:

- app header wraps without overlap.
- build page stacks scene and panel.
- market sidebar becomes a top filter block.
- detail page stacks main content and right sidebar.

- [ ] **Step 4: Verify build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit polish**

Run:

```bash
git add src
git commit -m "style: polish responsive dataset demo"
```

Expected: commit succeeds.

## Task 8: Final Verification

**Files:**

- Modify only if verification reveals a bug.

- [ ] **Step 1: Production build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 2: Start dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 3: Browser verification**

Use the browser to verify:

- `/` renders.
- `/build` renders a nonblank Three.js or fallback scene.
- `/build` auto-play and node click interaction work.
- `/market` renders catalog, list, search, filter, and links.
- `/market/formula-syndrome-corpus` renders detail content.
- `/market/not-real` renders a not-found state.

- [ ] **Step 4: Responsive verification**

Check desktop and mobile viewport sizes:

- no important text overlaps.
- no cards collapse into unreadable widths.
- build scene remains visible.
- market list cards remain scannable.

- [ ] **Step 5: Final commit**

Run:

```bash
git status --short
git add .
git commit -m "test: verify tcm dataset demo"
```

Expected: final working tree is clean after the commit.
