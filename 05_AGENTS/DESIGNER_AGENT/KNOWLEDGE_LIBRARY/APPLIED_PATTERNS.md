# APPLIED PATTERNS — DESIGNER AGENT

## Pattern 1: Mobile-First Responsive Design

**Context**: Designing interfaces that must work across mobile, tablet, and desktop.

**Pattern**:
- Design the mobile layout first using the narrowest common viewport (375px / 390px).
- Identify the priority content order — mobile forces a single column, which reveals the true hierarchy.
- Expand to tablet (768px) and desktop (1280px+) by adding columns and secondary content, not by removing it.
- Use breakpoints only when the layout breaks, not at arbitrary device widths.

**Source**: Luke Wroblewski, *Mobile First*

---

## Pattern 2: Component Variant System (Atomic Design)

**Context**: Design system components that need to handle multiple states and configurations consistently.

**Pattern**:
- Define each component's properties: variant (primary/secondary/ghost), size (sm/md/lg), state (default/hover/active/focus/disabled/loading), and content (with icon/without icon).
- Use Figma's Variants and Component Properties to organize all permutations.
- Document each variant in Storybook with its intended use case.
- Prohibit one-off component modifications in Figma — all new needs require a new variant in the system.

**Source**: Brad Frost, *Atomic Design*

---

## Pattern 3: Heuristic Evaluation Before User Testing

**Context**: Limited time and budget for user research.

**Pattern**:
- Before conducting user testing, run an internal heuristic evaluation using Nielsen's 10 heuristics.
- Each evaluator independently rates issues on a 0-4 severity scale.
- Consolidate and deduplicate findings.
- Fix severity-3 and severity-4 issues before user testing — they dominate sessions and hide other problems.

**Source**: Nielsen Norman Group heuristic evaluation methodology

---

## Pattern 4: F-Pattern and Z-Pattern Layout

**Context**: Designing pages where users scan rather than read.

**Pattern**:
- For text-heavy pages (articles, documentation): design for the F-pattern. Place the most important information in the top horizontal band and the left vertical stripe.
- For sparse pages (landing pages, dashboards): design for the Z-pattern. Place key content along the diagonal from top-left → top-right → bottom-left → bottom-right.
- Never place critical information in the right column or lower-center of text-heavy pages — eye tracking shows these are the lowest-attention areas.

**Source**: Nielsen Norman Group eye-tracking research

---

## Pattern 5: Landing Page Hierarchy for Conversion

**Context**: Landing pages with low conversion rates or unclear value propositions.

**Pattern**:
1. **Hero section**: Clear headline (what it is + who it's for), subheadline (key benefit), single primary CTA, hero image/video showing product in use.
2. **Problem/Solution**: Acknowledge the user's pain point, then present the product as the solution.
3. **Features with benefits**: Don't list features — describe what users achieve with each feature.
4. **Social proof**: Testimonials with photo, name, and title; logos of known customers; usage numbers.
5. **Second CTA**: Repeat the primary CTA with a different framing (risk reduction: "Try free for 14 days, no credit card required").
6. **FAQ**: Address the 3-5 most common objections.

**Source**: CRO best practices; Nir Eyal, *Hooked* (trigger design)

---

## Pattern 6: Accessible Form Design

**Context**: Forms that users abandon or make frequent errors on.

**Pattern**:
- Every input has a visible label above the field (not placeholder text inside the field).
- Inline validation: show errors as soon as the field loses focus, not only on submit.
- Error messages describe the problem and the fix ("Enter a date in DD/MM/YYYY format"), not just the state ("Invalid date").
- Group related fields with a fieldset and legend.
- Required fields are marked — if most fields are required, mark the optional ones instead.
- Touch targets minimum 44×44px on mobile (Apple HIG) or 48×48dp (Material Design).

**Source**: WCAG 2.1 (3.3.1, 3.3.2); Luke Wroblewski, *Web Form Design*

---

## Pattern 7: Design Token Architecture

**Context**: Design systems where style values are inconsistently applied or hard to update.

**Pattern**:
- Define three tiers of tokens:
  1. **Primitive tokens**: Raw values (Blue-500: #3B82F6, Space-4: 16px)
  2. **Semantic tokens**: Purpose-mapped aliases (color-action-primary: Blue-500, space-component-padding: Space-4)
  3. **Component tokens**: Component-specific references (button-background: color-action-primary)
- No component references primitive tokens directly — all references go through semantic tokens.
- Token names follow a pattern: [category]-[property]-[variant]-[state]

**Source**: Brad Frost, *Atomic Design*; Nathan Curtis (EightShapes) design token methodology

---

## Pattern 8: Usability Testing with 5 Users

**Context**: Teams that delay testing because recruiting 20+ participants feels expensive and slow.

**Pattern**:
- Recruit 5 representative users per target persona.
- Run 60-minute think-aloud sessions (in person or remote via Figma/Maze).
- Focus on 3-5 specific tasks per session — open-ended exploration wastes time.
- Observe without helping — silence is more valuable than hints.
- Debrief immediately after the last session: each observer writes their top 3 findings on sticky notes.
- Prioritize findings by frequency × severity.
- Fix and re-test with 5 new users.

**Source**: Steve Krug, *Rocket Surgery Made Easy*; Nielsen Norman Group (5-user rule research)
