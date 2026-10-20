# Sky Explorers Unified LMS — Complete UI Template & Architectural Specification

> **Platform:** Sky Explorers Unified Learning Management System  
> **Courses Covered:** Python Programming (Middle School Core) & Data Science L1 (Applied Analytics)  
> **Target Audience:** Students aged 11–16, Classroom Facilitators, Parents, and Operations Administrators  
> **Visual Design Direction:** Chunky Cartoon / Candy UI (Thick solid ink borders, 0-blur hard offset shadows, high-saturation candy palette, tactile physical press states)  
> **Implementation State:** Interactive Single-Page Application (SPA) UI Template (Pure HTML5, Vanilla CSS3, Vanilla ES6+ JavaScript, 27 Normalized PNG Assets). Ready for client-side Pyodide WASM runtime and WebSocket/REST backend integration.

---

## 1. System Vision, Pedagogical Context & Design Philosophy

### 1.1 Pedagogical Context (Ages 11–16)
The platform is designed to teach computational thinking and data literacy without overwhelming young students with sterile, text-heavy developer tools. Key pedagogical tenets include:
1. **Low Floor, High Ceiling:** Clear visual pacing with instant feedback; students write real Python code rather than dragging blocks.
2. **Socratic Scaffolding (REQ-HINT):** When code fails or syntax errors occur, the system provides graduated, friendly guiding questions. The mascot **never displays anger or frustration** near pedagogical hints (strictly reserved for blocking system errors).
3. **Synchronous Pacing & Cohort Locks (REQ-FAC):** Facilitators retain master pacing control. Sessions beyond the cohort's current milestone remain locked until the facilitator unlocks them.
4. **Gamified Intrinsic Progression (REQ-CRS & REQ-REW):**
   * **Mystery Build:** A 26-session continuous meta-project (*Autonomous Drone Flight Simulator*) where each completed session awards an encrypted blueprint code shard (`Shards: 14 / 26`).
   * **Currencies:** Gold Coins (`coin.png`) earned from daily missions and Rare Gems (`gems.png`) awarded for clean coding challenges.
   * **Badge Showcase:** Named achievement medallions and upcoming tier milestone medallions (Bronze, Silver, Gold, Diamond).

---

### 1.2 The "Chunky Cartoon / Candy UI" Visual Philosophy
Unlike modern minimalist SaaS or dark glassmorphism, this design system treats every button, card, and panel as a **tactile physical toy**.

```
  +---------------------------------------+
  |              CARD FACE                |  <-- Solid opaque color (no gradient)
  |  border: 3.5px solid #18202d          |  <-- Thick Ink Outline
  |  border-radius: 18px                  |  <-- Generous rounded corners
  +---------------------------------------+
  |\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|  <-- Solid Hard Shadow (0 blur)
  +---------------------------------------+      box-shadow: 0 5px 0 #18202d
```

#### The Six Invariable Visual Laws:
1. **Flat, Fully Opaque Fills:** Zero CSS gradients, zero glassmorphism (`backdrop-filter`), zero transparent alpha fills on cards, buttons, or modals. Every surface is an unapologetic, solid color.
2. **Thick Dark Ink Outlines:** Every button, card, input, avatar frame, and badge has a solid border using `--ink: #18202d` (width: `2px` to `4.5px`).
3. **Zero-Blur Hard Offset Shadows:** Shadows are strictly directional on the Y-axis (`0 Npx 0 var(--shadow-color)`) with **zero blur radius**.
4. **Physical Tactile Press States:** When pressed (`:active`), an element translates downwards along the Y-axis by the exact shadow offset distance while its shadow collapses to 0. This simulates mechanical travel.
   $$\text{Resting:} \quad y = 0, \quad \text{Shadow} = (0, \Delta y, 0)$$
   $$\text{Active:} \quad y = +\Delta y, \quad \text{Shadow} = (0, 0, 0)$$
5. **Generously Rounded Corners:** Radii range from `12px` (small pills) up to `28px` (large modal panels) and `9999px` (capsule pills).
6. **Curated High-Energy Candy Palette:** High-saturation primary and secondary hues mapped strictly to semantic meaning.

---

## 2. Global Design Tokens Reference

