/**
 * Sky Explorers Unified LMS — Application Logic & Audio Engine
 * Chunky Cartoon / Candy UI Design System implementation
 */

// ============================================================================
// 1. WEB AUDIO API SYNTHESIZER (Tactile SFX)
// ============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  getContext() {
    if (!this.ctx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) this.ctx = new AudioClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  play(type = 'click') {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(340, ctx.currentTime);
        osc.frequency.setValueAtTime(170, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'coin') {
        [987, 1318].forEach((pitch, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const st = ctx.currentTime + (i * 0.07);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(pitch, st);
          gain.gain.setValueAtTime(0.18, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.24);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.24);
        });
      } else if (type === 'gem') {
        [1046, 1568, 2093].forEach((pitch, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const st = ctx.currentTime + (i * 0.05);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(pitch, st);
          gain.gain.setValueAtTime(0.15, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.26);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.26);
        });
      } else if (type === 'success' || type === 'celebrate') {
        [523.25, 659.25, 783.99, 1046.50].forEach((pitch, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const st = ctx.currentTime + (i * 0.09);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(pitch, st);
          gain.gain.setValueAtTime(0.2, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.35);
        });
      } else if (type === 'error' || type === 'blocked') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn('Audio SFX error:', e);
    }
  }
}

const sfx = new SoundEffects();

// ============================================================================
// 2. LMS STATE STORE
// ============================================================================
const LMS_STATE = {
  activeRole: 'student', // 'student' | 'facilitator' | 'parent' | 'admin'
  activeScreen: 'dashboard', // 'dashboard' | 'code-studio' | 'facilitator' | 'parent' | 'admin' | 'tokens'
  
  // Student Profile (REQ-AUTH-01 & REQ-AUTH-05: Minimal child info)
  student: {
    firstName: 'Arjun',
    grade: 7,
    school: 'Oakridge International',
    cohortId: 'py-oak-2026',
    secretCode: 'COSMIC-FALCON', // System generated 2-word code
    coins: 0,
    gems: 0,
    streakDays: 1,
    mysteryBuildFragments: 0,
    mysteryBuildTotal: 26,
    badges: [
      // No badges yet — earned after Session 1 completion
    ]
  },

  // Courses (SRS Section 1 & REQ-CRS)
  courses: {
    python: {
      id: 'python-core',
      title: 'Python Programming',
      subtitle: 'Code missions, algorithmic thinking & Mystery Build',
      currentSession: 1,
      totalSessions: 30,
      accentColor: 'var(--course-python)',
      sessions: [
        // No completed sessions yet
        { num: 1, title: 'What a Program Is, What Data Is & print()', status: 'in-progress' },
        { num: 2, title: 'Variables, Data Types & Operators', status: 'locked' },
        { num: 3, title: 'input(), f-strings & Indentation', status: 'locked' }
      ]
    },
    datascience: {
      id: 'datascience-l1',
      title: 'Data Science Level 1',
      subtitle: 'Datasets, Pandas analysis & Cycle 12 Showcase',
      currentCycle: 1,
      totalCycles: 12,
      accentColor: 'var(--candy-green)',
      sessions: [
        { num: 1, title: 'Introduction to Data & Datasets', status: 'in-progress' },
        { num: 2, title: 'Dataset Cleaning & Inspection', status: 'locked' },
        { num: 3, title: 'Exploratory Analysis with Pandas', status: 'locked' }
      ]
    }
  },

  // Code Studio Files (REQ-CRS-02 & REQ-PY-04)
  activeEditorCourse: 'python', // 'python' | 'datascience'
  activeFileTab: 'activity',   // 'activity' | 'homework' | 'mystery'
  
  files: {
    python: {
      activity: `# ============================================================
# Sky Explorers — Milestone 1, Session 1
# TOPIC: What a Program Is, What Data Is, What an Algorithm Is
# MINI CHALLENGE: Build your project's opening banner!
# ============================================================

# A program runs TOP TO BOTTOM, one line at a time.
# TASK: Write 3–5 print() lines to create an opening banner
# for YOUR project. Predict the order before you run!

# --- YOUR BANNER GOES BELOW THIS LINE ---

print("========================================")
print("  Welcome to My Sky Explorers Project!  ")
print("========================================")
print("  Version 1.0  |  Session 1  |  Ready!  ")
print("========================================")

# Try this: What happens if you move the last print() line
# to the TOP? Make a prediction, then re-run to check!
`,
      homework: `# ============================================================
# Homework — Mystery Build Piece 1
# TASK: Create YOUR mystery_build.py with one mysterious
# print() title line. This file grows every week!
# ============================================================

# INSTRUCTIONS:
# 1. Think of a cool, mysterious title for your project.
# 2. Use a single print() statement to display it.
# 3. Keep it secretive — your classmates will discover
#    what you're building piece by piece!

# YOUR CODE BELOW:
print("[ ??? ] A mysterious program is loading...")
print("        ... initiating ...")
print("        Stay tuned. The secret will be revealed.")
`,
      mystery: `# ============================================================
# MYSTERY BUILD — Piece 1 of 26
# This file is built up every session. Keep it safe!
# ============================================================

# Mystery Build Piece 1: The Opening Title Screen
# (More will be added each week — don't peek ahead!)

print("============================================")
print("   [ MYSTERY PROJECT — Piece 1 Loaded ]    ")
print("============================================")
print("   Shards assembled: 1 / 26               ")
print("============================================")
`
    },
    datascience: {
      activity: `# Data Science — Session 1: What is Data?
# In this first session we look at real-world data around us.

print("=== SKY EXPLORERS: DATA SCIENCE INTRODUCTION ===")
print()
print("Data is information collected about the world.")
print("An algorithm is a set of steps we apply to data.")
print()
print("Examples of data we will explore this course:")
print("  - Flight altitudes (numbers)")
print("  - Weather conditions (categories)")
print("  - Timestamps of drone launches (dates)")
print()
print("Every dataset has: INPUT -> PROCESS -> OUTPUT")
`,
      homework: `# Homework Cycle 1: Finding Data Around You
# Task: Write 3 print() statements naming 3 types of
# data you see in your everyday life and what you could
# do with each one (the algorithm / process).

# Example:
# print("Data: My daily step count -> Algorithm: Calculate weekly average")
`,
      mystery: `# Cycle 12 Showcase Accumulated Notebook Project
# Continuous portfolio artifact across cycles — Piece 1!
print("Data Science Mystery Build — Piece 1 of 12")
`
    }
  },

  // Socratic Hint Engine State (REQ-HINT-01 ~ 05)
  socratic: {
    scaffoldMilestone: 'm1_2', // 'm1_2' (Full) | 'm3_4' (Reduced) | 'm5' (Silent)
    visible: false,
    activeQuestion: '',
    targetLine: 7,
    idleTimer: null,
    idleDurationSeconds: 60,
    hasExecutedSinceEdit: false
  },

  // Facilitator Cohort State (REQ 3.7)
  facilitator: {
    cohortName: 'Cohort Alpha — Oakridge School',
    students: [
      { id: 's1', name: 'Arjun P.', grade: 7, status: 'active', currentLine: 8, homeworkStatus: 'Not Started', filePreview: 'Activity.py (8 lines)' },
      { id: 's2', name: 'Maya S.', grade: 8, status: 'active', currentLine: 5, homeworkStatus: 'Not Started', filePreview: 'Activity.py (5 lines)' },
      { id: 's3', name: 'Rohan K.', grade: 7, status: 'idle', currentLine: 3, homeworkStatus: 'Not Started', filePreview: 'Activity.py (3 lines)' },
      { id: 's4', name: 'Zara D.', grade: 7, status: 'not-started', currentLine: 0, homeworkStatus: 'Not Started', filePreview: 'No activity yet' },
      { id: 's5', name: 'Kabir V.', grade: 8, status: 'active', currentLine: 11, homeworkStatus: 'Not Started', filePreview: 'Activity.py (11 lines)' }
    ],
    nextSessionUnlocked: false
  }
};

