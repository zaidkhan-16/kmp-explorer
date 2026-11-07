/**
 * KMP Explorer — Interactive Learning Lab
 * Complete JavaScript implementation for all interactive features.
 * No external dependencies. Pure vanilla JS.
 */

(function () {
  "use strict";

  /* ================================================================
   *  UTILITY: Compute LPS Array (actual KMP preprocessing)
   * ================================================================ */
  function computeLPS(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let length = 0;
    let i = 1;
    while (i < m) {
      if (pattern[i] === pattern[length]) {
        length++;
        lps[i] = length;
        i++;
      } else if (length !== 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
    return lps;
  }

  /* ================================================================
   *  UTILITY: Full KMP Search (returns matches + comparison count)
   * ================================================================ */
  function kmpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    if (m === 0) return { matches: [], comparisons: 0 };
    const lps = computeLPS(pattern);
    let i = 0, j = 0;
    const matches = [];
    let comparisons = 0;
    while (i < n) {
      comparisons++;
      if (text[i] === pattern[j]) {
        i++;
        j++;
      } else {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
      if (j === m) {
        matches.push(i - j);
        j = lps[j - 1];
      }
    }
    return { matches, comparisons, lps };
  }

  /* ================================================================
   *  UTILITY: Create a character cell div
   * ================================================================ */
  function createCell(text, extraClass) {
    const div = document.createElement("div");
    div.className = "cell" + (extraClass ? " " + extraClass : "");
    div.textContent = text;
    return div;
  }

  /* ================================================================
   *  1. NAVIGATION & SCROLL TRACKING
   * ================================================================ */
  const mainNav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navAnchors = document.querySelectorAll(".nav-link");

  // Smooth scroll on nav link clicks
  navAnchors.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      // Close mobile menu
      if (mainNav) mainNav.classList.remove("nav-open");
    });
  });

  // Mobile hamburger toggle
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("nav-open");
    });
  }

  // Shrink nav on scroll
  window.addEventListener("scroll", function () {
    if (!mainNav) return;
    if (window.scrollY > 100) {
      mainNav.classList.add("scrolled");
    } else {
      mainNav.classList.remove("scrolled");
    }
  });

  // Highlight active nav link via IntersectionObserver
  const sections = document.querySelectorAll("section[data-index]");
  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const idx = entry.target.getAttribute("data-index");
          navAnchors.forEach(function (a) {
            a.classList.toggle(
              "active",
              a.getAttribute("data-section") === idx
            );
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  sections.forEach(function (sec) {
    navObserver.observe(sec);
  });

  /* ================================================================
   *  2. PROGRESS TRACKING
   * ================================================================ */
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const completionSection = document.getElementById("completion");
  const visitedSections = new Set();

  const progressObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const idx = entry.target.getAttribute("data-index");
          if (idx && !visitedSections.has(idx)) {
            visitedSections.add(idx);
            updateProgress();
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach(function (sec) {
    progressObserver.observe(sec);
  });

  function updateProgress() {
    const count = visitedSections.size;
    const total = 8;
    const pct = (count / total) * 100;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.textContent = count + " / " + total;
    if (count >= total && completionSection) {
      completionSection.style.display = "block";
      const stats = document.getElementById("completion-stats");
      if (stats && timerSeconds > 0) {
        const m = Math.floor(timerSeconds / 60);
        const s = timerSeconds % 60;
        stats.innerHTML =
          '<p>⏱ Total learning time: <strong>' +
          pad(m) + ":" + pad(s) +
          "</strong></p>";
      }
    }
  }

  /* ================================================================
   *  3. LEARNING TIMER
   * ================================================================ */
  const timerEl = document.getElementById("learning-timer");
  const timerTextEl = document.getElementById("timer-text");
  let timerSeconds = 0;
  let timerInterval = null;
  let timerStarted = false;

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    timerInterval = setInterval(function () {
      timerSeconds++;
      if (timerTextEl) {
        const m = Math.floor(timerSeconds / 60);
        const s = timerSeconds % 60;
        timerTextEl.textContent = pad(m) + ":" + pad(s);
      }
    }, 1000);
  }

  // Start timer when user scrolls past the hero
  const heroEl = document.getElementById("hero");
  if (heroEl) {
    const heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            startTimer();
            if (timerEl) timerEl.style.display = "block";
          }
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroEl);
  }

  /* ================================================================
   *  4. NAIVE VS KMP COMPARISON DEMO (Section 1)
   * ================================================================ */
  const DEMO_TEXT = "ABABDABACDABABCABAB";
  const DEMO_PATTERN = "ABABCABAB";

  const naiveTextRow = document.getElementById("naive-text-row");
  const naivePatternRow = document.getElementById("naive-pattern-row");
  const naiveCompCount = document.getElementById("naive-comp-count");
  const kmpTextRow = document.getElementById("kmp-text-row");
  const kmpPatternRow = document.getElementById("kmp-pattern-row");
  const kmpCompCount = document.getElementById("kmp-comp-count");
  const naiveKmpPlayBtn = document.getElementById("naive-kmp-play");
  const naiveKmpResetBtn = document.getElementById("naive-kmp-reset");

  let naiveKmpAnimating = false;

  function initDemoRows() {
    if (!naiveTextRow) return;
    naiveTextRow.innerHTML = "";
    naivePatternRow.innerHTML = "";
    kmpTextRow.innerHTML = "";
    kmpPatternRow.innerHTML = "";

    for (let i = 0; i < DEMO_TEXT.length; i++) {
      naiveTextRow.appendChild(createCell(DEMO_TEXT[i], "cell-unprocessed"));
      kmpTextRow.appendChild(createCell(DEMO_TEXT[i], "cell-unprocessed"));
    }
    // Pattern rows: initially empty (fill with blanks to match text length)
    for (let i = 0; i < DEMO_TEXT.length; i++) {
      naivePatternRow.appendChild(createCell("", "cell-empty"));
      kmpPatternRow.appendChild(createCell("", "cell-empty"));
    }
    if (naiveCompCount) naiveCompCount.textContent = "0";
    if (kmpCompCount) kmpCompCount.textContent = "0";
  }

  // Pre-compute naive steps
  function computeNaiveSteps(text, pattern) {
    const steps = [];
    const n = text.length, m = pattern.length;
    let comparisons = 0;
    for (let s = 0; s <= n - m; s++) {
      let j = 0;
      while (j < m) {
        comparisons++;
        const match = text[s + j] === pattern[j];
        steps.push({
          offset: s,
          j: j,
          textIdx: s + j,
          match: match,
          comparisons: comparisons,
          found: match && j === m - 1,
        });
        if (!match) break;
        j++;
      }
    }
    return steps;
  }

  // Pre-compute KMP steps for the demo
  function computeKMPDemoSteps(text, pattern) {
    const steps = [];
    const n = text.length, m = pattern.length;
    const lps = computeLPS(pattern);
    let i = 0, j = 0, comparisons = 0;
    while (i < n) {
      comparisons++;
      const match = text[i] === pattern[j];
      steps.push({
        offset: i - j,
        j: j,
        i: i,
        textIdx: i,
        match: match,
        comparisons: comparisons,
        found: match && j === m - 1,
      });
      if (match) {
        i++;
        j++;
      } else {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
      if (j === m) {
        j = lps[j - 1];
      }
    }
    return steps;
  }

  function renderDemoStep(textRow, patternRow, text, pattern, step) {
    const cells = textRow.children;
    const pCells = patternRow.children;
    // Clear
    for (let k = 0; k < text.length; k++) {
      cells[k].className = "cell cell-unprocessed";
      pCells[k].className = "cell cell-empty";
      pCells[k].textContent = "";
    }
    // Place pattern at offset
    for (let k = 0; k < pattern.length; k++) {
      if (step.offset + k < text.length) {
        pCells[step.offset + k].textContent = pattern[k];
        pCells[step.offset + k].className = "cell cell-unprocessed";
      }
    }
    // Color matched chars before current
    for (let k = 0; k < step.j; k++) {
      if (step.offset + k < text.length) {
        cells[step.offset + k].className = "cell cell-match";
        pCells[step.offset + k].className = "cell cell-match";
      }
    }
    // Current comparison
    if (step.textIdx < text.length) {
      if (step.match) {
        cells[step.textIdx].className = "cell cell-match";
        pCells[step.textIdx].className = "cell cell-match";
      } else {
        cells[step.textIdx].className = "cell cell-mismatch";
        pCells[step.textIdx].className = "cell cell-mismatch";
      }
    }
  }

  async function playNaiveKmpDemo() {
    if (naiveKmpAnimating) return;
    naiveKmpAnimating = true;
    initDemoRows();

    const naiveSteps = computeNaiveSteps(DEMO_TEXT, DEMO_PATTERN);
    const kmpSteps = computeKMPDemoSteps(DEMO_TEXT, DEMO_PATTERN);

    const maxSteps = Math.max(naiveSteps.length, kmpSteps.length);
    let nIdx = 0, kIdx = 0;

    for (let tick = 0; tick < maxSteps; tick++) {
      if (!naiveKmpAnimating) break;

      if (nIdx < naiveSteps.length) {
        renderDemoStep(
          naiveTextRow, naivePatternRow,
          DEMO_TEXT, DEMO_PATTERN,
          naiveSteps[nIdx]
        );
        naiveCompCount.textContent = naiveSteps[nIdx].comparisons;
        nIdx++;
      }

      if (kIdx < kmpSteps.length) {
        renderDemoStep(
          kmpTextRow, kmpPatternRow,
          DEMO_TEXT, DEMO_PATTERN,
          kmpSteps[kIdx]
        );
        kmpCompCount.textContent = kmpSteps[kIdx].comparisons;
        kIdx++;
      }

      await new Promise(function (r) { setTimeout(r, 180); });
    }

    // Continue remaining steps
    while (nIdx < naiveSteps.length && naiveKmpAnimating) {
      renderDemoStep(
        naiveTextRow, naivePatternRow,
        DEMO_TEXT, DEMO_PATTERN,
        naiveSteps[nIdx]
      );
      naiveCompCount.textContent = naiveSteps[nIdx].comparisons;
      nIdx++;
      await new Promise(function (r) { setTimeout(r, 180); });
    }

    while (kIdx < kmpSteps.length && naiveKmpAnimating) {
      renderDemoStep(
        kmpTextRow, kmpPatternRow,
        DEMO_TEXT, DEMO_PATTERN,
        kmpSteps[kIdx]
      );
      kmpCompCount.textContent = kmpSteps[kIdx].comparisons;
      kIdx++;
      await new Promise(function (r) { setTimeout(r, 180); });
    }

    naiveKmpAnimating = false;
  }

  if (naiveKmpPlayBtn) {
    naiveKmpPlayBtn.addEventListener("click", playNaiveKmpDemo);
  }
  if (naiveKmpResetBtn) {
    naiveKmpResetBtn.addEventListener("click", function () {
      naiveKmpAnimating = false;
      initDemoRows();
    });
  }

  initDemoRows();

  /* ================================================================
   *  5. INTERACTIVE LPS BUILDER (Section 2)
   * ================================================================ */
  const LPS_PATTERN = "ABABCABAB";
  const LPS_VALUES = computeLPS(LPS_PATTERN); // [0,0,1,2,0,1,2,3,4]
  const lpsPatternRow = document.getElementById("lps-pattern-row");
  const lpsValueRow = document.getElementById("lps-value-row");
  const lpsExplanationBox = document.getElementById("lps-explanation-box");
  let lpsActiveIndex = -1;

  function initLPSBuilder() {
    if (!lpsPatternRow || !lpsValueRow) return;
    lpsPatternRow.innerHTML = "";
    lpsValueRow.innerHTML = "";

    for (let i = 0; i < LPS_PATTERN.length; i++) {
      const cell = createCell(LPS_PATTERN[i]);
      cell.setAttribute("data-idx", i);
      cell.style.cursor = "pointer";
      cell.addEventListener("click", function () {
        handleLPSClick(parseInt(this.getAttribute("data-idx")));
      });
      lpsPatternRow.appendChild(cell);

      const valCell = createCell(LPS_VALUES[i]);
      lpsValueRow.appendChild(valCell);
    }
  }

  function handleLPSClick(idx) {
    lpsActiveIndex = idx;
    // Clear all highlights
    const pCells = lpsPatternRow.children;
    for (let k = 0; k < pCells.length; k++) {
      pCells[k].className = "cell";
    }
    // Highlight clicked
    pCells[idx].classList.add("cell-current");

    const lpsVal = LPS_VALUES[idx];

    // Highlight prefix (0..lpsVal-1)
    for (let k = 0; k < lpsVal; k++) {
      pCells[k].classList.add("cell-highlight-prefix");
    }
    // Highlight suffix (idx - lpsVal + 1 .. idx)
    for (let k = idx - lpsVal + 1; k <= idx; k++) {
      if (k >= 0 && k < pCells.length) {
        pCells[k].classList.add("cell-highlight-suffix");
      }
    }

    // Build explanation
    const substring = LPS_PATTERN.substring(0, idx + 1);
    let html = '<h4>Substring: <code>"' + substring + '"</code></h4>';

    if (idx === 0) {
      html += "<p>A single character has no proper prefix or suffix, so <strong>LPS[0] = 0</strong>.</p>";
    } else {
      // List proper prefixes and suffixes
      const prefixes = [];
      const suffixes = [];
      for (let len = 1; len < substring.length; len++) {
        prefixes.push('"' + substring.substring(0, len) + '"');
      }
      for (let len = 1; len < substring.length; len++) {
        suffixes.push('"' + substring.substring(substring.length - len) + '"');
      }

      html += "<p><strong>Proper prefixes:</strong> " + prefixes.join(", ") + "</p>";
      html += "<p><strong>Proper suffixes:</strong> " + suffixes.join(", ") + "</p>";

      if (lpsVal === 0) {
        html +=
          "<p>No proper prefix matches any proper suffix, so <strong>LPS[" + idx + "] = 0</strong>.</p>";
      } else {
        const matchStr = substring.substring(0, lpsVal);
        html +=
          '<p>The longest proper prefix that is also a suffix is <code>"' +
          matchStr + '"</code> (length ' + lpsVal + ").</p>";
        html +=
          "<p>Therefore, <strong>LPS[" + idx + "] = " + lpsVal + "</strong>.</p>";
      }
    }

    if (lpsExplanationBox) lpsExplanationBox.innerHTML = html;
  }

  initLPSBuilder();

  /* ================================================================
   *  6. LPS STEP-THROUGH CONSTRUCTION (Section 2)
   * ================================================================ */
  const lpsStepperDisplay = document.getElementById("lps-stepper-display");
  const lpsStepperVars = document.getElementById("lps-stepper-vars");
  const lpsStepperExplanation = document.getElementById("lps-stepper-explanation");
  const lpsStepPrevBtn = document.getElementById("lps-step-prev");
  const lpsStepNextBtn = document.getElementById("lps-step-next");
  const lpsStepResetBtn = document.getElementById("lps-step-reset");

  const STEPPER_PATTERN = "ABABCABAB";
  let lpsSteps = [];
  let lpsStepIndex = 0;

  function computeLPSSteps(pattern) {
    const steps = [];
    const m = pattern.length;
    const lps = new Array(m).fill(0);

    // Initial state
    steps.push({
      i: 1,
      length: 0,
      lps: lps.slice(),
      explanation: "Initialize: LPS[0] = 0 (single character). Set i = 1, length = 0.",
      highlightI: -1,
      highlightLen: -1,
      action: "init",
    });

    let length = 0;
    let i = 1;

    while (i < m) {
      if (pattern[i] === pattern[length]) {
        // Match
        length++;
        lps[i] = length;
        steps.push({
          i: i,
          length: length,
          lps: lps.slice(),
          explanation:
            'Compare pattern[' + i + ']="' + pattern[i] + '" with pattern[' + (length - 1) + ']="' + pattern[length - 1] +
            '" → Match! Increment length to ' + length + '. Set LPS[' + i + '] = ' + length + '.',
          highlightI: i,
          highlightLen: length - 1,
          action: "match",
        });
        i++;
      } else if (length !== 0) {
        // Mismatch with fallback
        const oldLength = length;
        length = lps[length - 1];
        steps.push({
          i: i,
          length: length,
          lps: lps.slice(),
          explanation:
            'Compare pattern[' + i + ']="' + pattern[i] + '" with pattern[' + oldLength + ']="' + pattern[oldLength] +
            '" → Mismatch! length ≠ 0, so fall back: length = LPS[' + (oldLength - 1) + '] = ' + length + '. Retry without advancing i.',
          highlightI: i,
          highlightLen: oldLength,
          action: "fallback",
        });
      } else {
        // Mismatch, length == 0
        lps[i] = 0;
        steps.push({
          i: i,
          length: 0,
          lps: lps.slice(),
          explanation:
            'Compare pattern[' + i + ']="' + pattern[i] + '" with pattern[0]="' + pattern[0] +
            '" → Mismatch! length = 0, so LPS[' + i + '] = 0. Advance i.',
          highlightI: i,
          highlightLen: 0,
          action: "zero",
        });
        i++;
      }
    }

    // Final state
    steps.push({
      i: m,
      length: length,
      lps: lps.slice(),
      explanation: "LPS construction complete! Final LPS array: [" + lps.join(", ") + "]",
      highlightI: -1,
      highlightLen: -1,
      action: "done",
    });

    return steps;
  }

  function renderLPSStep() {
    if (!lpsStepperDisplay) return;
    const step = lpsSteps[lpsStepIndex];

    // Build display: pattern cells + LPS cells below
    let html = '<div class="stepper-pattern-row">';
    for (let k = 0; k < STEPPER_PATTERN.length; k++) {
      let cls = "cell";
      if (k === step.highlightI) cls += " cell-current";
      if (k === step.highlightLen && step.action !== "init" && step.action !== "done") cls += " cell-highlight-prefix";
      html += '<div class="' + cls + '">' + STEPPER_PATTERN[k] + "</div>";
    }
    html += "</div>";

    html += '<div class="stepper-lps-row">';
    for (let k = 0; k < STEPPER_PATTERN.length; k++) {
      const val = step.lps[k] !== undefined ? step.lps[k] : "-";
      let cls = "cell";
      if (k === step.highlightI && step.action === "match") cls += " cell-match";
      html += '<div class="' + cls + '">' + val + "</div>";
    }
    html += "</div>";

    lpsStepperDisplay.innerHTML = html;

    if (lpsStepperVars) {
      lpsStepperVars.innerHTML =
        '<span class="var-chip"><strong>i</strong> = ' + step.i + "</span>" +
        '<span class="var-chip"><strong>length</strong> = ' + step.length + "</span>" +
        '<span class="var-chip"><strong>LPS</strong> = [' + step.lps.join(", ") + "]</span>";
    }

    if (lpsStepperExplanation) {
      lpsStepperExplanation.textContent = step.explanation;
    }

    // Enable/disable buttons
    if (lpsStepPrevBtn) lpsStepPrevBtn.disabled = lpsStepIndex <= 0;
    if (lpsStepNextBtn) lpsStepNextBtn.disabled = lpsStepIndex >= lpsSteps.length - 1;
  }

  lpsSteps = computeLPSSteps(STEPPER_PATTERN);

  if (lpsStepNextBtn) {
    lpsStepNextBtn.addEventListener("click", function () {
      if (lpsStepIndex < lpsSteps.length - 1) {
        lpsStepIndex++;
        renderLPSStep();
      }
    });
  }
  if (lpsStepPrevBtn) {
    lpsStepPrevBtn.addEventListener("click", function () {
      if (lpsStepIndex > 0) {
        lpsStepIndex--;
        renderLPSStep();
      }
    });
  }
  if (lpsStepResetBtn) {
    lpsStepResetBtn.addEventListener("click", function () {
      lpsStepIndex = 0;
      renderLPSStep();
    });
  }

  renderLPSStep();

  /* ================================================================
   *  7. KMP VISUALIZATION ENGINE (Section 3) — MAIN FEATURE
   * ================================================================ */
  const VIZ_TEXT = "ABABDABACDABABCABAB";
  const VIZ_PATTERN = "ABABCABAB";
  const VIZ_LPS = computeLPS(VIZ_PATTERN); // [0,0,1,2,0,1,2,3,4]

  const vizIndexRow = document.getElementById("viz-index-row");
  const vizTextRow = document.getElementById("viz-text-row");
  const vizPatternRow = document.getElementById("viz-pattern-row");
  const vizLpsRow = document.getElementById("viz-lps-row");
  const vizIEl = document.getElementById("viz-i");
  const vizJEl = document.getElementById("viz-j");
  const vizComparisonsEl = document.getElementById("viz-comparisons");
  const vizMatchesEl = document.getElementById("viz-matches");
  const vizExplanation = document.getElementById("viz-explanation");
  const vizNextBtn = document.getElementById("viz-next");
  const vizPrevBtn = document.getElementById("viz-prev");
  const vizAutoBtn = document.getElementById("viz-auto");
  const vizResetBtn = document.getElementById("viz-reset");
  const vizSpeedInput = document.getElementById("viz-speed");
  const vizSpeedLabel = document.getElementById("viz-speed-label");
  const vizResultsDiv = document.getElementById("viz-results");
  const vizResultIndices = document.getElementById("viz-result-indices");
  const vizResultComparisons = document.getElementById("viz-result-comparisons");

  let vizSteps = [];
  let vizStepIndex = -1; // -1 = initial state before first step
  let vizAutoInterval = null;
  let vizAutoPlaying = false;

  /**
   * Pre-compute all KMP search steps for the visualization.
   * Each step captures the complete state needed to render the display.
   */
  function computeVizSteps(text, pattern, lps) {
    const steps = [];
    const n = text.length, m = pattern.length;
    let i = 0, j = 0, comparisons = 0;
    const matchesFound = [];

    while (i < n) {
      comparisons++;
      const isMatch = text[i] === pattern[j];
      const offset = i - j;

      let explanation = "";
      let action = "";

      if (isMatch) {
        explanation =
          "Comparing text[" + i + "]='" + text[i] + "' with pattern[" + j + "]='" + pattern[j] + "' → Match! Advance both pointers.";
        action = "advance-both";
      } else {
        if (j !== 0) {
          explanation =
            "Comparing text[" + i + "]='" + text[i] + "' with pattern[" + j + "]='" + pattern[j] +
            "' → Mismatch! Instead of restarting, KMP uses LPS[" + (j - 1) + "] = " + lps[j - 1] +
            " and shifts the pattern intelligently.";
          action = "fallback";
        } else {
          explanation =
            "Comparing text[" + i + "]='" + text[i] + "' with pattern[0]='" + pattern[0] +
            "' → Mismatch at first character. Move to next position in text.";
          action = "advance-i";
        }
      }

      steps.push({
        i: i,
        j: j,
        offset: offset,
        isMatch: isMatch,
        action: action,
        explanation: explanation,
        comparisons: comparisons,
        matchesFound: matchesFound.slice(),
        foundNow: false,
      });

      if (isMatch) {
        i++;
        j++;
      } else {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }

      if (j === m) {
        matchesFound.push(i - m);
        // Add a "found" step
        steps.push({
          i: i,
          j: j,
          offset: i - m,
          isMatch: true,
          action: "found",
          explanation: "🎉 Pattern found at index " + (i - m) + "! Using LPS[" + (m - 1) + "] = " + lps[m - 1] + " to continue searching.",
          comparisons: comparisons,
          matchesFound: matchesFound.slice(),
          foundNow: true,
          foundOffset: i - m,
        });
        j = lps[j - 1];
      }
    }

    return steps;
  }

  function initVizDisplay(text, pattern, lps, indexRow, textRow, patternRow, lpsDisplayRow) {
    if (indexRow) {
      indexRow.innerHTML = "";
      for (let k = 0; k < text.length; k++) {
        indexRow.appendChild(createCell(k, "cell-index"));
      }
    }
    if (textRow) {
      textRow.innerHTML = "";
      for (let k = 0; k < text.length; k++) {
        textRow.appendChild(createCell(text[k], "cell-unprocessed"));
      }
    }
    if (patternRow) {
      patternRow.innerHTML = "";
      for (let k = 0; k < text.length; k++) {
        patternRow.appendChild(createCell("", "cell-empty"));
      }
    }
    if (lpsDisplayRow) {
      lpsDisplayRow.innerHTML = "";
      for (let k = 0; k < pattern.length; k++) {
        const c = createCell(pattern[k] + ": " + lps[k]);
        c.classList.add("cell-lps");
        lpsDisplayRow.appendChild(c);
      }
    }
  }

  function renderVizStep(text, pattern, lps, step, textRow, patternRow, opts) {
    if (!textRow || !patternRow) return;
    const tCells = textRow.children;
    const pCells = patternRow.children;

    // Clear
    for (let k = 0; k < text.length; k++) {
      tCells[k].className = "cell cell-unprocessed";
      tCells[k].textContent = text[k];
      pCells[k].className = "cell cell-empty";
      pCells[k].textContent = "";
    }

    // Place pattern at offset
    const offset = step.offset;
    for (let k = 0; k < pattern.length; k++) {
      if (offset + k >= 0 && offset + k < text.length) {
        pCells[offset + k].textContent = pattern[k];
        pCells[offset + k].className = "cell cell-unprocessed";
      }
    }

    if (step.foundNow) {
      // Highlight entire found match
      for (let k = 0; k < pattern.length; k++) {
        if (step.foundOffset + k < text.length) {
          tCells[step.foundOffset + k].className = "cell cell-found";
          pCells[step.foundOffset + k].className = "cell cell-found";
        }
      }
    } else {
      // Highlight already-matched chars in this alignment (0..j-1)
      for (let k = 0; k < step.j; k++) {
        if (offset + k >= 0 && offset + k < text.length) {
          tCells[offset + k].className = "cell cell-match";
          pCells[offset + k].className = "cell cell-match";
        }
      }

      // Current comparison cell
      const ti = step.i;
      if (ti >= 0 && ti < text.length) {
        if (step.isMatch) {
          tCells[ti].className = "cell cell-match";
          if (offset + step.j >= 0 && offset + step.j < text.length) {
            pCells[offset + step.j].className = "cell cell-match";
          }
        } else {
          tCells[ti].className = "cell cell-mismatch";
          if (offset + step.j >= 0 && offset + step.j < text.length) {
            pCells[offset + step.j].className = "cell cell-mismatch";
          }
        }
      }
    }
  }

  function renderMainVizStep() {
    if (vizStepIndex < 0) {
      // Initial state
      initVizDisplay(VIZ_TEXT, VIZ_PATTERN, VIZ_LPS, vizIndexRow, vizTextRow, vizPatternRow, vizLpsRow);
      if (vizIEl) vizIEl.textContent = "0";
      if (vizJEl) vizJEl.textContent = "0";
      if (vizComparisonsEl) vizComparisonsEl.textContent = "0";
      if (vizMatchesEl) vizMatchesEl.textContent = "0";
      if (vizExplanation) vizExplanation.innerHTML = 'Press <strong>Next Step</strong> or <strong>Auto Play</strong> to begin.';
      if (vizPrevBtn) vizPrevBtn.disabled = true;
      if (vizNextBtn) vizNextBtn.disabled = false;
      if (vizResultsDiv) vizResultsDiv.style.display = "none";
      return;
    }

    const step = vizSteps[vizStepIndex];
    renderVizStep(VIZ_TEXT, VIZ_PATTERN, VIZ_LPS, step, vizTextRow, vizPatternRow);

    if (vizIEl) vizIEl.textContent = step.i;
    if (vizJEl) vizJEl.textContent = step.j;
    if (vizComparisonsEl) vizComparisonsEl.textContent = step.comparisons;
    if (vizMatchesEl) vizMatchesEl.textContent = step.matchesFound.length;
    if (vizExplanation) vizExplanation.textContent = step.explanation;

    if (vizPrevBtn) vizPrevBtn.disabled = vizStepIndex <= 0;
    if (vizNextBtn) vizNextBtn.disabled = vizStepIndex >= vizSteps.length - 1;

    // Show results when done
    if (vizStepIndex >= vizSteps.length - 1) {
      if (vizResultsDiv) vizResultsDiv.style.display = "block";
      const lastStep = vizSteps[vizSteps.length - 1];
      if (vizResultIndices) {
        vizResultIndices.textContent = lastStep.matchesFound.length > 0
          ? lastStep.matchesFound.join(", ")
          : "No matches found";
      }
      if (vizResultComparisons) vizResultComparisons.textContent = lastStep.comparisons;
      stopVizAutoPlay();
    }
  }

  function getSpeedMs() {
    const val = vizSpeedInput ? parseInt(vizSpeedInput.value) : 3;
    const speeds = { 1: 1500, 2: 1000, 3: 700, 4: 400, 5: 200 };
    return speeds[val] || 700;
  }

  function startVizAutoPlay() {
    if (vizAutoPlaying) return;
    vizAutoPlaying = true;
    if (vizAutoBtn) vizAutoBtn.textContent = "⏸ Pause";

    vizAutoInterval = setInterval(function () {
      if (vizStepIndex < vizSteps.length - 1) {
        vizStepIndex++;
        renderMainVizStep();
      } else {
        stopVizAutoPlay();
      }
    }, getSpeedMs());
  }

  function stopVizAutoPlay() {
    vizAutoPlaying = false;
    if (vizAutoInterval) {
      clearInterval(vizAutoInterval);
      vizAutoInterval = null;
    }
    if (vizAutoBtn) vizAutoBtn.textContent = "▶ Auto Play";
  }

  // Initialize viz
  vizSteps = computeVizSteps(VIZ_TEXT, VIZ_PATTERN, VIZ_LPS);
  initVizDisplay(VIZ_TEXT, VIZ_PATTERN, VIZ_LPS, vizIndexRow, vizTextRow, vizPatternRow, vizLpsRow);

  if (vizNextBtn) {
    vizNextBtn.addEventListener("click", function () {
      if (vizStepIndex < vizSteps.length - 1) {
        vizStepIndex++;
        renderMainVizStep();
      }
    });
  }
  if (vizPrevBtn) {
    vizPrevBtn.addEventListener("click", function () {
      if (vizStepIndex > 0) {
        vizStepIndex--;
      } else {
        vizStepIndex = -1;
      }
      renderMainVizStep();
    });
  }
  if (vizAutoBtn) {
    vizAutoBtn.addEventListener("click", function () {
      if (vizAutoPlaying) {
        stopVizAutoPlay();
      } else {
        startVizAutoPlay();
      }
    });
  }
  if (vizResetBtn) {
    vizResetBtn.addEventListener("click", function () {
      stopVizAutoPlay();
      vizStepIndex = -1;
      renderMainVizStep();
    });
  }
  if (vizSpeedInput) {
    vizSpeedInput.addEventListener("input", function () {
      if (vizSpeedLabel) vizSpeedLabel.textContent = this.value + "×";
      if (vizAutoPlaying) {
        stopVizAutoPlay();
        startVizAutoPlay();
      }
    });
  }

  renderMainVizStep();

  /* ================================================================
   *  8. INTERACTIVE PLAYGROUND (Section 4)
   * ================================================================ */
  const pgRunBtn = document.getElementById("pg-run");
  const pgTextInput = document.getElementById("pg-text");
  const pgPatternInput = document.getElementById("pg-pattern");
  const pgError = document.getElementById("pg-error");
  const pgResults = document.getElementById("pg-results");
  const pgLpsRow = document.getElementById("pg-lps-row");
  const pgVizTextRow = document.getElementById("pg-viz-text-row");
  const pgVizPatternRow = document.getElementById("pg-viz-pattern-row");
  const pgVizState = document.getElementById("pg-viz-state");
  const pgVizExplanation = document.getElementById("pg-viz-explanation");
  const pgPrevBtn = document.getElementById("pg-prev");
  const pgNextBtn = document.getElementById("pg-next");
  const pgAutoBtn = document.getElementById("pg-auto");
  const pgResetVizBtn = document.getElementById("pg-reset-viz");
  const pgSummary = document.getElementById("pg-summary");
  const pgSummaryText = document.getElementById("pg-summary-text");

  let pgSteps = [];
  let pgStepIndex = -1;
  let pgAutoInterval = null;
  let pgAutoPlaying = false;
  let pgText = "";
  let pgPattern = "";
  let pgLps = [];

  function pgShowError(msg) {
    if (pgError) {
      pgError.textContent = msg;
      pgError.style.display = "block";
    }
  }

  function pgHideError() {
    if (pgError) pgError.style.display = "none";
  }

  function pgRenderStep() {
    if (pgStepIndex < 0) {
      // Initial state
      initVizDisplay(pgText, pgPattern, pgLps, null, pgVizTextRow, pgVizPatternRow, null);
      if (pgVizState) pgVizState.innerHTML = '<span class="var-chip"><strong>i</strong> = 0</span><span class="var-chip"><strong>j</strong> = 0</span><span class="var-chip"><strong>Comparisons</strong> = 0</span>';
      if (pgVizExplanation) pgVizExplanation.textContent = "Press Next Step or Auto Play to begin.";
      if (pgPrevBtn) pgPrevBtn.disabled = true;
      if (pgNextBtn) pgNextBtn.disabled = pgSteps.length === 0;
      if (pgSummary) pgSummary.style.display = "none";
      return;
    }

    const step = pgSteps[pgStepIndex];
    renderVizStep(pgText, pgPattern, pgLps, step, pgVizTextRow, pgVizPatternRow);

    if (pgVizState) {
      pgVizState.innerHTML =
        '<span class="var-chip"><strong>i</strong> = ' + step.i + '</span>' +
        '<span class="var-chip"><strong>j</strong> = ' + step.j + '</span>' +
        '<span class="var-chip"><strong>Comparisons</strong> = ' + step.comparisons + '</span>' +
        '<span class="var-chip"><strong>Matches</strong> = ' + step.matchesFound.length + '</span>';
    }
    if (pgVizExplanation) pgVizExplanation.textContent = step.explanation;
    if (pgPrevBtn) pgPrevBtn.disabled = pgStepIndex <= 0;
    if (pgNextBtn) pgNextBtn.disabled = pgStepIndex >= pgSteps.length - 1;

    if (pgStepIndex >= pgSteps.length - 1) {
      const last = pgSteps[pgSteps.length - 1];
      if (pgSummary) pgSummary.style.display = "block";
      if (pgSummaryText) {
        if (last.matchesFound.length > 0) {
          pgSummaryText.innerHTML =
            "Pattern found at index(es): <strong>" + last.matchesFound.join(", ") +
            "</strong>. Total comparisons: <strong>" + last.comparisons + "</strong>.";
        } else {
          pgSummaryText.innerHTML =
            "Pattern <strong>not found</strong> in the text. Total comparisons: <strong>" + last.comparisons + "</strong>.";
        }
      }
      pgStopAuto();
    }
  }

  function pgStartAuto() {
    if (pgAutoPlaying) return;
    pgAutoPlaying = true;
    if (pgAutoBtn) pgAutoBtn.textContent = "⏸ Pause";
    pgAutoInterval = setInterval(function () {
      if (pgStepIndex < pgSteps.length - 1) {
        pgStepIndex++;
        pgRenderStep();
      } else {
        pgStopAuto();
      }
    }, 500);
  }

  function pgStopAuto() {
    pgAutoPlaying = false;
    if (pgAutoInterval) {
      clearInterval(pgAutoInterval);
      pgAutoInterval = null;
    }
    if (pgAutoBtn) pgAutoBtn.textContent = "▶ Auto Play";
  }

  if (pgRunBtn) {
    pgRunBtn.addEventListener("click", function () {
      pgHideError();
      pgStopAuto();

      const text = (pgTextInput ? pgTextInput.value : "").trim();
      const pattern = (pgPatternInput ? pgPatternInput.value : "").trim();

      // Validate
      if (!text || !pattern) {
        pgShowError("Please enter both text and pattern.");
        return;
      }
      if (pattern.length > text.length) {
        pgShowError("Pattern cannot be longer than text.");
        return;
      }
      if (!/^[A-Za-z0-9]+$/.test(text) || !/^[A-Za-z0-9]+$/.test(pattern)) {
        pgShowError("Only alphanumeric characters (A-Z, a-z, 0-9) are allowed.");
        return;
      }

      pgText = text;
      pgPattern = pattern;
      pgLps = computeLPS(pattern);
      pgSteps = computeVizSteps(text, pattern, pgLps);
      pgStepIndex = -1;

      // Show results area
      if (pgResults) pgResults.style.display = "block";
      if (pgSummary) pgSummary.style.display = "none";

      // Render LPS
      if (pgLpsRow) {
        pgLpsRow.innerHTML = "";
        for (let k = 0; k < pattern.length; k++) {
          const c = createCell(pattern[k] + ": " + pgLps[k]);
          c.classList.add("cell-lps");
          pgLpsRow.appendChild(c);
        }
      }

      pgRenderStep();
    });
  }

  if (pgNextBtn) {
    pgNextBtn.addEventListener("click", function () {
      if (pgStepIndex < pgSteps.length - 1) {
        pgStepIndex++;
        pgRenderStep();
      }
    });
  }
  if (pgPrevBtn) {
    pgPrevBtn.addEventListener("click", function () {
      if (pgStepIndex > 0) {
        pgStepIndex--;
      } else {
        pgStepIndex = -1;
      }
      pgRenderStep();
    });
  }
  if (pgAutoBtn) {
    pgAutoBtn.addEventListener("click", function () {
      if (pgAutoPlaying) {
        pgStopAuto();
      } else {
        pgStartAuto();
      }
    });
  }
  if (pgResetVizBtn) {
    pgResetVizBtn.addEventListener("click", function () {
      pgStopAuto();
      pgStepIndex = -1;
      pgRenderStep();
    });
  }

  // Example buttons
  document.querySelectorAll(".pg-example").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (pgTextInput) pgTextInput.value = this.getAttribute("data-text");
      if (pgPatternInput) pgPatternInput.value = this.getAttribute("data-pattern");
    });
  });

  /* ================================================================
   *  9. CODE TABS (Section 5)
   * ================================================================ */
  const implTabs = document.querySelectorAll(".impl-tab");
  const implPanels = document.querySelectorAll(".impl-panel");

  implTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      implTabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");

      implPanels.forEach(function (p) {
        p.classList.toggle("active", p.id === "panel-" + targetTab);
      });
    });
  });

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const text = codeEl.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 2000);
      }).catch(function () {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 2000);
      });
    });
  });

  /* ================================================================
   *  10. COMPLEXITY CHART (Section 6) — Vanilla Canvas
   * ================================================================ */
  function drawComplexityChart() {
    const canvas = document.getElementById("complexity-canvas");
    if (!canvas) return;
    const container = document.getElementById("complexity-chart");

    // Responsive sizing
    const containerWidth = container ? container.offsetWidth : 800;
    const width = Math.min(containerWidth, 900);
    const height = Math.round(width * 0.55);
    canvas.width = width * 2; // hi-dpi
    canvas.height = height * 2;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const m = 100;
    const maxN = 1000;
    const maxY = maxN * m; // 100000

    // Background
    ctx.fillStyle = "#0f0f14";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const y = padding.top + chartH - (i / yTicks) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
    }
    const xTicks = 5;
    for (let i = 0; i <= xTicks; i++) {
      const x = padding.left + (i / xTicks) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartH);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "12px 'DM Sans', sans-serif";
    ctx.textAlign = "center";

    // X-axis labels
    for (let i = 0; i <= xTicks; i++) {
      const val = Math.round((i / xTicks) * maxN);
      const x = padding.left + (i / xTicks) * chartW;
      ctx.fillText(val, x, padding.top + chartH + 22);
    }

    // Y-axis labels
    ctx.textAlign = "right";
    for (let i = 0; i <= yTicks; i++) {
      const val = Math.round((i / yTicks) * maxY);
      const y = padding.top + chartH - (i / yTicks) * chartH;
      const label = val >= 1000 ? Math.round(val / 1000) + "k" : val;
      ctx.fillText(label, padding.left - 10, y + 4);
    }

    // Axis titles
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Input size (n)", padding.left + chartW / 2, height - 8);

    ctx.save();
    ctx.translate(18, padding.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Operations", 0, 0);
    ctx.restore();

    // Plot O(n*m) — quadratic growth
    ctx.beginPath();
    ctx.strokeStyle = "#ff6b6b";
    ctx.lineWidth = 2.5;
    for (let n = 0; n <= maxN; n += 2) {
      const x = padding.left + (n / maxN) * chartW;
      const yVal = n * m;
      const y = padding.top + chartH - (yVal / maxY) * chartH;
      if (n === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Plot O(n+m) — linear growth
    ctx.beginPath();
    ctx.strokeStyle = "#51cf66";
    ctx.lineWidth = 2.5;
    for (let n = 0; n <= maxN; n += 2) {
      const x = padding.left + (n / maxN) * chartW;
      const yVal = n + m;
      const y = padding.top + chartH - (yVal / maxY) * chartH;
      if (n === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Legend
    const legendX = padding.left + 20;
    const legendY = padding.top + 20;

    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(legendX, legendY, 20, 3);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("O(n × m) — Naive", legendX + 28, legendY + 5);

    ctx.fillStyle = "#51cf66";
    ctx.fillRect(legendX, legendY + 24, 20, 3);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("O(n + m) — KMP", legendX + 28, legendY + 29);

    // m value label
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillText("(m = " + m + ")", legendX + 28, legendY + 49);
  }

  drawComplexityChart();
  window.addEventListener("resize", drawComplexityChart);

  /* ================================================================
   *  11. CHALLENGE ZONE (Section 7)
   * ================================================================ */
  let challengesCompleted = 0;
  const challengesDone = new Set();

  function updateChallengeCount() {
    const el = document.getElementById("ch-completed");
    if (el) el.textContent = challengesCompleted;
  }

  function markChallengeComplete(num) {
    if (challengesDone.has(num)) return;
    challengesDone.add(num);
    challengesCompleted++;
    updateChallengeCount();
  }

  // Challenge 1: LPS for AABAACAABAA
  const ch1Submit = document.getElementById("ch1-submit");
  const ch1Input = document.getElementById("ch1-input");
  const ch1Feedback = document.getElementById("ch1-feedback");
  const ch1HintBtn = document.getElementById("ch1-hint-btn");
  const ch1Hint = document.getElementById("ch1-hint");
  const ch1Solution = document.getElementById("ch1-solution");

  if (ch1Submit) {
    ch1Submit.addEventListener("click", function () {
      const val = (ch1Input ? ch1Input.value : "").trim();
      const normalized = val.replace(/\s/g, "").split(",").join(",");
      const correct = "0,1,0,1,2,0,1,2,3,4,5";

      if (ch1Feedback) {
        ch1Feedback.style.display = "block";
        if (normalized === correct) {
          ch1Feedback.className = "challenge-feedback feedback-correct";
          ch1Feedback.innerHTML = "✅ <strong>Correct!</strong> Great understanding of LPS construction.";
          if (ch1Solution) ch1Solution.style.display = "block";
          markChallengeComplete(1);
        } else {
          ch1Feedback.className = "challenge-feedback feedback-incorrect";
          ch1Feedback.innerHTML = "❌ <strong>Not quite.</strong> Try again! Remember: LPS[i] is the length of the longest proper prefix of the substring pattern[0..i] that is also a suffix.";
        }
      }
    });
  }

  if (ch1HintBtn) {
    ch1HintBtn.addEventListener("click", function () {
      if (ch1Hint) {
        ch1Hint.style.display = ch1Hint.style.display === "none" ? "block" : "none";
      }
    });
  }

  // Challenge 2: Find all occurrences of ABC in ABCABCABC
  const ch2Submit = document.getElementById("ch2-submit");
  const ch2Input = document.getElementById("ch2-input");
  const ch2Feedback = document.getElementById("ch2-feedback");
  const ch2HintBtn = document.getElementById("ch2-hint-btn");
  const ch2Hint = document.getElementById("ch2-hint");
  const ch2Solution = document.getElementById("ch2-solution");

  if (ch2Submit) {
    ch2Submit.addEventListener("click", function () {
      const val = (ch2Input ? ch2Input.value : "").trim();
      const normalized = val.replace(/\s/g, "").split(",").join(",");
      const correct = "0,3,6";

      if (ch2Feedback) {
        ch2Feedback.style.display = "block";
        if (normalized === correct) {
          ch2Feedback.className = "challenge-feedback feedback-correct";
          ch2Feedback.innerHTML = "✅ <strong>Correct!</strong> ABC appears at indices 0, 3, and 6.";
          if (ch2Solution) ch2Solution.style.display = "block";
          markChallengeComplete(2);
        } else {
          ch2Feedback.className = "challenge-feedback feedback-incorrect";
          ch2Feedback.innerHTML = "❌ <strong>Not quite.</strong> Try running KMP step by step. Remember, non-overlapping matches here since LPS for ABC is all zeros.";
        }
      }
    });
  }

  if (ch2HintBtn) {
    ch2HintBtn.addEventListener("click", function () {
      if (ch2Hint) {
        ch2Hint.style.display = ch2Hint.style.display === "none" ? "block" : "none";
      }
    });
  }

  // Challenge 3: Count comparisons (code modification)
  const ch3Submit = document.getElementById("ch3-submit");
  const ch3Editor = document.getElementById("ch3-editor");
  const ch3Feedback = document.getElementById("ch3-feedback");
  const ch3HintBtn = document.getElementById("ch3-hint-btn");
  const ch3Hint = document.getElementById("ch3-hint");
  const ch3Solution = document.getElementById("ch3-solution");

  if (ch3Submit) {
    ch3Submit.addEventListener("click", function () {
      const code = ch3Editor ? ch3Editor.value : "";
      // Check if the user added comparisons += 1 or comparisons+=1 before the if
      const normalized = code.replace(/\s+/g, " ");
      const hasIncrement =
        /comparisons\s*\+=\s*1/.test(code) ||
        /comparisons\s*=\s*comparisons\s*\+\s*1/.test(code);

      if (ch3Feedback) {
        ch3Feedback.style.display = "block";
        if (hasIncrement) {
          ch3Feedback.className = "challenge-feedback feedback-correct";
          ch3Feedback.innerHTML = "✅ <strong>Correct!</strong> You've properly added the comparison counter. Every comparison (match or mismatch) is now counted.";
          if (ch3Solution) ch3Solution.style.display = "block";
          markChallengeComplete(3);
        } else {
          ch3Feedback.className = "challenge-feedback feedback-incorrect";
          ch3Feedback.innerHTML = "❌ <strong>Not quite.</strong> You need to add <code>comparisons += 1</code> before the <code>if text[i] == pattern[j]</code> comparison. Every time you compare characters, increment the counter.";
        }
      }
    });
  }

  if (ch3HintBtn) {
    ch3HintBtn.addEventListener("click", function () {
      if (ch3Hint) {
        ch3Hint.style.display = ch3Hint.style.display === "none" ? "block" : "none";
      }
    });
  }

  /* ================================================================
   *  12. QUIZ SYSTEM (Section 8)
   * ================================================================ */
  const QUIZ_ANSWERS = { 1: "B", 2: "C", 3: "C", 4: "B", 5: "B" };
  const QUIZ_EXPLANATIONS = {
    1: "LPS stands for Longest Proper Prefix which is also a Suffix. It's the core concept behind KMP's efficiency.",
    2: "KMP runs in O(n+m) because the text pointer never moves backwards and the LPS preprocessing takes O(m).",
    3: "In KMP, the text pointer i never moves backwards. Only the pattern pointer j falls back using the LPS array.",
    4: 'For ABAB: LPS[0]=0 (single char), LPS[1]=0 (AB, no match), LPS[2]=1 (ABA, "A" is prefix and suffix), LPS[3]=2 (ABAB, "AB" is prefix and suffix).',
    5: "KMP uses O(m) auxiliary space for the LPS array, where m is the pattern length.",
  };

  const quizSubmitBtn = document.getElementById("quiz-submit");
  const quizResults = document.getElementById("quiz-results");
  let quizSubmitted = false;

  if (quizSubmitBtn) {
    quizSubmitBtn.addEventListener("click", function () {
      if (quizSubmitted) return;
      quizSubmitted = true;

      let score = 0;

      for (let q = 1; q <= 5; q++) {
        const selected = document.querySelector('input[name="q' + q + '"]:checked');
        const statusEl = document.getElementById("qq-status-" + q);
        const fbEl = document.getElementById("qq-fb-" + q);
        const userAnswer = selected ? selected.value : null;
        const correct = QUIZ_ANSWERS[q];
        const isCorrect = userAnswer === correct;

        if (isCorrect) {
          score++;
          if (statusEl) {
            statusEl.textContent = "✓";
            statusEl.classList.add("status-correct");
          }
          if (fbEl) {
            fbEl.style.display = "block";
            fbEl.className = "qq-feedback feedback-correct";
            fbEl.textContent = "Correct!";
          }
        } else {
          if (statusEl) {
            statusEl.textContent = "✗";
            statusEl.classList.add("status-incorrect");
          }
          if (fbEl) {
            fbEl.style.display = "block";
            fbEl.className = "qq-feedback feedback-incorrect";
            fbEl.textContent = QUIZ_EXPLANATIONS[q];
          }
        }

        // Highlight correct/incorrect options
        const options = document.querySelectorAll('#qq-' + q + ' .qq-option');
        options.forEach(function (opt) {
          const radio = opt.querySelector('input[type="radio"]');
          if (radio.value === correct) {
            opt.classList.add("option-correct");
          } else if (radio.value === userAnswer && !isCorrect) {
            opt.classList.add("option-incorrect");
          }
          radio.disabled = true;
        });
      }

      // Show results
      if (quizResults) quizResults.style.display = "block";
      const scoreNum = document.getElementById("score-num");
      const scoreLabel = document.getElementById("score-label");

      if (scoreNum) scoreNum.textContent = score;
      if (scoreLabel) {
        if (score === 5) scoreLabel.textContent = "Perfect!";
        else if (score === 4) scoreLabel.textContent = "Great job!";
        else if (score === 3) scoreLabel.textContent = "Good effort!";
        else scoreLabel.textContent = "Keep studying!";
      }

      quizSubmitBtn.disabled = true;
      quizSubmitBtn.textContent = "Submitted";
    });
  }

  /* ================================================================
   *  13. SECTION FADE-IN ANIMATION
   * ================================================================ */
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll(".section").forEach(function (sec) {
    fadeObserver.observe(sec);
  });

  /* ================================================================
   *  14. SCROLL TO TOP / CTA
   * ================================================================ */
  // Hero CTA button
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.getElementById("intro");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Scroll indicator
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", function () {
      const target = document.getElementById("intro");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

})();
