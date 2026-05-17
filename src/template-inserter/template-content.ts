// Template content strings - separated for better maintainability

export const LAYOUT_TEMPLATES: Record<string, string> = {
    "text-image-1-3": `---

<grid drag="30 80" drop="2 10" align="topleft">

## Slide Title

**Your subtitle here**

<!-- element class="fragment" -->
> 💡 Key takeaway point

</grid>

<grid drag="65 90" drop="33 5">
![[your-image.webp]]
</grid>

note: Speaker notes here`,

    "image-overlay-bottom": `---

<grid drag="100 90" drop="0 0">
![[background-image.webp]]
</grid>

<grid drag="100 20" drop="0 80" style="background: linear-gradient(transparent, rgba(0,0,0,0.8))">

## Slide Title
<!-- element class="fragment" -->
Caption text here

</grid>

note: Speaker notes here`,

    "2-columns": `---

## Two Columns Layout

<grid drag="45 70" drop="5 20" align="topleft">

Content for left column goes here. Add bullet points, text, or other elements.

</grid>

<grid drag="45 70" drop="52 20" align="topleft">

Content for right column goes here. Add bullet points, text, or other elements.

</grid>

note: Speaker notes here`,

    "3-columns": `---

## Three Columns

<grid drag="30 75" drop="2 15" align="topleft">

### Column 1

First column content

</grid>

<grid drag="30 75" drop="35 15" align="topleft">

### Column 2

Second column content

</grid>

<grid drag="30 75" drop="68 15" align="topleft">

### Column 3

Third column content

</grid>

note: Speaker notes here`,

    "grid-2x2": `---

## Image Grid

<grid drag="48 45" drop="1 5">
![[image-1.webp]]
</grid>

<grid drag="48 45" drop="51 5">
![[image-2.webp]]
</grid>

<grid drag="48 45" drop="1 52">
![[image-3.webp]]
</grid>

<grid drag="48 45" drop="51 52">
![[image-4.webp]]
</grid>

note: Speaker notes here`,

    "timeline": `---

## Project Timeline

<grid drag="20 70" drop="5 15" align="top">

**Q1 2024**
<!-- element class="fragment" -->
Research & Planning

</grid>

<grid drag="20 70" drop="27 15" align="top">

**Q2 2024**
<!-- element class="fragment" -->
Development Phase

</grid>

<grid drag="20 70" drop="49 15" align="top">

**Q3 2024**
<!-- element class="fragment" -->
Testing & QA

</grid>

<grid drag="20 70" drop="71 15" align="top">

**Q4 2024**
<!-- element class="fragment" -->
Launch & Deploy

</grid>

note: Speaker notes here`,
};

export const STRUCTURE_TEMPLATES: Record<string, string> = {
    "section-header": `---

<!-- background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%) -->

# 📊 Section Title
## Subtitle or description`,

    "cta": `---

<!-- background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) -->

<grid drag="80 60" drop="10 20" align="center">

# Ready to Get Started?

Join thousands of traders improving their analysis

<br>

<!-- element class="fragment" style="background: white; color: #333; padding: 15px 40px; border-radius: 30px; font-weight: bold;" -->
Subscribe Now

</grid>

note: Speaker notes here`,

    "thank-you": `---

<!-- background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%) -->

<grid drag="80 70" drop="10 15" align="center">

# 🙏 Thank You!

<br>

| Platform | Link |
|----------|------|
| 🎬 YouTube | @YourChannel |
| 🌐 Website | yoursite.com |
| 💬 Discord | discord.gg/invite |

<br>

<!-- element class="fragment" -->
**See you next week!**

</grid>

note: Speaker notes here`,
};

export const TRADING_TEMPLATES: Record<string, string> = {
    "key-levels": `---

## GOLD - Key Levels

<grid drag="45 70" drop="5 15" align="topleft">

\`\`\`
Resistance 2: 2,450
Resistance 1: 2,420
━━━━━━━━━━━━━━━━━━━━
Current:      2,385
━━━━━━━━━━━━━━━━━━━━
Support 1:    2,350
Support 2:    2,320
\`\`\`

</grid>

<grid drag="45 70" drop="52 15" align="topleft">

<!-- element class="fragment" -->
🎯 **Bias:** Bullish

<!-- element class="fragment" -->
📍 **Entry:** 2,380

<!-- element class="fragment" -->
🛑 **SL:** 2,350

<!-- element class="fragment" -->
✅ **TP:** 2,420 / 2,450

</grid>

note: Speaker notes here`,
};