// ============================================================================
// 3. CODE EXECUTION (Pyodide or Fast Sandboxed WASM Runner)
// ============================================================================
class PythonRunner {
  constructor() {
    this.pyodide = null;
    this.isLoading = false;
    this.isReady = false;
  }

  async init() {
    if (this.pyodide || this.isLoading) return;
    this.isLoading = true;
    try {
      if (window.loadPyodide) {
        this.pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        this.isReady = true;
        console.log("Pyodide WASM Runtime ready!");
        showToast("🐍 Python Pyodide Engine Ready!");
      }
    } catch (e) {
      console.warn("Pyodide CDN unavailable, running resilient client sandboxed interpreter:", e);
    } finally {
      this.isLoading = false;
    }
  }

  async run(code, onLineExec) {
    // If Pyodide is available, execute via Pyodide
    if (this.pyodide) {
      try {
        let stdout = [];
        this.pyodide.setStdout({
          batched: (str) => stdout.push(str)
        });
        const result = await this.pyodide.runPythonAsync(code);
        return {
          success: true,
          output: stdout.join("\n") + (result !== undefined && result !== null ? `\n=> ${result}` : ''),
          error: null
        };
      } catch (err) {
        return {
          success: false,
          output: '',
          error: err.message
        };
      }
    }

    // Resilient educational client simulation for rapid responsive execution
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          let output = [];
          
          // Check for deliberate syntax error in demonstration
          if (code.includes('print("Unclosed string')) {
            throw new Error('SyntaxError: EOL while scanning string literal (line 16)');
          }

          // Simple dynamic evaluation for Python math & prints
          const lines = code.split('\n');
          let currentTargetX = 45.0, currentTargetY = 60.0;
          let currentX = 12.5, currentY = 20.0;

          lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('print(')) {
              // Extract print contents
              const contentMatch = trimmed.match(/print\((.*)\)/);
              if (contentMatch) {
                let inner = contentMatch[1];
                if (inner.startsWith('f"') || inner.startsWith("f'")) {
                  // Approximate f-string output
                  inner = inner.substring(2, inner.length - 1);
                  inner = inner.replace('{distance:.2f}', '51.54');
                  inner = inner.replace('{test_alt}', '85');
                  inner = inner.replace('{avg_alt}', '2462.5');
                  inner = inner.replace('{validate_altitude(test_alt)}', 'SAFE_ALTITUDE');
                  output.push(inner);
                } else if (inner.startsWith('"') || inner.startsWith("'")) {
                  output.push(inner.substring(1, inner.length - 1));
                } else {
                  output.push(inner);
                }
              }
            }
          });

          if (output.length === 0) {
            output.push("🚀 Program executed successfully with 0 exit code.");
          }

          resolve({
            success: true,
            output: output.join('\n'),
            error: null
          });
        } catch (err) {
          resolve({
            success: false,
            output: '',
            error: err.toString()
          });
        }
      }, 250);
    });
  }
}

const runner = new PythonRunner();

// ============================================================================
// 4. UI CONTROLLER & EVENT HANDLERS
// ============================================================================

// Role Switcher
function switchRole(role) {
  sfx.play('click');
  LMS_STATE.activeRole = role;
  
  // Update Role Switcher UI
  document.querySelectorAll('.role-nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.role === role) btn.classList.add('active');
  });

  // Navigate to default view for role
  if (role === 'student') {
    navigateTo('dashboard');
  } else if (role === 'facilitator') {
    navigateTo('facilitator');
  } else if (role === 'parent') {
    navigateTo('parent');
  } else if (role === 'admin') {
    navigateTo('admin');
  }

  showToast(`Switched Role: ${role.toUpperCase()}`);
}

// Navigation between LMS screens
function navigateTo(screenId) {
  sfx.play('click');
  LMS_STATE.activeScreen = screenId;

  // Hide all screens
  const screens = ['screen-dashboard', 'screen-code-studio', 'screen-data-notebook', 'screen-facilitator', 'screen-parent', 'screen-admin', 'screen-tokens', 'screen-auth'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Show target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav tabs if on student screens
  const studioTab = document.getElementById('navTabStudio');
  const dashTab = document.getElementById('navTabDashboard');
  const dsTab = document.getElementById('navTabDataNotebook');
  
  [studioTab, dashTab, dsTab].forEach(t => {
    if (t) t.classList.remove('active', 'chunky-btn-gold', 'chunky-btn-blue', 'chunky-btn-green', 'chunky-btn-indigo', 'chunky-btn-python');
  });

  if (screenId === 'code-studio') {
    if (studioTab) studioTab.className = 'chunky-btn chunky-btn-sm chunky-btn-python';
    if (dashTab) dashTab.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
    if (dsTab) dsTab.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
  } else if (screenId === 'data-notebook') {
    if (dsTab) dsTab.className = 'chunky-btn chunky-btn-sm chunky-btn-green';
    if (dashTab) dashTab.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
    if (studioTab) studioTab.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
  } else if (screenId === 'dashboard') {
    if (dashTab) dashTab.className = 'chunky-btn chunky-btn-sm chunky-btn-indigo';
    if (studioTab) studioTab.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
    if (dsTab) dsTab.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
  }

  // If entering code studio, refresh editor
  if (screenId === 'code-studio') {
    renderEditorCode();
    resetSocraticIdleTimer();
  }
}

// Data Science Notebook Cell Execution Mock
function runNotebookCell(cellId) {
  sfx.play('click');
  const btn = document.getElementById(`btn-run-cell-${cellId}`);
  const statusBadge = document.getElementById(`status-cell-${cellId}`);

  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳ RUNNING...</span>';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.opacity = '1';
      sfx.play('coin');
      
      if (statusBadge) {
        statusBadge.innerText = 'Executed in 18ms';
        statusBadge.className = 'text-[11px] font-bold text-[#16a34a]';
      }

      showToast(`Cell [${cellId}] executed successfully!`);
    }, 400);
  }
}

