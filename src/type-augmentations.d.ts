// This file contains type augmentations for third-party libraries.
// It must be a module (note the `export {}`) so the `declare module` blocks are
// treated as augmentations rather than ambient module replacements.
export {};

// @openmrs/esm-styleguide uses the HTML `inert` attribute on Carbon's SideNav, but
// @carbon/react's SideNavProps does not declare `inert`.  Adding it here allows
// TypeScript to type-check those transitive node_modules source files without errors.
// TODO: Remove this augmentation once @carbon/react officially includes `inert` in
// SideNavProps, or when @openmrs/esm-styleguide is updated to no longer rely on it.
declare module '@carbon/react' {
  interface SideNavProps {
    inert?: boolean;
  }
}
