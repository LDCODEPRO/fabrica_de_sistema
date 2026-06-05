# TOOLS AND STANDARDS — DESIGNER AGENT

## Design and Prototyping Tools

### Figma
**Type**: Browser-based collaborative design and prototyping tool  
**URL**: https://www.figma.com  
**Use Cases**:
- UI design (wireframes, high-fidelity mockups)
- Interactive prototyping for user testing
- Design system and component library management
- Developer handoff (inspect mode, CSS/code export)
- Collaborative design reviews with comments

**Key Features**:
- Auto Layout for responsive component design
- Variables (design tokens: color, spacing, typography)
- Component properties and variants
- Dev Mode for developer handoff
- Figma AI for content generation and design suggestions
- FigJam whiteboard (integrated)

---

### Adobe XD
**Type**: Desktop/cloud UI/UX design and prototyping  
**URL**: https://helpx.adobe.com/xd  
**Use Cases**:
- UI design with Adobe Creative Cloud integration
- Responsive resize and auto-animate prototyping
- Coediting and sharing

**Status Note**: Adobe has transitioned focus toward Figma (following acquisition); new projects should default to Figma.

---

### Storybook
**Type**: Open-source tool for developing and documenting UI components in isolation  
**URL**: https://storybook.js.org  
**Use Cases**:
- Building and testing components in isolation (no full app context needed)
- Living design system documentation (code matches design)
- Visual regression testing
- Interaction and accessibility testing

**Key Features**:
- Supports React, Vue, Angular, Svelte, and others
- Addon ecosystem: a11y (accessibility), Chromatic (visual diff), interactions
- MDX documentation for components

---

## Analytics and User Research Tools

### Hotjar
**Type**: Behavior analytics and user feedback  
**URL**: https://www.hotjar.com  
**Use Cases**:
- Heatmaps (click, move, scroll)
- Session recordings
- Conversion funnel analysis
- User surveys and feedback widgets

---

### Google Analytics 4 (GA4)
**Type**: Web analytics platform  
**URL**: https://analytics.google.com  
**Use Cases**:
- Traffic sources and acquisition analysis
- Conversion tracking and goal funnels
- User behavior flow analysis
- Event tracking for UI interactions

---

## Standards and Design Systems

### WCAG 2.1 — Web Content Accessibility Guidelines
**Organization**: W3C Web Accessibility Initiative  
**URL**: https://www.w3.org/TR/WCAG21/  
**Compliance Target**: AA (minimum for all Fábrica de Sistemas projects)  
**Key Criteria**:
- 1.4.3 Contrast (Minimum): 4.5:1 for normal text, 3:1 for large text
- 2.1.1 Keyboard: All functionality available via keyboard
- 1.1.1 Non-text Content: Alt text for all images
- 3.3.1 Error Identification: Errors described to user in text

### Material Design 3 (Google)
**URL**: https://m3.material.io  
**Description**: Google's open design system for Android, web, and cross-platform. Provides components, tokens, motion, and accessibility guidance.

### Human Interface Guidelines (Apple)
**URL**: https://developer.apple.com/design/human-interface-guidelines/  
**Description**: Apple's design guidelines for all Apple platforms. Covers interaction patterns, components, visual design, and platform-specific conventions.

### ARIA Authoring Practices Guide (W3C)
**URL**: https://www.w3.org/WAI/ARIA/apg/  
**Description**: Practical guidance for implementing ARIA (Accessible Rich Internet Applications) in custom UI components. Use when building components outside of native HTML elements.