// Add Cell Affordance handler
function addNotebookCell(type = 'code') {
  sfx.play('click');
  showToast(`+ Added new ${type.toUpperCase()} cell to notebook`);
  document.querySelectorAll('.notebook-code-surface').forEach(nbTextarea => {
    nbTextarea.removeEventListener('paste', handleEditorPaste);
    nbTextarea.addEventListener('paste', handleEditorPaste);
  });
}

// Switch Notebook File Tab (Activity vs Homework vs Showcase)
function switchNotebookTab(tabKey) {
  sfx.play('click');
  document.querySelectorAll('.ds-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.dstab === tabKey) btn.classList.add('active');
  });

  if (tabKey === 'showcase') {
    sfx.play('gem');
    showToast('🌟 Cycle 12 Showcase: Continuous portfolio notebook loaded!');
  } else if (tabKey === 'homework') {
    showToast('📝 Cycle 3 Homework: Telemetry filter challenge loaded');
  } else {
    showToast('📄 Cycle 3 Activity: Live session notebook loaded');
  }
}


// Switch Course in Code Studio
function setStudioCourse(courseKey) {
  sfx.play('click');
  LMS_STATE.activeEditorCourse = courseKey;
  
  const pyBtn = document.getElementById('studioCoursePython');
  const dsBtn = document.getElementById('studioCourseDS');
  if (courseKey === 'python') {
    if (pyBtn) pyBtn.className = 'chunky-btn chunky-btn-sm chunky-btn-python';
    if (dsBtn) dsBtn.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
  } else {
    if (pyBtn) pyBtn.className = 'chunky-btn chunky-btn-sm chunky-btn-slate';
    if (dsBtn) dsBtn.className = 'chunky-btn chunky-btn-sm chunky-btn-green';
  }

  renderEditorCode();
  showToast(`Loaded ${courseKey === 'python' ? 'Python Core' : 'Data Science L1'}`);
}

// Switch File Tab (Activity vs Homework vs Mystery Build)
function switchFileTab(tabKey) {
  sfx.play('click');
  LMS_STATE.activeFileTab = tabKey;

  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabKey) btn.classList.add('active');
  });

  renderEditorCode();

  if (tabKey === 'mystery') {
    sfx.play('gem');
    showToast('🔒 Mystery Build Fragment (Protected cross-session file)');
  }
}

// Render Code into textarea & line numbers
function renderEditorCode() {
  const course = LMS_STATE.activeEditorCourse;
  const tab = LMS_STATE.activeFileTab;
  const codeContent = LMS_STATE.files[course][tab] || '';
  
  const textarea = document.getElementById('codeEditorTextarea');
  const gutter = document.getElementById('codeGutter');
  
  if (textarea) {
    textarea.value = codeContent;
    updateLineNumbers();
  }
}

function updateLineNumbers() {
  const textarea = document.getElementById('codeEditorTextarea');
  const gutter = document.getElementById('codeGutter');
  if (!textarea || !gutter) return;

  const lines = textarea.value.split('\n');
  gutter.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
}

// ============================================================================
// 5. ANTI-PASTE PROTECTION & SOCRATIC HINTS (REQ-PY-07, REQ-PY-08, REQ-HINT)
// ============================================================================

// Intercept Pasting (REQ-PY-07)
function handleEditorPaste(e) {
  e.preventDefault();
  sfx.play('blocked');
  
  showToast('🚫 Pasting is disabled! Type code to build muscle memory (REQ-PY-07)');
  
  // Highlight snippet inserter
  const snippetBtn = document.getElementById('btnInsertSnippet');
  if (snippetBtn) {
    snippetBtn.classList.add('animate-pulse');
    setTimeout(() => snippetBtn.classList.remove('animate-pulse'), 1500);
  }
}

// Approved snippet inserter (REQ-PY-08)
function insertApprovedSnippet() {
  sfx.play('click');
  const textarea = document.getElementById('codeEditorTextarea');
  if (!textarea) return;

  const snippet = `\n# --- Inserted Mission Code Snippet ---\nprint("🛰️ Signal Locked: Coordinates Acquired!")\n`;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const prev = textarea.value;
  
  textarea.value = prev.substring(0, start) + snippet + prev.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
  textarea.focus();
  
  updateLineNumbers();
  handleCodeEdited();
  showToast('📥 Approved lesson snippet inserted directly!');
}

// Code edit tracking & 10s Socratic Idle Detection (REQ-HINT-01)
function handleCodeEdited() {
  const textarea = document.getElementById('codeEditorTextarea');
  if (!textarea) return;

  // Auto-save indication (REQ-PY-02)
  const course = LMS_STATE.activeEditorCourse;
  const tab = LMS_STATE.activeFileTab;
  LMS_STATE.files[course][tab] = textarea.value;
  
  const saveIndicator = document.getElementById('saveIndicatorText');
  if (saveIndicator) {
    saveIndicator.innerText = 'Saving...';
    setTimeout(() => {
      saveIndicator.innerText = '🟢 Cloud Synced';
    }, 400);
  }

  updateLineNumbers();
  LMS_STATE.socratic.hasExecutedSinceEdit = false;
  resetSocraticIdleTimer();
}

function resetSocraticIdleTimer() {
  if (LMS_STATE.socratic.idleTimer) {
    clearTimeout(LMS_STATE.socratic.idleTimer);
  }

  // If milestone is silent (peer testing milestone 5+), don't trigger hints
  if (LMS_STATE.socratic.scaffoldMilestone === 'm5') return;

  LMS_STATE.socratic.idleTimer = setTimeout(() => {
    triggerSocraticHint('idle');
  }, LMS_STATE.socratic.idleDurationSeconds * 1000);
}

// Trigger Socratic Callout (REQ-HINT-02 & REQ-HINT-05)
function triggerSocraticHint(reason = 'idle') {
  // Respect milestone scaffolding
  if (LMS_STATE.socratic.scaffoldMilestone === 'm5') return;

  const hintContainer = document.getElementById('socraticHintCallout');
  const questionEl = document.getElementById('socraticQuestionText');
  const milestoneTag = document.getElementById('socraticMilestoneTag');
  
  let question = '';
  if (reason === 'error') {
    question = 'Look at your print() statement on that line — what must always sit inside the parentheses for Python to display text? Are your quotation marks matched and complete?';
  } else {
    question = 'Before you run your code: look at the print() lines from top to bottom. Which line do you think will appear on screen FIRST — and why?';
  }

  if (questionEl) questionEl.innerText = question;
  if (milestoneTag) {
    milestoneTag.innerText = LMS_STATE.socratic.scaffoldMilestone === 'm1_2' 
      ? 'Milestone 1–2: Full Scaffold' 
      : 'Milestone 3–4: Faded Hint';
  }

  const mascotImg = document.getElementById('socraticMascotImg');
  if (mascotImg) mascotImg.src = 'assets/PNG/pointleft.png';

  if (hintContainer) {
    hintContainer.classList.remove('hidden');
    sfx.play('gem');
  }

  // Highlight the first print() line in gutter (line 19 in Session 1 activity)
  highlightCodeLine(19, 'hint');
}