export const DATA_TEMPLATES: Record<string, string> = {
    "table": `---

## Data Table

| Metric | Q1 | Q2 | Q3 |
|--------|------|------|------|
| Revenue | $1.2M | $1.5M | $1.8M |
| Users | 10K | 15K | 22K |
| Growth | 12% | 25% | 47% |

note: Speaker notes here`,

    "stats-cards": `---

## Key Statistics

<grid drag="30 40" drop="2 15" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px;">

# 150%
**Growth Rate**

</grid>

<grid drag="30 40" drop="35 15" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px;">

# $2.5M
**Revenue**

</grid>

<grid drag="30 40" drop="68 15" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px;">

# 50K+
**Active Users**

</grid>

<grid drag="90 30" drop="5 60" align="center">

<!-- element class="fragment" -->
> Strong momentum continues into next quarter

</grid>

note: Speaker notes here`,

    "comparison-table": `---

## Feature Comparison

| Feature | Basic | Pro | Enterprise |
|---------|:-----:|:---:|:----------:|
| Users | 5 | 25 | Unlimited |
| Storage | 10GB | 100GB | 1TB |
| Support | Email | Priority | Dedicated |
| API | ❌ | ✅ | ✅ |
| **Best For** | Startups | Teams | Companies |

note: Speaker notes here`,

    "kpi-dashboard": `---

## Performance Dashboard

<grid drag="23 40" drop="1 10" align="center" style="background: rgba(0,255,0,0.1); border-radius: 8px;">

### 📈 +15.2%
Monthly Return
<!-- element class="fragment" -->
_↑ 3.5% vs last month_

</grid>

<grid drag="23 40" drop="26 10" align="center" style="background: rgba(255,255,0,0.1); border-radius: 8px;">

### 💰 $125K
Total Profit
<!-- element class="fragment" -->
_↑ $25K vs target_

</grid>

<grid drag="23 40" drop="51 10" align="center" style="background: rgba(0,150,255,0.1); border-radius: 8px;">

### 📊 72%
Win Rate
<!-- element class="fragment" -->
_↑ 5% improvement_

</grid>

<grid drag="23 40" drop="76 10" align="center" style="background: rgba(255,0,255,0.1); border-radius: 8px;">

### 🎯 2.5:1
Risk/Reward
<!-- element class="fragment" -->
_Consistent ratio_

</grid>

<grid drag="96 45" drop="2 55" align="topleft">

<!-- element class="fragment" -->
> 💡 **Insight:** Strong performance driven by improved entry timing

</grid>

note: Speaker notes here`,
};

export const CONTENT_TEMPLATES: Record<string, string> = {
    "fragment-list": `---

## Key Points

<!-- element class="fragment" -->
📌 **First important point**

<!-- element class="fragment" -->
📌 **Second important point**

<!-- element class="fragment" -->
📌 **Third important point**

<!-- element class="fragment highlight-red" -->
> Remember this key insight!

note: Speaker notes here`,

    "quote": `---

<!-- background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) -->

<grid drag="80 60" drop="10 20" align="center">

# "The trend is your friend until the end."

<br>

**— Ed Seykota**

</grid>

note: Speaker notes here`,

    "checklist": `---

## Checklist

<grid drag="45 80" drop="5 12" align="topleft">

<!-- element class="fragment" -->
☑️ Check market structure

<!-- element class="fragment" -->
☑️ Identify key levels

<!-- element class="fragment" -->
☑️ Wait for confirmation

<!-- element class="fragment" -->
☑️ Set entry order

</grid>

<grid drag="45 80" drop="52 12" align="topleft">

<!-- element class="fragment" -->
☑️ Define stop loss

<!-- element class="fragment" -->
☑️ Calculate position size

<!-- element class="fragment" -->
☑️ Set take profit

<!-- element class="fragment" -->
☑️ Monitor the trade

</grid>

note: Speaker notes here`,

    "code-highlight": `---

## Code Example

\`\`\`javascript [2-3]
function calculateRisk(entry, stopLoss, capital) {
    const riskAmount = capital * 0.02;
    const positionSize = riskAmount / Math.abs(entry - stopLoss);
    return positionSize;
}
\`\`\`

<!-- element class="fragment" -->
> 💡 Always risk only 2% of capital per trade

note: Speaker notes here`,
};

