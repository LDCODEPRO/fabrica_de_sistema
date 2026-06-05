# FRAMEWORKS AND METHODS — DESIGNER AGENT

## 1. Atomic Design (Brad Frost)

**Overview**: A hierarchical methodology for building design systems and component libraries.

**Five Levels**:
1. **Atoms**: The smallest functional UI elements. Examples: buttons, text inputs, color swatches, icons, typography styles.
2. **Molecules**: Simple combinations of atoms that form a functional unit. Example: search form = input + button.
3. **Organisms**: Complex UI sections composed of molecules and atoms. Example: page header = logo + navigation + search form.
4. **Templates**: Page-level layouts that place organisms into a structure, using placeholder content.
5. **Pages**: Template instances with real content — what the user actually sees.

**Application**: Build and document components from atoms up in Figma. Ensure component names and hierarchy match the codebase (Storybook).

---

## 2. Nielsen's 10 Usability Heuristics

**Source**: Jakob Nielsen (1994), Nielsen Norman Group

1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

**Application**: Use as a checklist for heuristic evaluations. Assign severity ratings (0-4) to identified issues.

---

## 3. WCAG 2.1 — Web Content Accessibility Guidelines

**Source**: W3C Web Accessibility Initiative  
**URL**: https://www.w3.org/TR/WCAG21/

**POUR Principles**:
- **Perceivable**: Information and UI components must be presentable to all users (text alternatives, captions, contrast).
- **Operable**: UI components and navigation must be operable (keyboard accessible, no seizure triggers, enough time).
- **Understandable**: Information and operation must be understandable (readable, predictable, input assistance).
- **Robust**: Content must be interpreted by a wide variety of assistive technologies.

**Conformance Levels**:
- **A**: Minimum level — if not met, content is inaccessible to some users
- **AA**: Industry standard — required by most laws and regulations (target for all Fábrica de Sistemas projects)
- **AAA**: Enhanced — not required for entire sites; applied to specific components

---

## 4. Material Design (Google)

**Overview**: Google's open-source design system providing components, motion guidelines, theming, and accessibility guidance.  
**URL**: https://m3.material.io (Material Design 3 / Material You)

**Core Concepts**:
- **Color system**: Dynamic color based on a core palette (primary, secondary, tertiary, error, neutral)
- **Typography**: Type roles (Display, Headline, Title, Body, Label) with responsive scaling
- **Elevation**: Shadow layers that communicate component hierarchy and interactivity
- **Motion**: Shared element transitions, container transforms, fade-through

**Application**: Reference for component behavior, touch target sizing (minimum 48dp), and interaction patterns on Android and cross-platform.

---

## 5. Human Interface Guidelines (Apple)

**Overview**: Apple's comprehensive design guidelines for iOS, iPadOS, macOS, watchOS, and visionOS.  
**URL**: https://developer.apple.com/design/human-interface-guidelines/

**Core Principles**:
- Aesthetic integrity
- Consistency
- Direct manipulation
- Feedback
- Metaphors
- User control

**Application**: Reference for iOS app design, gesture patterns, native component behavior, and app store review standards.

---

## 6. Hook Model (Nir Eyal)

**Overview**: A four-phase behavioral model for designing habit-forming product experiences.

**Phases**:
1. **Trigger**: External (notification, email, ad) or internal (emotion, routine) cue that initiates behavior
2. **Action**: The simplest behavior done in anticipation of a reward (Fogg Behavior Model: motivation + ability + trigger)
3. **Variable Reward**: The unpredictable reward that satisfies the trigger and creates craving (tribe, hunt, or self reward types)
4. **Investment**: User puts something in (data, social capital, reputation) that increases the product's value and loads the next trigger

**Application**: Onboarding flows, notification design, gamification, streak mechanics, personalization.

---

## 7. Gestalt Principles

**Overview**: Psychological principles that explain how humans perceive visual patterns, used to guide layout and visual hierarchy decisions.

**Core Principles**:
- **Proximity**: Elements near each other are perceived as related
- **Similarity**: Elements that look alike are perceived as belonging to the same group
- **Continuity**: The eye follows smooth paths over abrupt changes
- **Closure**: The mind completes incomplete shapes
- **Figure-Ground**: Objects are perceived as either figures (focus) or ground (background)
- **Common Fate**: Elements moving in the same direction are perceived as a group

**Application**: Grid layout, component grouping, icon design, navigation structure.

---

## 8. Conversion Rate Optimization (CRO)

**Overview**: A systematic approach to increasing the percentage of users who complete a desired action.

**Core Methods**:
- **A/B Testing**: Compare two versions of a page element to determine which converts better
- **Heatmap Analysis**: Visualize where users click, move, and scroll (Hotjar, Microsoft Clarity)
- **Session Recordings**: Watch real user sessions to identify friction points
- **Funnel Analysis**: Measure drop-off at each step of a conversion flow (Google Analytics, Mixpanel)
- **Landing Page Hierarchy**: Value proposition → Problem/Solution → Social proof → CTA → Risk reduction (money-back guarantee, privacy notice)