function dismissSocraticHint() {
  sfx.play('click');
  const hintContainer = document.getElementById('socraticHintCallout');
  if (hintContainer) hintContainer.classList.add('hidden');
}

function setScaffoldMilestone(milestone) {
  sfx.play('click');
  LMS_STATE.socratic.scaffoldMilestone = milestone;
  
  document.querySelectorAll('.scaffold-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.milestone === milestone) btn.classList.add('active');
  });

  if (milestone === 'm5') {
    dismissSocraticHint();
    showToast('Peer Testing: Socratic Assistant is now SILENT');
  } else {
    showToast(`Scaffolding set to: ${milestone.toUpperCase()}`);
  }
}

// Line highlighting (REQ-PY-05)
function highlightCodeLine(lineNum, type = 'running') {
  const gutter = document.getElementById('codeGutter');
  if (!gutter) return;

  const lines = gutter.querySelectorAll('div');
  lines.forEach((el, idx) => {
    el.style.backgroundColor = 'transparent';
    el.style.color = 'var(--code-line-num)';
    el.style.fontWeight = '500';
    
    if (idx + 1 === lineNum) {
      if (type === 'error') {
        el.style.backgroundColor = 'var(--candy-red)';
        el.style.color = '#ffffff';
        el.style.fontWeight = '900';
      } else if (type === 'running') {
        el.style.backgroundColor = 'var(--candy-green)';
        el.style.color = '#ffffff';
        el.style.fontWeight = '900';
      } else {
        el.style.backgroundColor = 'var(--hint-accent-amber)';
        el.style.color = '#ffffff';
      }
    }
  });
}

// ============================================================================
// 6. RUN & STOP CONTROLS
// ============================================================================
let executionRunning = false;

async function executeCurrentCode() {
  if (executionRunning) return;
  sfx.play('click');
  
  const textarea = document.getElementById('codeEditorTextarea');
  const outputConsole = document.getElementById('consoleOutputText');
  const runBtn = document.getElementById('btnRunCode');
  const stopBtn = document.getElementById('btnStopCode');
  
  if (!textarea || !outputConsole) return;

  executionRunning = true;
  if (runBtn) {
    runBtn.classList.add('opacity-75');
    runBtn.innerHTML = '<span>⏳ RUNNING...</span>';
  }
  if (stopBtn) stopBtn.removeAttribute('disabled');

  outputConsole.innerText = '⚡ Initializing client-side Python execution...';
  
  // Highlight line 1 running cue
  highlightCodeLine(1, 'running');

  const result = await runner.run(textarea.value);
  
  executionRunning = false;
  if (runBtn) {
    runBtn.classList.remove('opacity-75');
    runBtn.innerHTML = '<span>▶ RUN</span>';
  }
  if (stopBtn) stopBtn.setAttribute('disabled', 'true');

  if (result.success) {
    sfx.play('success');
    outputConsole.innerText = result.output;
    highlightCodeLine(0); // clear
    showToast('Execution Finished: 0 Errors');
  } else {
    sfx.play('error');
    outputConsole.innerText = `Traceback (most recent call last):\n${result.error}`;
    highlightCodeLine(16, 'error'); // Highlight failing line
    
    // Trigger Socratic error hint (REQ-HINT-03)
    setTimeout(() => {
      triggerSocraticHint('error');
    }, 600);
  }
}

function stopExecution() {
  sfx.play('click');
  executionRunning = false;
  
  const runBtn = document.getElementById('btnRunCode');
  const stopBtn = document.getElementById('btnStopCode');
  const outputConsole = document.getElementById('consoleOutputText');

  if (runBtn) {
    runBtn.classList.remove('opacity-75');
    runBtn.innerHTML = '<span>▶ RUN</span>';
  }
  if (stopBtn) stopBtn.setAttribute('disabled', 'true');
  if (outputConsole) outputConsole.innerText += '\n\n⏹ Process terminated by student.';
  
  highlightCodeLine(0);
  showToast('Execution Stopped');
}

function triggerDeliberateSyntaxError() {
  sfx.play('click');
  const textarea = document.getElementById('codeEditorTextarea');
  if (!textarea) return;

  textarea.value += '\nprint("Unclosed string literal\n';
  updateLineNumbers();
  executeCurrentCode();
}

// ============================================================================
// 7. FACILITATOR DASHBOARD ACTIONS (REQ 3.7)
// ============================================================================

// Peek at student code (REQ 3.7)
function peekStudentCode(studentId) {
  sfx.play('click');
  const student = LMS_STATE.facilitator.students.find(s => s.id === studentId);
  if (!student) return;

  const modal = document.getElementById('peekCodeModal');
  const title = document.getElementById('peekStudentName');
  const preview = document.getElementById('peekCodeContent');
  
  if (title) title.innerText = `Live Peek: ${student.name} (${student.grade}th Grade) — Line ${student.currentLine}`;
  if (preview) {
    preview.innerText = `# Read-Only Facilitator View: ${student.name}'s Activity.py
# Last synced 4s ago | Live device: School Chromebook #14

target_x = 45.0
target_y = 60.0
current_x = 12.5
current_y = 20.0

dx = target_x - current_x
dy = target_y - current_y

# Student is currently typing here:
distance = (dx ** 2 + dy ** 2) ** 0.5
print("Altitude check passed")
`;
  }

  if (modal) modal.classList.remove('hidden');
}

function closePeekModal() {
  sfx.play('click');
  const modal = document.getElementById('peekCodeModal');
  if (modal) modal.classList.add('hidden');
}

// Unlock Next Session for Entire Cohort (REQ-CRS-03)
function toggleCohortSessionUnlock() {
  sfx.play('coin');
  LMS_STATE.facilitator.nextSessionUnlocked = !LMS_STATE.facilitator.nextSessionUnlocked;
  
  const statusBadge = document.getElementById('cohortUnlockStatusBadge');
  const unlockBtn = document.getElementById('btnCohortUnlock');

  if (LMS_STATE.facilitator.nextSessionUnlocked) {
    if (statusBadge) {
      statusBadge.innerText = 'SESSION 15 UNLOCKED FOR COHORT';
      statusBadge.className = 'hud-badge bg-[#6fc624] text-white';
    }
    if (unlockBtn) unlockBtn.innerText = 'LOCK SESSION 15';
    showToast('🔓 Session 15 unlocked for all students in Cohort Alpha!');
  } else {
    if (statusBadge) {
      statusBadge.innerText = 'SESSION 15 LOCKED';
      statusBadge.className = 'hud-badge bg-[#f14343] text-white';
    }
    if (unlockBtn) unlockBtn.innerText = 'UNLOCK SESSION 15 FOR COHORT';
    showToast('🔒 Session 15 locked for Cohort Alpha');
  }
}

// Reopen locked session for missed class student (REQ 3.7)
function reopenForStudent(name) {
  sfx.play('click');
  showToast(`Reopened previous session for ${name}`);
}

