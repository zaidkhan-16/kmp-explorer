# 🔍 KMP Explorer: Interactive Learning Lab
> **Understand. Visualize. Experiment.**  
> An interactive journey into the Knuth-Morris-Pratt (KMP) string matching algorithm.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://kmp-explorer-b0c6pvw9v-zaid-khan-s-projects-9bad2bb7.vercel.app/)
[![Pure Vanilla](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-blue?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Curriculum Breakdown (45 Minutes)](#-curriculum-breakdown-45-minutes)
- [The Algorithm at a Glance](#-the-algorithm-at-a-glance)
- [Visual & Editorial Design](#-visual--editorial-design)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started Locally](#-getting-started-locally)
- [Author](#-author)

---

## 🌟 Project Overview

String pattern matching is a cornerstone of modern computing—powering search engines, DNA sequence alignment, text editors, and network packet sniffers. Yet, the **Knuth-Morris-Pratt (KMP)** algorithm is widely considered one of the steepest conceptual hurdles in undergraduate computer science.

Most educational resources present the mathematical failure function statically, prompting students to memorize values rather than build intuition.

**KMP Explorer** is a self-contained, 45-minute interactive learning laboratory designed to turn passive reading into active, hands-on discovery. Through dynamic stepping, clickable prefix-suffix breakdowns, custom string experimentation, and instant feedback quizzes, learners gain a deep, lasting mental model of how and why KMP achieves optimal $O(n + m)$ runtime.

---

## ✨ Key Features

- **Side-by-Side Algorithm Comparison**: Live comparative animation showing why the Naive approach backtracks while KMP glides forward.
- **Interactive LPS Array Builder**: Click any character to inspect its longest proper prefix that matches a suffix, highlighted with distinct colors and contextual explanations.
- **Step-by-Step Execution Engine**: Step forward, step backward, auto-play with variable speed slider ($1\times$ to $5\times$), accompanied by real-time pointer tracking ($i$, $j$) and plain-English operational commentary.
- **True KMP Playground**: Enter custom texts and patterns; execution is powered by a from-scratch JavaScript KMP implementation—**not** `String.prototype.indexOf()` or `includes()`.
- **Production-Ready Python Code**: Complete, syntax-highlighted code divided into modular tabs with one-click clipboard copying.
- **Interactive Asymptotic Chart**: Dynamic HTML5 Canvas graph contrasting $O(n \times m)$ quadratic worst-case growth with $O(n + m)$ linear performance.
- **Three Progressive Challenges**: Beginner (LPS calculation), Intermediate (multiple occurrences), and Advanced (code modification for comparison counting) with hints and solutions.
- **Knowledge Check Quiz**: 5-question interactive evaluation with instant explanations, answer diagnostics, and circular score badge.

---

## ⏱️ Curriculum Breakdown (45 Minutes)

| Section | Focus | Time | Pedagogical Objective |
|---|---|:---:|---|
| **01. Introduction** | The Problem | 3 min | Frame the real-world scale (millions of chars); contrast Naive vs. KMP. |
| **02. LPS Array** | The Core Engine | 7 min | Demystify the prefix-suffix lookup table via clickable visual highlights. |
| **03. Visualization** | Mechanics in Motion | 10 min | Observe the pointer invariant: text index $i$ never retreats. |
| **04. Playground** | Experimentation | 7 min | Test edge cases with custom inputs (repeated letters, overlaps). |
| **05. Implementation** | Code Synthesis | 5 min | Bridge conceptual understanding to clean, documented Python code. |
| **06. Complexity** | Rigorous Analysis | 3 min | Understand mathematical proofs for $O(n+m)$ time and $O(m)$ space. |
| **07. Challenge Zone** | Active Application | 7 min | Solve tiered algorithmic problems with instant validation. |
| **08. Knowledge Check**| Self-Assessment | 3 min | Reinforce key principles and earn a final lesson score. |

---

## 🧠 The Algorithm at a Glance

### Why Does Naive Matching Fall Short?
When searching for pattern $P$ of length $m$ in text $T$ of length $n$:
- **Naive Search**: On mismatch, slides the pattern by 1 and resets the text pointer backwards. Worst case: $O(n \times m)$ comparisons (e.g., searching `AAAAAB` in `AAAAAAAAAAAAAAAAAAAAAB`).
- **KMP Search**: Preprocesses pattern $P$ into an **LPS array** in $O(m)$ time. On mismatch after matching $j$ characters, it shifts $j$ to $\text{LPS}[j-1]$ without ever moving text pointer $i$ backwards. Total time: $O(n + m)$.

### Complexity Summary
| Operation | Time Complexity | Auxiliary Space | Key Invariant |
|---|:---:|:---:|---|
| **LPS Preprocessing** | $O(m)$ | $O(m)$ | Tracks longest proper prefix that is also a suffix |
| **Pattern Matching** | $O(n)$ | $O(1)$ | Text pointer $i$ monotonically increases |
| **Total** | **$O(n + m)$** | **$O(m)$** | Total character comparisons bounded by $2n$ |

---

## 🎨 Visual & Editorial Design

To provide an inviting, human-crafted educational atmosphere, **KMP Explorer** rejects generic AI templates in favor of a warm, editorial design language:

- **Warm Editorial Palette**: 
  - Canvas: Cream (`#FAFAF7`) and Warm Stone (`#F0EDE6`)
  - Accent / Primary: Burnt Terracotta (`#C84B31`)
  - Secondary Accent: Warm Amber (`#E8973E`)
  - Pointers & Accents: Steel Blue (`#3A7CA5`)
  - Typography & Structure: Deep Charcoal (`#2B2D42`)
- **Semantic Color Coding**:
  - 🟩 **Green (`#4E8B5E`)**: Matching characters & successful occurrences
  - 🟥 **Red (`#C4433A`)**: Mismatch locations & fallbacks
  - 🟦 **Blue (`#3A7CA5`)**: Active comparison pointer
  - 🟨 **Amber (`#E8973E`)**: Prefix highlights during LPS inspection
- **Typography**:
  - Headings: *Fraunces* (Warm, humanist variable serif)
  - Body: *DM Sans* (Clean, high-legibility geometric sans)
  - Code & Character Grid: *JetBrains Mono* (Fixed-width clarity)

---

## 🛠️ Tech Stack

- **HTML5**: Semantic document outline, accessible ARIA roles, responsive viewport controls.
- **CSS3**: Custom design tokens, glassmorphic blurred navigation, flexbox/grid responsive layouts, and keyframe animations.
- **Vanilla JavaScript (ES6+)**: Zero external dependencies. Complete standalone algorithmic engine, canvas charting, step state-machine, and DOM interaction.

---

## 📁 Project Structure

```text
KMP/
├── index.html          # Semantic single-page application structure (8 sections)
├── css/
│   └── styles.css      # Custom design system, typography, animations, responsive rules
├── js/
│   └── app.js          # Core KMP engine, interactive visualizers, canvas chart, quiz logic
└── README.md           # Project documentation and learning guide
```

---

## 🚀 Getting Started Locally

### Prerequisites
Any standard modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari). No package managers or build steps required.

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/zaidkhan-16/kmp-explorer.git
   cd kmp-explorer
   ```

2. **Serve the project:**
   Using Python (built into most systems):
   ```bash
   python -m http.server 8000
   ```
   *Or simply double-click `index.html` to open it directly in your browser.*

3. **Explore:**
   Navigate to `http://localhost:8000` and begin the 45-minute lesson!

---

## 👤 Author

**Zaid Khan**  
GitHub: [@zaidkhan-16](https://github.com/zaidkhan-16)  
Project Repository: [kmp-explorer](https://github.com/zaidkhan-16/kmp-explorer)