export const COMPARISON_TEMPLATES: Record<string, string> = {
    "before-after": `---

## Before & After

<grid drag="48 75" drop="1 10">

### Before
![[before-image.webp]]

</grid>

<grid drag="48 75" drop="51 10">

### After
![[after-image.webp]]

</grid>

<grid drag="100 15" drop="0 87" align="center">

<!-- element class="fragment" -->
Notice the significant improvement in performance

</grid>

note: Speaker notes here`,

    "pros-cons": `---

## Analysis

<grid drag="45 80" drop="3 12" align="topleft" style="background: rgba(0,255,0,0.05); border-radius: 10px; padding: 15px;">

### 🟢 Bullish Factors

<!-- element class="fragment" -->
✅ Strong technical setup

<!-- element class="fragment" -->
✅ Positive momentum

<!-- element class="fragment" -->
✅ Volume confirmation

</grid>

<grid drag="45 80" drop="52 12" align="topleft" style="background: rgba(255,0,0,0.05); border-radius: 10px; padding: 15px;">

### 🔴 Bearish Factors

<!-- element class="fragment" -->
❌ Resistance overhead

<!-- element class="fragment" -->
❌ Overbought conditions

<!-- element class="fragment" -->
❌ Divergence signals

</grid>

note: Speaker notes here`,

    "steps-process": `---

## Process Steps

<grid drag="22 60" drop="2 20" align="top">

<!-- element class="fragment" -->
## 1️⃣
**Research**
Gather data

</grid>

<grid drag="22 60" drop="27 20" align="top">

<!-- element class="fragment" -->
## 2️⃣
**Analyze**
Find patterns

</grid>

<grid drag="22 60" drop="52 20" align="top">

<!-- element class="fragment" -->
## 3️⃣
**Plan**
Create strategy

</grid>

<grid drag="22 60" drop="77 20" align="top">

<!-- element class="fragment" -->
## 4️⃣
**Execute**
Take action

</grid>

note: Speaker notes here`,
};

export const INTERACTIVE_TEMPLATES: Record<string, string> = {
    "quiz": `---

## ❓ What is the primary trend?

<grid drag="45 30" drop="5 25" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px;">

<!-- element class="fragment" data-fragment-index="1" -->
**A.** Bullish uptrend

</grid>

<grid drag="45 30" drop="52 25" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px;">

<!-- element class="fragment" data-fragment-index="1" -->
**B.** Bearish downtrend

</grid>

<grid drag="45 30" drop="5 58" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px;">

<!-- element class="fragment" data-fragment-index="1" -->
**C.** Sideways consolidation

</grid>

<grid drag="45 30" drop="52 58" align="center" style="background: rgba(255,255,255,0.05); border-radius: 10px;">

<!-- element class="fragment" data-fragment-index="1" -->
**D.** No clear trend

</grid>

<!-- element class="fragment" data-fragment-index="2" -->
> ✅ **Answer:** A — Higher highs and higher lows confirm bullish structure

note: Speaker notes here`,
};

export const MEDIA_TEMPLATES: Record<string, string> = {
    "video-background": `---

<!-- background-video: "video-url.mp4" data-background-video-loop data-background-video-muted data-background-opacity="0.3" -->

<grid drag="80 50" drop="10 25" align="center">

# Video Title

Subtitle or description

</grid>

note: Speaker notes here`,

    "iframe-embed": `---

## Embedded Content

<grid drag="90 75" drop="5 15">

<iframe src="https://example.com/embed" width="100%" height="100%" frameborder="0"></iframe>

</grid>

note: Speaker notes here`,
};