// Save Inline Homework Comment (REQ-HW-03)
function saveHomeworkComment(studentName) {
  sfx.play('coin');
  const input = document.getElementById(`hw-comment-${studentName.replace(/\s+/g, '')}`);
  const text = input ? input.value : 'Great modular structure!';
  showToast(`Inline comment saved for ${studentName}: "${text}"`);
}

// ============================================================================
// 8. REWARD & MYSTERY BUILD CELEBRATION MODAL
// ============================================================================

function openSessionCompleteModal() {
  sfx.play('celebrate');
  const modal = document.getElementById('sessionCompleteModal');
  if (modal) modal.classList.remove('hidden');

  // Reward increment
  addCurrency('coins', 150);
  addCurrency('gems', 10);
  LMS_STATE.student.mysteryBuildFragments = Math.min(26, LMS_STATE.student.mysteryBuildFragments + 1);
  
  const countEl = document.getElementById('mysteryFragmentCount');
  if (countEl) countEl.innerText = `${LMS_STATE.student.mysteryBuildFragments}/26`;
}

function closeSessionCompleteModal() {
  sfx.play('click');
  const modal = document.getElementById('sessionCompleteModal');
  if (modal) modal.classList.add('hidden');
}

// Currency HUD logic
function addCurrency(type, amount) {
  if (type === 'coins') {
    LMS_STATE.student.coins += amount;
    const el = document.getElementById('hudCoinsAmount');
    if (el) el.innerText = LMS_STATE.student.coins.toLocaleString();
    spawnFloatingReward(`+${amount} COINS`, 'assets/PNG/coin.png', 'var(--candy-gold-deep)');
  } else if (type === 'gems') {
    LMS_STATE.student.gems += amount;
    const el = document.getElementById('hudGemsAmount');
    if (el) el.innerText = LMS_STATE.student.gems.toLocaleString();
    spawnFloatingReward(`+${amount} GEMS`, 'assets/PNG/gems.png', 'var(--currency-gem)');
  }
}

function spawnFloatingReward(text, iconSrc, color) {
  const el = document.createElement('div');
  el.className = 'fixed z-50 pointer-events-none font-display text-2xl drop-shadow-[0_2.5px_0_#18202d] float-currency-text flex items-center gap-2';
  el.style.color = color;
  el.style.left = '45%';
  el.style.top = '14%';
  el.innerHTML = `<span>${text}</span><div class="asset-box w-7 h-7 inline-block align-middle"><img src="${iconSrc}" class="asset-img" alt=""></div>`;
  document.body.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 950);
}

// Empty State Toggles (Visual Template Inspection)
function toggleBadgeEmptyState() {
  sfx.play('click');
  const active = document.getElementById('badgeGridActive');
  const empty = document.getElementById('badgeEmptyShelfState');
  if (active && empty) {
    const isCurrentlyEmpty = !empty.classList.contains('hidden');
    if (isCurrentlyEmpty) {
      empty.classList.add('hidden');
      active.classList.remove('hidden');
      showToast('Badges Trophy Showcase Active');
    } else {
      empty.classList.remove('hidden');
      active.classList.add('hidden');
      showToast('Empty Trophy Shelf State (shelve.png)');
    }
  }
}

function toggleNotebookEmptyState() {
  sfx.play('click');
  const zeroState = document.getElementById('notebookZeroCellsState');
  if (zeroState) {
    const isHidden = zeroState.classList.contains('hidden');
    if (isHidden) {
      zeroState.classList.remove('hidden');
      showToast('Zero-Cells Empty State Active (blankNotebook.png)');
    } else {
      zeroState.classList.add('hidden');
      showToast('Standard Cell Architecture Active');
    }
  }
}

function toggleHomeworkEmptyState() {
  sfx.play('click');
  const active = document.getElementById('hwSubmissionsActive');
  const empty = document.getElementById('noHomeworkQueueState');
  if (active && empty) {
    const isCurrentlyEmpty = !empty.classList.contains('hidden');
    if (isCurrentlyEmpty) {
      empty.classList.add('hidden');
      active.classList.remove('hidden');
      showToast('Submissions Review Queue Active');
    } else {
      empty.classList.remove('hidden');
      active.classList.add('hidden');
      showToast('No-Homework Empty State (nohomework.png)');
    }
  }
}

// Toast notification helper
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('lmsToast');
  if (!toast) return;

  const msgSpan = toast.querySelector('span');
  if (msgSpan) msgSpan.innerText = message;
  
  toast.classList.remove('hidden-toast');
  if (toastTimer) clearTimeout(toastTimer);
  
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden-toast');
  }, 2200);
}

// ============================================================================
// 9. INITIALIZATION
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Pyodide in background
  runner.init();

  // Setup textarea listener
  const textarea = document.getElementById('codeEditorTextarea');
  if (textarea) {
    textarea.addEventListener('input', handleCodeEdited);
    textarea.addEventListener('paste', handleEditorPaste);
    textarea.addEventListener('keydown', (e) => {
      // Allow tab key indentation inside code editor
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        updateLineNumbers();
        handleCodeEdited();
      }
    });
  }

  // Intercept paste in all Data Science Notebook cells (REQ-PY-07)
  document.querySelectorAll('.notebook-code-surface').forEach(nbTextarea => {
    nbTextarea.addEventListener('paste', handleEditorPaste);
  });

  // Keyboard accessibility for Datasets drawer header (Enter / Space to toggle)
  const dsToggle = document.getElementById('datasetsToggleBtn');
  if (dsToggle) {
    dsToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDatasetsDrawer();
      }
    });
  }

  // Initial code render
  renderEditorCode();

  // Audio unlock on first click
  document.addEventListener('click', () => {
    sfx.getContext();
  }, { once: true });
});

// ============================================================================
// 10. AUTHENTICATION & ONBOARDING CONTROLLERS (REQ-AUTH-01 ~ 05)
// ============================================================================

// Switch between Auth sub-tabs
function switchAuthTab(tabId) {
  sfx.play('click');
  const tabs = ['student-login', 'admin-login', 'create-student', 'parent-link'];
  tabs.forEach(t => {
    const pane = document.getElementById(`auth-pane-${t}`);
    const btn = document.getElementById(`auth-tab-btn-${t}`);
    if (pane) pane.classList.add('hidden');
    if (btn) btn.classList.remove('active');
  });

  const activePane = document.getElementById(`auth-pane-${tabId}`);
  const activeBtn = document.getElementById(`auth-tab-btn-${tabId}`);
  if (activePane) activePane.classList.remove('hidden');
  if (activeBtn) activeBtn.classList.add('active');
}

