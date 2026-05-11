---
name: Dark Luxury Spa Identity
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d1c5b5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9a8f81'
  outline-variant: '#4e4639'
  surface-tint: '#e8c17f'
  primary: '#e8c17f'
  on-primary: '#422c00'
  primary-container: '#c9a465'
  on-primary-container: '#533a03'
  inverse-primary: '#775922'
  secondary: '#f7bd48'
  on-secondary: '#412d00'
  secondary-container: '#ba880f'
  on-secondary-container: '#392700'
  tertiary: '#cac6be'
  on-tertiary: '#32302b'
  tertiary-container: '#ada9a2'
  on-tertiary-container: '#403e39'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdeaa'
  primary-fixed-dim: '#e8c17f'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5d420b'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f7bd48'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#e7e2da'
  tertiary-fixed-dim: '#cac6be'
  on-tertiary-fixed: '#1d1c17'
  on-tertiary-fixed-variant: '#494741'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.2'
  h3:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
  label-accent:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.3em
  caption:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '300'
    lineHeight: '1.4'
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 128px
---

## Brand & Style

The design system is rooted in the "Dark Luxury" aesthetic, blending the quiet confidence of high-fashion minimalism with the indulgent warmth of a premium spa. It evokes an emotional response of exclusivity, serenity, and timelessness, mirroring the atmosphere of a flagship boutique in Paris or Milan.

The style is a fusion of **Minimalism** and **Tactile Glamour**. It utilizes heavy negative space to allow content to breathe, emphasizing quality over quantity. Visual interest is generated through material-like textures—such as gold-leaf gradients and thin metallic strokes—rather than complex layouts. The interface should feel like a digital concierge: effortless, polished, and impeccably organized.

## Colors

The palette is anchored by a "Black-on-Black" foundation to create a sense of depth and mystery. **Deep Black (#0D0D0D)** serves as the canvas, while **Very Dark Charcoal (#141414)** defines the primary sections.

Accents are strictly reserved for high-value interactions and brand elements. **Champagne Gold** and **Rose Gold** provide a shimmering contrast, often applied via a three-point linear gradient to simulate the reflection of light on polished metal. **Warm White (#F5F0E8)** is used for all primary reading text to ensure high legibility against the dark background while maintaining a softer, more premium feel than pure white.

## Typography

Typography in this design system follows an editorial hierarchy. **EB Garamond** is the voice of the brand—sophisticated and romantic. It should be used in Light or Regular weights for all major headings.

**Montserrat** provides a clean, modern counterpoint for utilitarian text. By utilizing the Light (300) weight for body copy, the design system maintains a delicate, high-fashion look. A specialized **Label Accent** style is used for navigation, categories, and small headers; it features heavy letter-spacing and uppercase styling to create a sense of architectural structure and rhythm across the page.

## Layout & Spacing

The layout philosophy emphasizes **generous breathing room**. This design system uses a fixed grid for content density control, centered within the viewport. To evoke the feeling of a premium physical magazine, margins are significantly larger than standard web applications.

Vertical rhythm is governed by a 128px section gap, forcing the user to focus on one "moment" of the experience at a time. Elements should rarely feel crowded; if a screen feels busy, increase the white space (or "black space") between blocks. Asymmetrical placements are encouraged for imagery to break the grid and add a bespoke, curated feel.

## Elevation & Depth

In a dark luxury environment, traditional shadows can appear muddy. Instead, the design system uses **Tonal Layering** and **Luminosity** to communicate depth:

1.  **Surfaces:** Elements sit on a slightly lighter charcoal surface (`#1A1A1A`) with a 1px gold border at 30% opacity. This creates a "bezel" effect rather than a shadow.
2.  **Glows:** Active elements or hovered cards should emit a very soft, diffused gold outer glow (`rgba(201,164,101,0.15)`) rather than a black shadow.
3.  **Backdrop Blurs:** For overlays or navigation bars, use a heavy background blur (20px+) combined with a 60% opaque black fill to maintain context while ensuring the content feels like it's floating on a sheet of dark glass.

## Shapes

The design system utilizes **Sharp (0px)** corners for structural elements, containers, and imagery. This architectural rigidity communicates discipline and high-end precision.

A subtle exception is made for interactive components like small buttons or tags, which may use a **Soft (4px)** radius if the sharp edge interferes with icon placement. However, the primary aesthetic remains linear and geometric. Thin gold lines (0.5pt to 1pt) are used as decorative separators, often featuring a centered sparkle glyph (✦) to signify "The Star Treatment."

## Components

### Buttons
Primary buttons use the linear gold gradient with dark charcoal text. They feature a "shimmer" animation on hover—a diagonal white light ray that sweeps across the gradient. Secondary buttons are "Ghost" style: 1px champagne gold borders with warm white text.

### Inputs
Input fields are minimalist, consisting only of a bottom border (1px gold). Labels use the **Label-Accent** typography and float above the line when the field is active.

### Cards
Service cards feature #1A1A1A backgrounds with a 1px subtle gold border. On hover, the border opacity increases to 100% and the card scales up by 1% to create a "lift" effect.

### Decorative Elements
- **Separators:** A horizontal line with a ✦ glyph in the center: `——✦——`.
- **Ribbons:** Fluid, vector-based ribbon decorations in low-opacity gold (`rgba(201,164,101,0.05)`) should drift behind content sections to add movement.
- **Empty States:** Use elegant, single-stroke gold line art depicting silhouettes of botanical elements or facial profiles to maintain the premium aesthetic even when data is missing.