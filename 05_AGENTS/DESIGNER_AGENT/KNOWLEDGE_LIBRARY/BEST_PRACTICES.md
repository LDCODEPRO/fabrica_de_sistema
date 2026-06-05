# BEST PRACTICES — DESIGNER AGENT

## 1. User Research

- **Design for observed behavior, not reported behavior**: Users say what they think they do. Watch what they actually do. Usability testing, session recordings, and heatmaps reveal the truth.
- **Define user personas from real data**: Personas built from interviews and analytics are tools for alignment. Personas invented from assumptions are fiction that misleads design decisions.
- **Test with 5 users**: Nielsen's research shows that 5 participants in a usability test reveal approximately 85% of usability problems. More tests, more rounds — not more users per round.
- **Document findings, not just observations**: Every user research session must produce a synthesis document linking observed behaviors to design implications.

## 2. Usability

- **Don't make users think**: Every page element that requires interpretation adds cognitive load. Reduce choices, clarify labels, and use familiar patterns before introducing novel ones.
- **Consistency is more important than originality**: Use platform conventions (iOS HIG, Material Design) before inventing new patterns. Novel patterns require user learning.
- **Feedback for every action**: Every user action — click, submit, upload, delete — must produce immediate feedback (visual, auditory, or haptic) confirming the action was received.
- **Error prevention over error messages**: Design flows that prevent errors before they occur. When errors do occur, messages must explain what went wrong and how to fix it.

## 3. Accessibility (WCAG 2.1)

- **Color alone cannot convey information**: Always pair color with shape, text, or pattern for users with color blindness.
- **Minimum contrast ratio**: Body text 4.5:1, large text 3:1 (AA level). For enhanced accessibility (AAA): 7:1 body, 4.5:1 large.
- **All interactive elements must be keyboard-accessible**: Tab order must follow logical reading order. Focus states must be visible.
- **Images require alt text**: Decorative images use empty alt="" ; informative images describe their content.
- **Forms must have visible labels**: Placeholder text is not a substitute for a label.

## 4. Design Systems

- Build from atoms up (Atomic Design): tokens → atoms → molecules → organisms → templates → pages.
- Every component must have a documented usage guideline: when to use it, when not to, and what variants exist.
- Design tokens (color, spacing, typography, elevation) are the single source of truth — hardcoded values are a maintenance liability.
- Components in the design system must match components in the codebase (Storybook).

## 5. Visual Design

- **8-point grid**: Use multiples of 8px for spacing and sizing. This aligns with most screen densities and produces consistent rhythm.
- **Type scale**: Use a modular type scale (e.g., 1.25 or 1.333 ratio). Limit to 3-4 font sizes per context.
- **Visual hierarchy**: Every screen must have a clear primary, secondary, and tertiary hierarchy — users scan before they read.
- **White space is not empty space**: Generous spacing reduces cognitive load and signals quality.

## 6. Landing Pages and Conversion

- **One primary CTA per page**: Multiple competing calls to action reduce conversion. Define the single most valuable action and design the page to funnel users toward it.
- **Above the fold**: The value proposition must be clear without scrolling. Users decide to stay or leave in the first 3-5 seconds.
- **Social proof**: Testimonials, logos, user counts, and ratings reduce purchase anxiety and increase conversion.
- **Loading performance is conversion rate**: A 1-second delay in page load time reduces conversions by approximately 7% (Akamai research).
