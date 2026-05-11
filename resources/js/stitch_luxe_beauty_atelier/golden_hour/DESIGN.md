---
name: Golden Hour
colors:
  surface: '#fff8f7'
  surface-dim: '#e4d7d6'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f0'
  surface-container: '#f9ebea'
  surface-container-high: '#f3e5e5'
  surface-container-highest: '#eddfdf'
  on-surface: '#211a1a'
  on-surface-variant: '#4e4639'
  inverse-surface: '#362f2f'
  inverse-on-surface: '#fceeed'
  outline: '#807668'
  outline-variant: '#d1c5b5'
  surface-tint: '#775922'
  primary: '#775922'
  on-primary: '#ffffff'
  primary-container: '#c9a465'
  on-primary-container: '#533a03'
  inverse-primary: '#e8c17f'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#495f85'
  on-tertiary: '#ffffff'
  tertiary-container: '#94aad4'
  on-tertiary-container: '#283e62'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdeaa'
  primary-fixed-dim: '#e8c17f'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5d420b'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#b1c7f3'
  on-tertiary-fixed: '#001b3d'
  on-tertiary-fixed-variant: '#31476c'
  background: '#fff8f7'
  on-background: '#211a1a'
  surface-variant: '#eddfdf'
typography:
  h1:
    fontFamily: Cormorant Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Cormorant Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  h3:
    fontFamily: Cormorant Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.25em
  button:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system evokes the serene, opulent atmosphere of a high-end beauty salon during the transition to sunset. The aesthetic is rooted in **Atmospheric Minimalism**, combining the warmth of ivory and champagne gold with the sharp, editorial authority of deep black typography. It targets a discerning clientele looking for an escape into a space that feels both timeless and impeccably modern.

The emotional response is one of "effortless prestige"—where whitespace is used as a luxury commodity, and every element feels intentionally placed to reduce cognitive load and enhance the feeling of relaxation.

## Colors

The palette is anchored by **Warm Ivory** and **Champagne Gold**, creating a luminous, "lit-from-within" effect. 

- **Primary Accent:** Champagne Gold is reserved for primary actions and brand flourishes. 
- **Typography:** Headings use Deep Black for maximum legibility and editorial punch, while Body text uses Warm Dark Brown to maintain softness against the ivory background.
- **Sidebar:** For brand continuity and a sense of architectural framing, the sidebar remains in a rich, dark charcoal black.
- **Status Indicators:** These use a softer, desaturated pastel background with high-contrast tinted text to ensure they provide clear information without breaking the sophisticated aesthetic.

## Typography

The typography strategy relies on the tension between the classic, romantic curves of **Cormorant Garamond** and the geometric, utilitarian precision of **Montserrat**.

- **Headings:** Set in Cormorant Garamond to convey heritage and artisanal skill. Large headlines should use tighter letter-spacing for a modern editorial look.
- **Labels:** Montserrat is used for all functional UI elements (labels, tags, navigation). A signature 0.25em letter-spacing is applied to uppercase labels to create a sense of breathability and luxury.
- **Hierarchy:** Deep Black (#0D0D0D) is used for all headings to ensure they command attention, while Body text is softened to #3D3535.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop interfaces, centering content within a 1200px container to evoke the feeling of a printed high-fashion lookbook. 

Spacing is generous, favoring white space over density. Internal card padding should never drop below 24px (`md`) to ensure elements do not feel crowded. Vertical rhythm is driven by the 8px base unit, with significant "breathing room" (48px+) between major sections to maintain a relaxed user experience.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and tonal separation rather than heavy borders. 

- **Surface Layering:** The primary background is #FAF8F4. Secondary surfaces (cards) are pure #FFFFFF.
- **Shadow Profile:** Cards use an ultra-soft, diffused shadow (`0 2px 20px rgba(0,0,0,0.06)`). This creates a "hovering" effect that feels light and ethereal.
- **Transitions:** Hover states should subtly increase the shadow spread or slightly shift the gold gradient brightness, avoiding sudden shifts in elevation that might disrupt the calm aesthetic.

## Shapes

The shape language is **Soft and Architectural**. 

A modest 4px (`rounded-sm`) to 8px (`rounded-md`) corner radius is applied to cards and inputs to take the edge off the geometry without making the interface appear "bubbly" or juvenile. This maintains a level of sophisticated sharpness. 

Buttons may use slightly more rounded corners (up to 12px) to differentiate them as interactive touchpoints, but they should never be fully pill-shaped, as sharp/soft corners align better with luxury beauty branding.

## Components

### Buttons
- **Primary:** Features a linear gold gradient (e.g., #D4B782 to #C9A465) with white or deep black text. The gradient should feel metallic and subtle, not reflective.
- **Secondary:** Solid Deep Black (#0D0D0D) with white text. This provides a grounding contrast to the gold.

### Cards
Cards are the primary container for services and appointments. They must be pure white (#FFFFFF) with the defined soft shadow. Dividers within cards should be 1px solid #EDE8DF.

### Inputs & Selects
Form fields use a minimal bottom-border or a very light #EDE8DF stroke. On focus, the border transitions to Champagne Gold. Labels are always Montserrat, uppercase, with 0.25em spacing.

### Status Chips
Status chips use a "Tone-on-Tone" approach:
- **Pending:** Soft Yellow background, Ochre text.
- **Confirmed:** Pale Mint background, Deep Forest text.
- **Completed:** Light Lavender background, Royal Purple text.
- **Cancelled:** Soft Rose background, Maroon text.

### Sidebar
The sidebar is the most high-contrast element, utilizing #1A1A1A. Active states within the sidebar should use Champagne Gold for text or a left-aligned vertical border accent.