export const MERMAID_TEMPLATES: Record<string, string> = {
    "mermaid-flowchart": `---

<split even>

<div>

## Decision Flow

Mô tả quy trình ra quyết định hoặc luồng xử lý logic.

<!-- element class="fragment" -->
> 💡 Sử dụng để minh họa các bước trong quy trình

</div>

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    C --> E[End]
    D --> E
\`\`\`

</split>

note: Edit the flowchart nodes and connections`,

    "mermaid-mindmap": `---

<split even>

<div>

## Mind Map

Tổ chức ý tưởng theo cấu trúc phân nhánh từ chủ đề chính.

<!-- element class="fragment" -->
> 💡 Dùng cho brainstorming và tổng hợp kiến thức

</div>

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
mindmap
  root((Main Topic))
    Branch 1
      Detail 1a
      Detail 1b
    Branch 2
      Detail 2a
      Detail 2b
    Branch 3
      Detail 3a
      Detail 3b
\`\`\`

</split>

note: Edit the mindmap structure`,

    "mermaid-sequence": `---

## Process Flow

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
sequenceDiagram
    participant User
    participant System
    participant Database

    User->>System: Request data
    System->>Database: Query
    Database-->>System: Results
    System-->>User: Response
\`\`\`

note: Edit participants and messages`,

    "mermaid-timeline": `---

## Project Timeline

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
timeline
    title Project Milestones
    Q1 2024 : Research phase
    Q2 2024 : Development
    Q3 2024 : Testing
    Q4 2024 : Launch
\`\`\`

note: Edit timeline periods and events`,

    "mermaid-gantt": `---

## Project Schedule

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
gantt
    title Project Plan
    dateFormat YYYY-MM-DD
    section Phase 1
        Research :a1, 2024-01-01, 30d
        Design :a2, after a1, 20d
    section Phase 2
        Development :b1, 2024-02-20, 45d
        Testing :b2, after b1, 15d
\`\`\`

note: Edit dates and durations`,

    "mermaid-pie": `---

## Distribution

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
pie showData
    title Market Share
    "Product A" : 40
    "Product B" : 30
    "Product C" : 20
    "Others" : 10
\`\`\`

note: Edit labels and values`,

    "mermaid-journey": `---

## User Journey

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
journey
    title Customer Experience
    section Discovery
        Find website: 5: Customer
        Browse products: 4: Customer
    section Purchase
        Add to cart: 5: Customer
        Checkout: 3: Customer
\`\`\`

note: Edit steps and satisfaction scores 1-5`,

    "mermaid-quadrant": `---

## Analysis Matrix

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
quadrantChart
    title Priority Matrix
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Do First
    quadrant-2 Schedule
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Task A: [0.8, 0.9]
    Task B: [0.3, 0.7]
    Task C: [0.6, 0.4]
\`\`\`

note: Edit axis labels and item positions 0-1`,

    "mermaid-er": `---

<split even>

<div>

## Data Model

Mô tả cấu trúc database và quan hệ giữa các bảng.

<!-- element class="fragment" -->
> 💡 Dùng cho thiết kế database schema

</div>

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
    USER {
        int id
        string name
    }
    ORDER {
        int id
        date created
    }
\`\`\`

</split>

note: Edit entities and relationships`,

    "mermaid-state": `---

<split even>

<div>

## State Machine

Biểu diễn các trạng thái và chuyển đổi trong hệ thống.

<!-- element class="fragment" -->
> 💡 Dùng cho mô tả lifecycle của đối tượng

</div>

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : start
    Processing --> Complete : success
    Complete --> Idle : reset
    Complete --> [*] : exit
\`\`\`

</split>

note: Edit states and transitions`,

    "mermaid-class": `---

<split even>

<div>

## Class Diagram

Mô tả cấu trúc và quan hệ giữa các class trong hệ thống.

<!-- element class="fragment" -->
> 💡 Dùng cho thiết kế OOP và architecture

</div>

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
classDiagram
    class Animal {
        +String name
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog : extends
    Animal --> Food : eats
\`\`\`

</split>

note: Edit classes, attributes and relationships`,

    "mermaid-git": `---

<split even>

<div>

## Git History

Minh họa lịch sử commit và branching strategy.

<!-- element class="fragment" -->
> 💡 Dùng cho giải thích Git workflow

</div>

\`\`\`mermaid
%%{init: {'theme': 'dark'}}%%
gitGraph
    commit id: "init"
    branch feature
    checkout feature
    commit id: "add-feature"
    commit id: "fix-bug"
    checkout main
    merge feature
    commit id: "release"
\`\`\`

</split>

note: Edit commits and branches`,
};

// Combine all templates
export const ALL_TEMPLATE_CONTENT: Record<string, string> = {
    ...LAYOUT_TEMPLATES,
    ...STRUCTURE_TEMPLATES,
    ...TRADING_TEMPLATES,
    ...DATA_TEMPLATES,
    ...CONTENT_TEMPLATES,
    ...COMPARISON_TEMPLATES,
    ...INTERACTIVE_TEMPLATES,
    ...MEDIA_TEMPLATES,
    ...MERMAID_TEMPLATES,
};