// Student Login Handler (REQ-AUTH-02)
function handleStudentLogin() {
  const nameInput = document.getElementById('studentLoginFirstName');
  const codeInput = document.getElementById('studentLoginSecretCode');
  const errorBox = document.getElementById('studentLoginError');
  const disambiguationBox = document.getElementById('studentDisambiguationBox');

  const name = nameInput ? nameInput.value.trim() : '';
  const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

  // Clear previous states
  if (errorBox) errorBox.classList.add('hidden');
  if (nameInput) nameInput.classList.remove('input-error');
  if (codeInput) codeInput.classList.remove('input-error');

  // Basic empty validation
  if (!name) {
    showAuthError(errorBox, nameInput, 'Please enter your first name.');
    return;
  }
  if (!code) {
    showAuthError(errorBox, codeInput, 'Please enter your two-word secret code (e.g. COSMIC-FALCON).');
    return;
  }

  // Check for disambiguation case (e.g. name is "Arjun" and disambiguation not yet picked)
  if (name.toLowerCase() === 'arjun' && !LMS_STATE.studentDisambiguated) {
    sfx.play('error');
    if (disambiguationBox) disambiguationBox.classList.remove('hidden');
    showToast('Multiple students named Arjun found — please pick your cohort below.');
    return;
  }

  // Validate Code format (must have hyphen or match valid)
  if (code !== 'COSMIC-FALCON' && code !== 'NEBULA-TIGER' && code !== 'STAR-ORBIT') {
    showAuthError(errorBox, codeInput, 'Unrecognized secret code. Please ask your facilitator for your two-word code.');
    return;
  }

  // Success
  sfx.play('coin');
  showToast(`Welcome back, ${name}! Launching your missions...`);
  setTimeout(() => {
    switchRole('student');
    navigateTo('dashboard');
  }, 450);
}

function showAuthError(box, input, message) {
  sfx.play('blocked');
  if (box) {
    box.querySelector('span:last-child').innerText = message;
    box.classList.remove('hidden');
  }
  if (input) {
    input.classList.add('input-error');
    input.focus();
  }
}

// Simulate Disambiguation Follow-Up Step (REQ-AUTH-02)
function simulateStudentDisambiguation() {
  sfx.play('click');
  const nameInput = document.getElementById('studentLoginFirstName');
  const codeInput = document.getElementById('studentLoginSecretCode');
  const disambiguationBox = document.getElementById('studentDisambiguationBox');
  const errorBox = document.getElementById('studentLoginError');

  if (nameInput) nameInput.value = 'Arjun';
  if (codeInput) codeInput.value = 'COSMIC-FALCON';
  if (errorBox) errorBox.classList.add('hidden');
  if (disambiguationBox) disambiguationBox.classList.remove('hidden');

  LMS_STATE.studentDisambiguated = false;
  showToast('Simulating: 2 matching Arjuns found in database');
}

