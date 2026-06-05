# LEARNING NOTES — DESIGNER AGENT

## Note 1: Users Satisfice — They Don't Optimize

Users don't read all options and choose the best one. They scan until they find something "good enough" and click it. Krug calls this "satisficing."  
**Lesson**: Design for the satisficing path. Make the most common action the most obvious one. Don't hide primary actions behind "more discoverable" secondary ones to avoid visual clutter.  
**Source**: Steve Krug, *Don't Make Me Think*, Chapter 2

---

## Note 2: Affordances Must Be Designed, Not Assumed

Don Norman showed that many design failures happen because the designer assumes the user will infer an affordance that was never signaled. A flat, featureless rectangle has no affordance for "push" or "pull."  
**Lesson**: Every interactive element must have a signifier — a visual cue that communicates what action it enables. Buttons must look pressable. Links must look clickable. Inputs must look typeable.  
**Source**: Don Norman, *The Design of Everyday Things*, Chapter 1

---

## Note 3: Accessibility Is a Performance Optimization

WCAG compliance is often framed as a legal or moral requirement. It is also a quality and SEO factor: accessible markup is better-structured HTML, which search engines index more effectively, and screen-reader-compatible forms have lower error and abandonment rates.  
**Lesson**: Build accessibility in from the start. Retrofitting accessibility after launch costs 3-10x more than building it in. Treat WCAG 2.1 AA as a design constraint, not an afterthought.  
**Source**: WCAG 2.1 (W3C); Nielsen Norman Group accessibility research

---

## Note 4: The 8-Point Grid Eliminates "Pixel Negotiation"

Designers and developers often waste time negotiating whether a spacing value should be 13px or 14px. An 8-point grid system (multiples of 8: 8, 16, 24, 32, 40, 48...) eliminates arbitrary values.  
**Lesson**: Establish the spacing scale as a design token before starting any screen design. All components use values from the scale — no exceptions. This creates visual rhythm and speeds up both design and development.  
**Source**: Adam Wathan & Steve Schoger, *Refactoring UI*

---

## Note 5: Color Contrast Fails Are the Most Common Accessibility Error

Studies by WebAIM (Web Accessibility In Mind) consistently show that insufficient color contrast is the most frequent WCAG failure on real websites.  
**Lesson**: Check every text/background combination with a contrast checker (e.g., Figma's built-in contrast checker, or WebAIM's contrast checker at webaim.org/resources/contrastchecker/) before finalizing color tokens. Pay special attention to disabled states, placeholder text, and secondary labels.  
**Source**: WCAG 2.1 Success Criterion 1.4.3; WebAIM Million report

---

## Note 6: Designing in Grayscale First Reveals Hierarchy Problems

When you design with color from the start, you use color to create hierarchy. If you remove the color, the hierarchy often disappears, revealing that the layout has no inherent visual weight structure.  
**Lesson**: Design initial wireframes in grayscale. Establish hierarchy through size, weight, spacing, and position. Add color only after the grayscale hierarchy is clear. If hierarchy disappears when color is removed, redesign the layout.  
**Source**: Adam Wathan & Steve Schoger, *Refactoring UI*

---

## Note 7: Variable Rewards Are the Mechanism, Not the Goal

Nir Eyal's Hook Model explains why social feeds, games, and notifications are sticky: variable rewards (you don't know if the next scroll will show something great) trigger the same dopamine response as gambling.  
**Lesson**: Understand the mechanism before applying it. Variable rewards are powerful — they can create genuine value (discovery, connection, achievement) or manipulate users against their interests. Design with the question: "Does this variable reward serve the user's own goals?"  
**Source**: Nir Eyal, *Hooked*, Chapter 5; Eyal's follow-up *Indistractable* (2019) for ethical application

---

## Note 8: A Design System Is an Agreement, Not Just a File

Many teams build a Figma component library and call it a design system. A real design system is an agreement between design and development that the components in Figma and the components in code are the same thing.  
**Lesson**: A design system without a code counterpart (Storybook, a component library) is a Figma file. The value is in the synchronization. Establish a governance process: changes to the system require agreement from both design and engineering leads before they are applied.  
**Source**: Brad Frost, *Atomic Design*, Chapter 5; Nathan Curtis, "Defining Design Systems" (Medium)