All design tokens are defined in [`design-system.css`](file:///c:/Users/ayans/OneDrive/Desktop/Sylabbi/python/app/design-system.css) as CSS Custom Properties (`:root`):

### 2.1 Color Palette

| Token Name | CSS Custom Property | Hex Code | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Ink** | `--ink` | `#18202d` | All outlines, card borders, display headers, shadow fills |
| **Shadow Color**| `--shadow-color` | `rgba(24, 32, 45, 0.95)` | Hard 0-blur drop shadow fill |
| **Candy Green** | `--candy-green` | `#6fc624` | Universal "Go": Primary RUN buttons, success states, confirm actions, submit buttons |
| **Candy Red** | `--candy-red` | `#f14343` | Universal "Stop": STOP execution button, danger actions, error badges, session locks |
| **Candy Gold** | `--candy-gold` | `#fed034` | Currency, rewards, and celebratory highlights ONLY (never primary confirm actions) |
| **Candy Indigo**| `--candy-indigo`| `#4f46e5` | Generic secondary actions, peek code, info panels, focus rings (37° separation from Python) |
| **Surface White**| `--surface-white` | `#ffffff` | Clean white card faces, editor tabs, input fills |
| **Surface Slate**| `--surface-slate` | `#f1f5f9` | Neutral sub-panels, inactive tabs, code terminal background |
| **Currency: Coin**| `--currency-coin` | `#fed034` | Gold Coin balance across all courses |
| **Currency: Gem** | `--currency-gem` | `#d946ef` | Rare Gem balance (Fuchsia/Magenta - universal across both courses) |
| **Currency: Shard**| `--currency-shard`| `#f472b6` | Mystery Build blueprint shards (Rose Pink) |
| **Course: Python**| `--course-python` | `#299bf5` | Python Programming course identity (Sky Blue - distinct from Indigo!) |
| **Course: Data Sci**| `--course-datascience`| `#10b981`| Data Science course identity (Emerald Teal - distinct from Gems and Indigo!) |
| **Decorative Tint: Yellow**| `--tint-gold` | `#fef08a` | First Flight badge slot background, warm cards (visual variety) |
| **Decorative Tint: Green** | `--tint-green`| `#dcfce7` / `#bbf7d0` | Loop Voyager badge slot background, active pills (visual variety) |
| **Decorative Tint: Blue**  | `--tint-cyan` | `#bae6fd` | Bug Whisperer badge slot background, student info chips (visual variety) |
| **Decorative Tint: Teal**  | `--tint-teal` | `#ccfbf1` | Pandas Sleuth badge slot background, data chips (visual variety) |
| **Decorative Tint: Pink**  | `--tint-pink` | `#fbcfe8` | Mystery celebration cards, shard cards (visual variety) |
| **Decorative Tint: Purple**| `--tint-purple`| `#e9d5ff` | Notebook cell headers, soft lilac tint (visual variety) |

### 2.2 Border & Shadow Dimensional Hierarchy

| Scale Tier | Border Token | Width | Shadow Token | Offset | Applied Components |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Small (sm)** | `--border-sm` | `2.5px solid var(--ink)` | `--shadow-sm` | `0 3px 0 var(--shadow-color)` | HUD pills, status tags, toggle knobs, mini buttons |
| **Medium (md)**| `--border-md` | `3.5px solid var(--ink)` | `--shadow-md` | `0 5px 0 var(--shadow-color)` | Action buttons, dashboard course cards, cell blocks |
| **Large (lg)** | `--border-lg` | `4.5px solid var(--ink)` | `--shadow-lg` | `0 7px 0 var(--shadow-color)` | Master dashboard panels, modal dialogs, editor frames |

### 2.3 Typography

* **Display Font (`--font-display`):** `Lilita One`, cursive / sans-serif. Used for headers (`h1`–`h4`), big action buttons, score counters, and modal titles. Usually styled in uppercase with `letter-spacing: 0.03em`.
* **Body / UI Font (`--font-body`):** `Fredoka`, sans-serif (weights `500`, `600`, `700`). Used for navigation labels, table content, explanations, and metadata.
* **Code Font (`--font-mono`):** `JetBrains Mono`, `Fira Code`, monospace. Used for code editor areas, line numbers, terminal stdout/stderr, and dataframe cells.

---

## 3. Architecture & File Inventory

The template is organized across three primary web files and a curated assets directory:

```
c:\Users\ayans\OneDrive\Desktop\Sylabbi\python\app\
│
├── index.html                   # Master semantic HTML single-page template (2,161 lines)
├── design-system.css            # Complete design system tokens, classes, animations (1,135 lines)
├── app.js                       # Interactive controller: routing, state, runner, auth (1,438 lines)
├── SRS.html                     # Formal System Requirements Specification (reference)
├── chunky-cartoon-ui-style-guide.md # Style guide and visual tokens reference
├── UI_TEMPLATE_EXPLANATION.md   # This comprehensive architectural specification
│
├── asset/
│   ├── PNG/                     # Active production assets (normalized square/proportional)
│   └── PNG_original/            # Original raw 1414×2000 uncropped backups
│
└── assets                       # Windows directory junction pointing directly to asset/
```

---

## 4. Screen-by-Screen Detailed Walkthrough

The application acts as a client-side Single-Page Application (SPA). All screens reside in [`index.html`](file:///c:/Users/ayans/OneDrive/Desktop/Sylabbi/python/app/index.html) under distinct `<section>` tags. The controller function `showScreen(screenId)` in [`app.js`](file:///c:/Users/ayans/OneDrive/Desktop/Sylabbi/python/app/app.js) toggles visibility by adding/removing Tailwind's `.hidden` class.

### 4.1 Global Top Header Bar & HUD

```
+---------------------------------------------------------------------------------------------------------+
| [🚀 SKY EXPLORERS]  [🪙 1,450 +]  [💎 120 +]  [🚀 14/26 SHARDS]      [STUDENT | FACILITATOR | PARENT | ...] |
| [🏠 Dashboard] [💻 Code Studio] [📊 Data Notebook] [🎉 Test Modal]    [👤 Arjun P. | Grade 7 | COSMIC-FALCON]|
+---------------------------------------------------------------------------------------------------------+
```

* **Logo & Title:** Rocket brand icon (`rocket.png`) + "SKY EXPLORERS" in `Lilita One` with a Python/Data Science course tag.
* **HUD Gamified Currency Counters:**
  * **Coins Pill:** `<div class="hud-pill">` displaying `coin.png`, formatted balance `1,450`, and a tactile mini `+` button.
  * **Gems Pill:** Displays `gems.png`, formatted balance `120`, and a mini `+` button.
  * **Mystery Shard Pill:** Displays `tiltrocket.png` with progress `14/26 SHARDS`.
* **Persona / Role Navigation Bar (`#role-nav`):**
  * Allows immediate switching between all personas:
    * `STUDENT` $\rightarrow$ Activates student dashboard (`#screen-student-dash`).
    * `FACILITATOR` $\rightarrow$ Activates facilitator console (`#screen-facilitator`).
    * `PARENT` $\rightarrow$ Activates parent portal (`#screen-parent`).
    * `ADMIN / OPS` $\rightarrow$ Activates system operations dashboard (`#screen-admin`).
    * `AUTH (REQ-AUTH)` $\rightarrow$ Activates onboarding and login workflows (`#screen-auth`).
    * `DESIGN TOKENS` $\rightarrow$ Activates the visual token and UI showcase (`#screen-tokens`).
* **Active User Profile Chip:** Right-aligned card displaying student avatar (`av1.png` inside `.asset-avatar-circle-sm`), student name ("Arjun P."), school/grade ("Oakridge Int., Grade 7"), and active two-word secret code badge (`COSMIC-FALCON`).

---

### 4.2 Screen 1: Student Dashboard (`#screen-student-dash`)

* **Personalized Welcome Banner:**
  * Displays friendly cartoon greeting: *"WELCOME BACK, ARJUN!"*.
  * Progress summary: *"You've completed 13 missions so far! Today's mission is Flight Coordinates & Algorithmic Conditionals."*
  * High-priority tactile CTA: `LAUNCH SESSION 14 ▶` (instantly opens `screen-code-studio`).
* **Dual Course Progression Trackers (REQ-CRS):**
  1. **Python Programming Core:**
     * Course emblem: `Courseidentity1.png` (rocket snake).
     * Completion progress: 54% with animated green chunky progress bar.
     * Session Pacing Checklist:
       * *Session 13: Secret Cipher Algorithms* $\rightarrow$ Marked `DONE` with green badge.
       * *Session 14: Conditionals & Flight Coordinates* $\rightarrow$ Marked `ACTIVE NOW` with pulsing border.
       * *Session 15: Defensive Loops & Asteroid Dodging* $\rightarrow$ Marked `LOCKED BY FACILITATOR` with lock icon.
     * Tactile Action: `OPEN PYTHON STUDIO` button.
  2. **Data Science L1 (Applied Analytics):**
     * Course emblem: `courseIdentity2.png` (bar chart).
     * Completion progress: 25% with cyan chunky progress bar.
     * Cycle Checklist:
       * *Cycle 2: Dataset Cleaning & Inspection* $\rightarrow$ `DONE`.
       * *Cycle 3: Flight Data Detective with Pandas* $\rightarrow$ `ACTIVE NOW`.
       * *Cycle 4: Statistical Aggregations* $\rightarrow$ `LOCKED`.
     * Tactile Action: `OPEN DATA NOTEBOOK ▶` button.
* **Mystery Build 26-Session Continuous Saga Widget (REQ-CRS-02):**
  * Chunky card with purple badge `26-SESSION SAGA` and shard count `14 / 26`.
  * Title: *"AUTONOMOUS DRONE FLIGHT SIMULATOR"*.
  * Description: *"Every session unlocks an encrypted blueprint code shard into your `Mystery_Build.py` file."*
  * Tactile Action: `PREVIEW BLUEPRINT REVEAL ✨` opening the interactive blueprint modal (`#blueprintModal`).
* **Unlocked Badges Showcase & Trophy Shelf (REQ-CRS-01):**
  * Top bar with count *"4 Earned"* and an interactive `Toggle Shelf` button.
  * **Row 1 (Unlocked Named Badges):** 4 large `64×64px` candy cards with background tints harmonized with each medallion's baked-in color:
    * `BADGE1.png` (Yellow card `#fef08a`): *First Flight* (Gold rocket medallion).
    * `B2.png` (Soft green card `#dcfce7`): *Loop Voyager* (Lime green loop medallion).
    * `B3.png` (Soft cyan card `#bae6fd`): *Bug Whisperer* (Sky blue hunter medallion).
    * `B4.png` (Soft teal card `#ccfbf1`): *Pandas Sleuth* (Teal/emerald grid medallion).
  * **Row 2 (Upcoming Milestone Tier Medallions):** 4 smaller `48×48px` cards:
    * `B5.png`: Bronze Medallion (Milestone 20).
    * `b6.png`: Silver Medallion (Milestone 22).
    * `b7.png`: Gold Medallion (Milestone 24).
    * `b8.png`: Diamond Medallion (Milestone 26).
  * **Interactive Shelf Toggle (`toggleBadgeEmptyState()`):** Flips between the active badge grid and the zero-state empty wooden shelf (`shelve.png`) with motivational onboarding copy. Marked with `🧪 [DEV] Shelf`.
* **Facilitator Pacing Quick-Bar:** Real-time banner at bottom showing current cohort status (*Cohort Alpha — Oakridge International*) and quick unlock toggle.

---

### 4.3 Screen 2: Code Studio & Data Science Notebook (`#screen-code-studio`)

This screen houses two distinct development environments selectable via the top Course Switcher tabs:

#### Environment A: Python Single-File IDE (REQ-PY)
* **File Tab Selector:**
  * `Activity.py` (Active in-class coding challenge with starter code and test inputs).
  * `Homework.py` (Take-home mission with submission controls).
  * `Mystery_Build.py` (The accumulating 26-session Drone Flight Simulator codebase).
* **Pyodide WASM Runtime Loading State Overlay (`#pyodideLoadingState` - REQ-PY-01):**
  * Displays during initial 10-15MB WebAssembly download and package compilation (`numpy`, `pandas`, `matplotlib`).
  * Features flying rocket icon (`Courseidentity1.png`), animated progress bar, package checklist, and close action.
  * Controllable via the `🧪 [DEV] WASM LOAD` button in the editor toolbar.
* **Tactile Run / Stop Control Bar:**
  * **`▶ RUN CODE`:** Chunky green button (`#runCodeBtn`). On click, triggers execution, disables button, displays spinning status, and pipes output to terminal.
  * **`⏹ STOP`:** Chunky red button (`#stopCodeBtn`). Immediately interrupts execution.
  * **`🔄 RESET`:** Reverts editor contents to default starter code.
  * **`📤 SUBMIT HOMEWORK`:** Submits student code to facilitator review queue.
* **Code Editor Pane (`#codeEditor`):**
  * Dark ink background (`#1e293b`), monospace font (`JetBrains Mono`), line number gutter, and simulated active cursor.
* **Interactive Terminal Output Window (`#terminalOutput`):**
  * Terminal header with status pill (`🟢 Ready`, `🟡 Executing...`, `🔴 Runtime Error`).
  * Formatted output stream distinguishing standard output (white/cyan text) and standard error (red text).
  * **Interactive Virtual STDIN (`#terminalStdinContainer`):** When student code executes `input("Enter drone altitude: ")`, execution pauses and reveals an inline text input field with a tactile `ENTER` button. Submitting resumes execution with the entered value.
* **Socratic Hint Callout Widget (REQ-HINT-01 to 04):**
  * Located immediately adjacent to the terminal.
  * Uses friendly mascot poses: `pointleft.png` or `pointright.png` (never `angry.png`).
  * **Graduated Hint Progression:**
    1. *Level 1 (Nudge):* *"Notice line 14: what data type does `input()` return? Is it a number or a string?"*
    2. *Level 2 (Scaffold):* *"Try wrapping the input inside `int()` or `float()` like: `altitude = float(input(...))`."*
    3. *Level 3 (Reveal):* Full code comparison with an interactive `"Got It! Dismiss"` button.

#### Environment B: Data Science Notebook Environment (REQ-DS)
Implements a true discrete, cell-based computational layout (not a reskinned single-file editor):
* **Discrete Cell Block (`.notebook-cell-block`):**
  * Each cell is an independent chunky card containing its own code editor and pinned output.
  * **Cell Header:** Ink border chrome with execution counter (`[In: 1]`, `[In: 2]`), execution timing badge (*42ms*), and local per-cell `▶ RUN` button.
  * **Pinned Output Area:** Rendered directly below each individual code block:
    * **Dataframe Table View:** Styled HTML table with dark sticky header, column data type pills (`int64`, `float64`, `object`), zebra striped rows, and pagination controls (*Showing 1–5 of 150 rows*).
    * **Data Visualization View:** Mock SVG flight altitude chart with hover tooltips and export controls.
    * **Summary Statistics View:** Formatted summary text (`df.describe()`).
* **Notebook Actions:** Tactile `+ Add Code Cell` and `+ Add Markdown Cell` buttons at the bottom.

---

### 4.4 Screen 3: Facilitator Console (`#screen-facilitator`)

Designed as an adult-facing teacher cockpit while preserving the chunky candy UI aesthetic:
* **Cohort Header & Master Pacing Control:**
  * Title: *COHORT ALPHA — OAKRIDGE INTERNATIONAL (5 Students)*.
  * Master Lock Toggle: `UNLOCK SESSION 15 FOR COHORT 🔓` with live state toggle.
* **Live Student Roster Table (REQ-FAC-01):**
  * Standard table with thick ink borders and alternating rows.
  * **Student Column:** Displays circular centered astronaut avatar (`av1.png`–`av5.png`), full name, and grade.
  * **Live Status Column:** Color-coded status badges:
    * 🟢 *Active Now (Line 18)*
    * 🟡 *Idle >4m (Line 14)*
    * ⚪ *Not Started Today (Missed Class 13)*
  * **Current File Column:** Shows student's currently active file and line count (`Activity.py - 18 lines`).
  * **Homework Status Column:** Submitted, In Progress, or Not Started.
  * **Action Column:** `👁️ PEEK CODE` button.
* **Non-Intrusive Live Code Peek Drawer (`peekStudentCode(studentId)`):**
  * Clicking "PEEK CODE" opens a modal drawer displaying the student's live editor in real-time, allowing teachers to observe student typing without interrupting.
* **Homework Inline Commenting Tool (REQ-HW-03):**
  * Card interface displaying submitted code snippets from Arjun Patel and Rohan Kumar.
  * Facilitator feedback text input with `SEND` button.
  * Includes a `Toggle Empty` state showing `nohomework.png` when all submissions are reviewed.

---

### 4.5 Screen 4: Parent Portal (`#screen-parent`)

* **Weekly Learning Digest (REQ-PAR-01):**
  * Highlights concepts mastered: *Conditionals, Logical AND/OR, Boolean Expressions*.
  * Total coding time logged: *2 hrs 45 mins*.
  * Homework completion status: *100% Submitted*.
* **Drone Flight Simulator Milestone Tracker:**
  * Graphical shard tracker showing how many sessions their child has completed towards the 26-session continuous build.
* **Send Encouragement Widget:**
  * One-click encouragement cards (*"Great job on Session 14!"*, *"Proud of your loop logic!"*) that dispatch directly to the student's in-app notification tray.

---

### 4.6 Screen 5: Admin & System Operations Dashboard (`#screen-admin`)

* **System Health Monitor:** Real-time uptime stats, WebSocket connection counts, and latency graphs.
* **Browser Pyodide WASM Runtime Status:**
  * Tracks WebAssembly engine compilation status, indexedDB package cache hit rate, and memory allocation.
* **School Seat & Cohort Manager:**
  * License utilization for Oakridge International, DPS International, and affiliated schools.

---

### 4.7 Screen 6: Authentication & Onboarding Workflows (`#screen-auth`)

Implements the complete requirements for `REQ-AUTH-01` through `REQ-AUTH-05`:
1. **Cohort Setup & Secret Code Generation (`REQ-AUTH-01`):**
   * Facilitator or admin creates the student record at cohort setup: first name, grade, school, cohort. System generates a unique, memorable secret code (two-word phrase, e.g. `COSMIC-FALCON`) to avoid collisions.
2. **Student Login & Disambiguation (`REQ-AUTH-02`):**
   * Student logs in with first name + assigned secret code.
   * If duplicate first names collide across cohorts, the system triggers the **Disambiguation Modal** asking the student to pick their school and cohort (*Arjun Patel @ Oakridge Alpha* vs *Arjun Patel @ DPS Beta*).
3. **Facilitator & Admin Login (`REQ-AUTH-03`):**
   * Utilitarian email and password inputs with a secondary `Send Magic Link` action.
4. **Parent Account Onboarding & Code Link (`REQ-AUTH-04`):**
   * Step allowing guardians to link their student's two-word code to their parent account without searching student records directly.
5. **Minors' Data Privacy & Zero-PII Registration (`REQ-AUTH-05`):**
   * DPDP Act minors' data compliance: strictly first name, grade, and school are collected at registration. No surnames, email addresses, phone numbers, or student PII are ever required or stored.
   * *Auxiliary UX Flow:* Includes a **Forgot Secret Code** student recovery helper providing self-serve hints and a one-click notification to the classroom facilitator.

---

### 4.8 Screen 7: Design Tokens & Component Showcase (`#screen-tokens`)

A live interactive UI Kit showcasing all design elements in isolation:
* Color palette swatches with hex codes and CSS custom property names.
* Button variants across all colors (`gold`, `green`, `blue`, `pink`, `red`, `slate`).
* Hard drop shadow comparison (`sm`, `md`, `lg`).
* Circular avatar frame sizes (`asset-avatar-circle`, `asset-avatar-circle-sm`).
* Mascot emotional state matrix (`idlesmile`, `pointleft`, `pointright`, `shappy`, `angry`).

---

### 4.9 Modals & Dialogs

* **Session Complete Reward Celebration Modal (`#rewardModal` - REQ-REW):**
  * Triggerable anytime via the top bar `TEST REWARD MODAL` button.
  * Displays celebration mascot (`shappy.png`) alongside the tilted flying rocket (`tiltrocket.png`) running the floating keyframe animation `.rocket-fly-anim`.
  * Animated floating reward pills: `+50 COINS` and `+10 GEMS`.
  * Unlocked Mystery Build blueprint shard reveal card.
  * Tactile `AWESOME! CONTINUE ▶` dismiss button.
* **Blueprint Shard Reveal Modal (`#blueprintModal`):**
  * Visualizes the assembled drone blueprint grid showing collected shards vs locked shards.

---

## 5. Asset Integration & Graphic Normalization Standards

All assets reside in [`asset/PNG/`](file:///c:/Users/ayans/OneDrive/Desktop/Sylabbi/python/app/asset/PNG/) (accessible via the `assets/` junction).

### 5.1 Why Normalization Was Required
The raw exported assets were on uncropped `1414×2000` transparent canvases with drawings placed at disparate, uncentered coordinates. In pure CSS, `object-fit: contain` inside a square container letterboxed the canvas horizontally, causing visual drift, awkward clipping, and uneven borders.

### 5.2 Complete Asset Roster & Specifications

| Asset Name | Semantic Role | Canvas Dimensions | Normalization & Centering Specification |
| :--- | :--- | :--- | :--- |
| **`av1.png` – `av5.png`** | Student Avatars (Arjun, Maya, Rohan, Zara, Kabir) | `470×470` Square | Bounding box cropped; helmet centered at $(235, 195)$ with 45px top margin and symmetric collar margins. Fits inside `.asset-avatar-circle-sm` (32px) and `.asset-avatar-circle` (44px). |
| **`BADGE1.png`** | First Flight Badge | `461×461` Square | Medallion centered with 16px uniform padding. Placed in `.asset-badge-slot` (64px). |
| **`B2.png`** | Loop Voyager Badge | `394×394` Square | Medallion centered with 16px uniform padding. Placed in `.asset-badge-slot` (64px). |
| **`B3.png`** | Bug Whisperer Badge | `419×419` Square | Medallion centered with 16px uniform padding. Placed in `.asset-badge-slot` (64px). |
| **`B4.png`** | Pandas Sleuth Badge | `252×252` Square | Medallion centered with 16px uniform padding. Placed in `.asset-badge-slot` (64px). |
| **`B5.png` – `b8.png`** | Milestone Tier Medallions (Bronze, Silver, Gold, Diamond)| `~419×419` Square | Circular star medallion centered with 16px uniform padding. Placed in `.asset-badge-slot` (48px). |
| **`coin.png`** | Currency: Gold Coins | `491×491` Square | Fitted inside HUD currency pills and reward modals. |
| **`gems.png`** | Currency: Rare Gems | `560×560` Square | Fitted inside HUD currency pills and reward modals. |
| **`rocket.png`** | Mystery Build Rocket | `449×449` Square | Upright rocket for dashboard headers and login cards. |
| **`tiltrocket.png`** | Celebration / Shards | `407×407` Square | Tilted rocket used for HUD shards and celebration animation (`.rocket-fly-anim`). |
| **`Courseidentity1.png`** | Python Course Emblem | `345×345` Square | Rocket with green python snake mascot. |
| **`courseIdentity2.png`** | Data Science Course Emblem | `343×343` Square | Bar chart data visualizer emblem. |
| **`idlesmile.png`** | Mascot Resting Pose | `534×534` Square | Idle friendly mascot pose for dashboards and headers. |
| **`pointleft.png`** | Mascot Guiding Left | `572×572` Square | Socratic hint callouts pointing towards code lines. |
| **`pointright.png`** | Mascot Guiding Right| `623×623` Square | Socratic hint callouts pointing towards terminal errors. |
| **`angry.png`** | Mascot Error Pose | `497×497` Square | **System errors only** (connection failed, wrong code). Never near pedagogical hints. |
| **`shappy.png`** | Mascot Celebration | `543×543` Square | Session completion celebration and badge unlock modals. |
| **`blankNotebook.png`** | Notebook Illustration | `464×487` Fitted | Zero-state illustration for empty notebook cells. |
| **`nohomework.png`** | Homework Illustration| `464×444` Fitted | Zero-state illustration for empty facilitator review inbox. |
| **`shelve.png`** | Trophy Shelf Illustration| `1033×573` Wide | Zero-state illustration for empty trophy shelf. |

---

## 6. JavaScript State Machine & Controller (`app.js`)

[`app.js`](file:///c:/Users/ayans/OneDrive/Desktop/Sylabbi/python/app/app.js) manages all interactive mock behavior without requiring an active backend:

### 6.1 State Store Structure
```javascript
const appState = {
  currentRole: 'student',               // 'student' | 'facilitator' | 'parent' | 'admin'
  currentScreen: 'screen-student-dash', // active DOM section ID
  currentUser: {
    name: 'Arjun Patel',
    grade: 'Grade 7',
    cohort: 'Oakridge Cohort Alpha',
    code: 'COSMIC-FALCON',
    avatar: 'assets/PNG/av1.png',
    coins: 1450,
    gems: 120,
    shards: 14
  },
  cohortPacing: {
    currentSession: 14,
    session15Unlocked: false
  },
  activeFile: 'Activity.py',
  isExecuting: false
};
```

### 6.2 Key Functions & Event Handlers

| Function Name | Description & Side Effects |
| :--- | :--- |
| `showScreen(screenId)` | Hides all `<section>` elements by adding `.hidden` and removes `.hidden` from the target screen. Updates navigation active pills. |
| `switchRole(roleName)` | Updates `currentRole`, adjusts top bar controls, and switches to the default screen for that persona. |
| `runCode()` | Simulates Python code execution: shows spinning status on `#runCodeBtn`, clears terminal, logs execution steps, and reveals virtual STDIN if `input()` is detected. |
| `stopCode()` | Immediately halts execution, clears execution timers, and logs `KeyboardInterrupt` in red to the terminal. |
| `submitStdin(val)` | Resumes execution with the entered standard input value and displays it in the terminal output stream. |
| `showSocraticHint(tier)` | Transitions the Socratic hint widget through Level 1 (Nudge), Level 2 (Scaffold), and Level 3 (Reveal). Swaps mascot poses between `pointleft.png` and `pointright.png`. |
| `toggleSessionLock(sessionId)`| Toggles facilitator cohort lock on Session 15. Updates dashboard lock badges dynamically. |
| `peekStudentCode(studentId)` | Opens `#livePeekModal` displaying a read-only mirror of the student's current editor lines. |
| `toggleBadgeEmptyState()` | Toggles `#badgeGridActive` and `#badgeEmptyShelfState` (`shelve.png`). |
| `toggleHomeworkEmptyState()`| Toggles homework cards and empty inbox illustration (`nohomework.png`). |
| `triggerRewardModal()` | Opens `#rewardModal`, spawns floating currency gain animations (`+50 COINS`, `+10 GEMS`), and plays rocket celebration. |
| `handleStudentLogin()` | Validates student first name and secret code. If name is "Arjun", triggers `#disambiguationModal`. |
| `confirmDisambiguation(cohort)`| Resolves student collision, updates `currentUser`, and routes to `#screen-student-dash`. |

---

## 7. AI Developer Playbook & Integration Guide

When extending this codebase or transitioning it from a UI template into a fully functional product, follow these exact guidelines:

### 7.1 Integrating Client-Side Pyodide (WASM)
1. **Load Pyodide:** Add the Pyodide CDN script to `<head>`:
   ```html
   <script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>
   ```
2. **Initialize Worker:** Initialize Pyodide inside a Web Worker to keep the UI completely responsive during infinite loops:
   ```javascript
   const pyodideWorker = new Worker('pyodide-worker.js');
   ```
3. **Stream stdout/stderr:** Pipe stdout to `#terminalOutput` using `sys.stdout.write`.
4. **Interactive `input()`:** Implement standard input via `SharedArrayBuffer` or an async generator that pauses execution and focuses `#terminalStdinInput`.

### 7.2 Connecting Backend WebSockets (Micro-Pacing & Live Peek)
1. **Cohort Lock Synchronizer:** Subscribe student clients to a WebSocket topic:
   ```javascript
   // Listen for facilitator session unlock
   socket.on('cohort:pacing_update', (data) => {
     appState.cohortPacing.session15Unlocked = data.unlocked;
     updatePacingUI();
   });
   ```
2. **Live Keystroke Mirroring:** In `Activity.py` editor, emit debounced line diffs (`300ms`) so the Facilitator's `peekStudentCode()` drawer stays live.

### 7.3 Strict Architectural Invariants (What an AI Must NEVER Do)
* **NEVER add CSS blur filters to shadows:** Shadows must remain `box-shadow: 0 Npx 0 var(--shadow-color)`. Soft shadows break the candy UI aesthetic.
* **NEVER use gradients on cards or buttons:** All backgrounds must be solid opaque colors from the design tokens.
* **NEVER use `angry.png` near educational hints:** The Socratic hint widget must always feel welcoming and supportive (`pointleft.png`, `pointright.png`, `idlesmile.png`).
* **NEVER apply arbitrary CSS translations to normalized PNG assets:** All assets in `asset/PNG/` are already centered on square canvases. They should be sized using simple `width: 100%; height: 100%; object-fit: contain;` inside their containers.