// Pick Disambiguated Student Cohort
function resolveDisambiguation(cohortKey) {
  sfx.play('coin');
  LMS_STATE.studentDisambiguated = true;
  
  document.querySelectorAll('.disambiguation-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`disambiguation-${cohortKey}`);
  if (card) card.classList.add('selected');

  const disambiguationBox = document.getElementById('studentDisambiguationBox');
  if (disambiguationBox) {
    setTimeout(() => {
      disambiguationBox.classList.add('hidden');
      showToast(`Confirmed: Arjun Patel (${cohortKey === 'alpha' ? 'Oakridge Cohort Alpha' : 'DPS Cohort Beta'})`);
      switchRole('student');
      navigateTo('dashboard');
    }, 400);
  }
}

// Simulate Wrong Code / Error State
function simulateStudentLoginError(type = 'wrong-code') {
  sfx.play('blocked');
  const nameInput = document.getElementById('studentLoginFirstName');
  const codeInput = document.getElementById('studentLoginSecretCode');
  const errorBox = document.getElementById('studentLoginError');
  const disambiguationBox = document.getElementById('studentDisambiguationBox');

  if (disambiguationBox) disambiguationBox.classList.add('hidden');
  if (nameInput) nameInput.value = 'Arjun';
  
  if (type === 'wrong-code') {
    if (codeInput) codeInput.value = 'INVALID-WORD';
    showAuthError(errorBox, codeInput, 'Invalid secret code for Arjun. Please ask your facilitator for your pass card.');
  } else if (type === 'not-found') {
    if (nameInput) nameInput.value = 'UnknownStudent';
    if (codeInput) codeInput.value = 'COSMIC-FALCON';
    showAuthError(errorBox, nameInput, 'No student record found for "UnknownStudent". Facilitator must create your account first.');
  }
}

// Facilitator / Admin Login Handler (REQ-AUTH-03)
function handleFacilitatorLoginSubmit() {
  const email = document.getElementById('facLoginEmail');
  const pass = document.getElementById('facLoginPassword');
  const errorBox = document.getElementById('facLoginError');

  if (errorBox) errorBox.classList.add('hidden');

  if (!email || !email.value || !email.value.includes('@')) {
    showAuthError(errorBox, email, 'Please enter a valid facilitator email address.');
    return;
  }
  if (!pass || !pass.value) {
    showAuthError(errorBox, pass, 'Please enter your password.');
    return;
  }

  sfx.play('coin');
  showToast(`Facilitator Authenticated: ${email.value}`);
  setTimeout(() => {
    switchRole('facilitator');
    navigateTo('facilitator');
  }, 400);
}

function handleFacilitatorMagicLink() {
  const email = document.getElementById('facLoginEmail');
  const errorBox = document.getElementById('facLoginError');

  if (!email || !email.value || !email.value.includes('@')) {
    showAuthError(errorBox, email, 'Please enter your email above before requesting a Magic Link.');
    return;
  }

  sfx.play('gem');
  showToast(`✉️ One-click Magic Link sent to ${email.value}! Check your inbox.`);
}

// Facilitator Create Student Handler (REQ-AUTH-01 & REQ-AUTH-05)
function handleCreateStudentSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('newStudentFirstName');
  const gradeInput = document.getElementById('newStudentGrade');
  const schoolInput = document.getElementById('newStudentSchool');
  const cohortInput = document.getElementById('newStudentCohort');
  const errorBox = document.getElementById('createStudentError');
  const ticketBox = document.getElementById('createdStudentTicket');

  if (errorBox) errorBox.classList.add('hidden');

  const firstName = nameInput ? nameInput.value.trim() : '';
  const grade = gradeInput ? gradeInput.value : '';
  const school = schoolInput ? schoolInput.value : '';
  const cohort = cohortInput ? cohortInput.value : '';

  if (!firstName) {
    showAuthError(errorBox, nameInput, 'Please provide the student’s first name.');
    return;
  }

  // Curated memorable system-generated two-word phrases (REQ-AUTH-01)
  const codePool = ['NEBULA-TIGER', 'STAR-ORBIT', 'COSMIC-VIPER', 'SOLAR-PHOENIX', 'ASTRO-BADGER', 'LUNAR-FALCON'];
  const generatedCode = codePool[Math.floor(Math.random() * codePool.length)];

  sfx.play('celebrate');

  // Display confirmation ticket
  if (ticketBox) {
    document.getElementById('ticketStudentName').innerText = firstName;
    document.getElementById('ticketStudentDetails').innerText = `${grade} • ${school} (${cohort})`;
    document.getElementById('ticketSecretCode').innerText = generatedCode;
    ticketBox.classList.remove('hidden');
    ticketBox.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Student created! Unique secret code generated: ${generatedCode}`);
}

function copyGeneratedSecretCode() {
  const code = document.getElementById('ticketSecretCode').innerText;
  navigator.clipboard.writeText(code).then(() => {
    sfx.play('coin');
    showToast(`📋 Copied code "${code}" to clipboard!`);
  }).catch(() => {
    showToast(`Code: ${code}`);
  });
}

function printStudentPassSlip() {
  sfx.play('click');
  showToast('🖨️ Opening print pass preview for classroom handout...');
}

// Parent Link Account Handler (REQ-AUTH-04)
function handleParentLinkSubmit() {
  const codeInput = document.getElementById('parentLinkCode');
  const errorBox = document.getElementById('parentLinkError');
  const confirmBox = document.getElementById('parentLinkConfirmBox');

  const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

  if (errorBox) errorBox.classList.add('hidden');
  if (confirmBox) confirmBox.classList.add('hidden');

  if (!code) {
    showAuthError(errorBox, codeInput, 'Please enter the link code shared by the school.');
    return;
  }

  // Simulated valid code
  if (code !== 'SE-PAR-9041' && code !== 'SE-PAR-8820') {
    showAuthError(errorBox, codeInput, 'Code not recognized or already claimed. Please check with your school facilitator.');
    return;
  }

  sfx.play('coin');
  if (confirmBox) confirmBox.classList.remove('hidden');
  showToast('Child record matched! Please verify details below.');
}

function confirmParentLink() {
  sfx.play('celebrate');
  showToast('Linked Arjun Patel to parent account successfully!');
  setTimeout(() => {
    switchRole('parent');
    navigateTo('parent');
  }, 400);
}

// ============================================================================
// Pyodide WASM First-Load Simulation (REQ-PY-01)
// ============================================================================
let pyodideLoadInterval = null;

function simulatePyodideLoad() {
  const overlay = document.getElementById('pyodideLoadingState');
  const bar = document.getElementById('pyodideProgressBar');
  const pctText = document.getElementById('pyodidePercentText');
  if (!overlay || !bar) return;

  if (pyodideLoadInterval) clearInterval(pyodideLoadInterval);

  overlay.classList.remove('hidden');
  bar.style.width = '12%';
  if (pctText) pctText.innerText = '12%';

  let progress = 12;
  pyodideLoadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 16) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(pyodideLoadInterval);
      pyodideLoadInterval = null;
      bar.style.width = '100%';
      if (pctText) pctText.innerText = '100% Ready';
      sfx.play('celebrate');
      setTimeout(() => {
        overlay.classList.add('hidden');
        showToast('🚀 Python WASM Engine Initialized & Cached in Browser (REQ-PY-01)!');
      }, 700);
    } else {
      bar.style.width = progress + '%';
      if (pctText) pctText.innerText = progress + '%';
    }
  }, 220);
}

function closePyodideLoad() {
  if (pyodideLoadInterval) {
    clearInterval(pyodideLoadInterval);
    pyodideLoadInterval = null;
  }
  const overlay = document.getElementById('pyodideLoadingState');
  if (overlay) overlay.classList.add('hidden');
  showToast('Pyodide loading overlay dismissed.');
}

// ============================================================================
// 12. DATASETS PANEL & VIRTUAL FILESYSTEM (REQ-DS-05)
// ============================================================================

const MOCK_DATASETS = {
  'telemetry_cycle3.csv': {
    filename: 'telemetry_cycle3.csv',
    cycle: 'Cycle 3: Aviation Weather & Flight Telemetry',
    meta: '150 rows × 5 columns • 12.4 KB • Virtual FS Mounted',
    columns: ['idx', 'timestamp', 'corridor_id', 'wind_speed_knots', 'altitude_m', 'hazard_level'],
    rows: [
      ['0', '08:00:15', 'North Ridge', '14.2', '3,850', 'Low'],
      ['1', '08:00:45', 'East Pass', '28.6', '4,120', 'High'],
      ['2', '08:01:20', 'South Basin', '18.4', '3,650', 'Moderate'],
      ['3', '08:01:55', 'West Summit', '32.1', '4,400', 'High'],
      ['4', '08:02:30', 'North Ridge', '12.8', '3,800', 'Low']
    ]
  },
  'wind_hazards_corridors.csv': {
    filename: 'wind_hazards_corridors.csv',
    cycle: 'Cycle 3: Corridor Sensor Stream',
    meta: '48 rows × 4 columns • 4.8 KB • Virtual FS Mounted',
    columns: ['idx', 'corridor_code', 'max_safe_speed', 'gust_tolerance', 'zone_type'],
    rows: [
      ['0', 'NR-01', '20.0', '25.5', 'Alpine Pass'],
      ['1', 'EP-04', '15.0', '18.0', 'Canyon Vent'],
      ['2', 'SB-02', '22.5', '30.0', 'Open Valley'],
      ['3', 'WS-07', '14.0', '16.5', 'High Elevation'],
      ['4', 'NR-02', '20.0', '25.5', 'Alpine Pass']
    ]
  }
};

let activePreviewedFilename = 'telemetry_cycle3.csv';
let vfsMountInterval = null;

// Toggle Collapsible Datasets Drawer
function toggleDatasetsDrawer(forceOpen = null) {
  sfx.play('click');
  const drawerContent = document.getElementById('datasetsDrawerContent');
  const toggleBtn = document.getElementById('datasetsToggleBtn');
  const chevronText = document.getElementById('datasetsChevronText');
  const chevronIcon = document.getElementById('datasetsChevronIcon');
  if (!drawerContent) return;

  const isCurrentlyCollapsed = drawerContent.classList.contains('collapsed');
  const shouldOpen = forceOpen !== null ? forceOpen : isCurrentlyCollapsed;

  if (shouldOpen) {
    drawerContent.classList.remove('collapsed');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    if (chevronText) chevronText.innerText = 'HIDE DATASETS';
    if (chevronIcon) chevronIcon.innerText = '▲';
  } else {
    drawerContent.classList.add('collapsed');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    if (chevronText) chevronText.innerText = 'SHOW DATASETS';
    if (chevronIcon) chevronIcon.innerText = '▼';
  }
}

// Switch between the 3 panel states (Normal, Empty, Loading)
function setDatasetsPanelState(state) {
  sfx.play('click');
  const normalView = document.getElementById('datasetsViewNormal');
  const emptyView = document.getElementById('datasetsViewEmpty');
  const loadingView = document.getElementById('datasetsViewLoading');
  const statusBadge = document.getElementById('datasetsVfsStatusBadge');
  const countBadge = document.getElementById('datasetsCountBadge');

  if (vfsMountInterval) {
    clearInterval(vfsMountInterval);
    vfsMountInterval = null;
  }

  // Ensure drawer is open when changing state
  toggleDatasetsDrawer(true);

  if (state === 'empty') {
    if (normalView) normalView.classList.add('hidden');
    if (emptyView) emptyView.classList.remove('hidden');
    if (loadingView) loadingView.classList.add('hidden');
    if (statusBadge) {
      statusBadge.innerText = '⚪ No Datasets';
      statusBadge.className = 'hud-badge bg-[#fee2e2] text-[#991b1b] text-xs';
    }
    if (countBadge) {
      countBadge.innerText = '0 DATASETS';
      countBadge.className = 'hud-badge bg-[#fee2e2] text-[#991b1b] text-xs font-bold';
    }
    showToast('📭 Template State: Zero Datasets loaded for this cycle');
  } else if (state === 'loading') {
    if (normalView) normalView.classList.add('hidden');
    if (emptyView) emptyView.classList.add('hidden');
    if (loadingView) loadingView.classList.remove('hidden');
    if (statusBadge) {
      statusBadge.innerText = '⏳ Mounting VFS...';
      statusBadge.className = 'hud-badge bg-[#fef9c3] text-[#854d0e] text-xs';
    }
    if (countBadge) {
      countBadge.innerText = 'MOUNTING...';
      countBadge.className = 'hud-badge bg-[#fef9c3] text-[#854d0e] text-xs font-bold';
    }

    // Animate progress bar from 35% to 100%
    const bar = document.getElementById('vfsMountProgressBar');
    const pct = document.getElementById('vfsMountPercent');
    let progress = 35;
    if (bar) bar.style.width = '35%';
    if (pct) pct.innerText = '35%';

    vfsMountInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(vfsMountInterval);
        vfsMountInterval = null;
        if (bar) bar.style.width = '100%';
        if (pct) pct.innerText = '100% Ready';
        sfx.play('celebrate');
        setTimeout(() => {
          setDatasetsPanelState('normal');
          showToast('🟢 Virtual Filesystem: Datasets mounted and ready for analysis!');
        }, 600);
      } else {
        if (bar) bar.style.width = progress + '%';
        if (pct) pct.innerText = progress + '%';
      }
    }, 220);

    showToast('⏳ Simulating Virtual Filesystem dataset mounting...');
  } else {
    // Normal state
    if (normalView) normalView.classList.remove('hidden');
    if (emptyView) emptyView.classList.add('hidden');
    if (loadingView) loadingView.classList.add('hidden');
    if (statusBadge) {
      statusBadge.innerText = '🟢 Preloaded in Memory';
      statusBadge.className = 'hud-badge bg-[#dcfce7] text-[#15803d] text-xs';
    }
    if (countBadge) {
      countBadge.innerText = '2 AVAILABLE • 1 LOCKED';
      countBadge.className = 'hud-badge bg-[#eff6ff] text-[#1e40af] text-xs font-bold';
    }
    showToast('✅ Template State: Normal (Active & Locked datasets available)');
  }
}

// Trigger Missing Dataset Error State (Socratic Hint Callout with pointleft.png)
function triggerMissingDatasetError() {
  sfx.play('blocked');
  const hintCallout = document.getElementById('notebookSocraticHintCallout');
  const mascotImg = document.getElementById('notebookSocraticMascotImg');
  
  if (mascotImg) mascotImg.src = 'assets/PNG/pointleft.png';
  if (hintCallout) {
    hintCallout.classList.remove('hidden');
    hintCallout.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  showToast('🔍 Socratic Guide activated: Missing file reference detected!');
}

function dismissNotebookSocraticHint() {
  sfx.play('click');
  const hintCallout = document.getElementById('notebookSocraticHintCallout');
  if (hintCallout) hintCallout.classList.add('hidden');
}

// Preview Dataset Modal
function previewDataset(filename) {
  sfx.play('click');
  const ds = MOCK_DATASETS[filename] || MOCK_DATASETS['telemetry_cycle3.csv'];
  activePreviewedFilename = ds.filename;

  const modal = document.getElementById('datasetPreviewModal');
  const nameEl = document.getElementById('previewDatasetFilename');
  const cycleEl = document.getElementById('previewDatasetCycle');
  const metaEl = document.getElementById('previewDatasetMeta');
  const container = document.getElementById('previewDataFrameContainer');

  if (nameEl) nameEl.innerText = ds.filename;
  if (cycleEl) cycleEl.innerText = ds.cycle;
  if (metaEl) metaEl.innerText = ds.meta;

  if (container) {
    let headerHtml = '<tr><th class="idx-col">#</th>';
    ds.columns.forEach(col => {
      if (col !== 'idx') headerHtml += `<th>${col}</th>`;
    });
    headerHtml += '</tr>';

    let bodyHtml = '';
    ds.rows.forEach((row, i) => {
      bodyHtml += '<tr>';
      bodyHtml += `<td class="idx-col">${row[0]}</td>`;
      for (let j = 1; j < row.length; j++) {
        bodyHtml += `<td>${row[j]}</td>`;
      }
      bodyHtml += '</tr>';
    });

    container.innerHTML = `
      <table class="chunky-dataframe">
        <thead>${headerHtml}</thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;
  }

  if (modal) modal.classList.remove('hidden');
}

function closeDatasetPreviewModal() {
  sfx.play('click');
  const modal = document.getElementById('datasetPreviewModal');
  if (modal) modal.classList.add('hidden');
}

function insertDatasetLoadCodeFromModal() {
  closeDatasetPreviewModal();
  insertDatasetLoadCode(activePreviewedFilename);
}

// Internal Code Insertion (REQ-PY-08 / No OS Clipboard)
function insertDatasetLoadCode(filename = 'telemetry_cycle3.csv') {
  sfx.play('coin');

  // Find active notebook cell or first code surface
  const activeBlock = document.querySelector('.notebook-cell-block.active-cell');
  let targetTextarea = activeBlock ? activeBlock.querySelector('.notebook-code-surface') : null;
  if (!targetTextarea) {
    targetTextarea = document.querySelector('.notebook-code-surface');
  }

  const loadStatement = `df = pd.read_csv("${filename}")`;

  if (targetTextarea) {
    const val = targetTextarea.value;
    const start = targetTextarea.selectionStart;
    const end = targetTextarea.selectionEnd;

    // Insert at cursor or prepend below imports
    let newVal;
    if (start !== undefined && end !== undefined && start !== end) {
      newVal = val.substring(0, start) + loadStatement + val.substring(end);
    } else {
      newVal = val + `\n# --- Loaded from Datasets Panel (VFS) ---\n${loadStatement}\n`;
    }

    targetTextarea.value = newVal;
    targetTextarea.focus();
    
    // Visual flash highlight on the cell
    const cellBlock = targetTextarea.closest('.notebook-cell-block');
    if (cellBlock) {
      cellBlock.classList.add('ring-4', 'ring-[#6fc624]', 'transition-all');
      setTimeout(() => {
        cellBlock.classList.remove('ring-4', 'ring-[#6fc624]', 'transition-all');
      }, 1200);
      cellBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  showToast(`📥 Inserted load code: ${loadStatement}`);
}


