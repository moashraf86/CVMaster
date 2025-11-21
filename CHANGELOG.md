# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).

## [1.7.2] - 2025-11-21

### Added

- extend skillsLayout type to include grid (columns), grid (rows), inline

### Fixed

- add "skillsLayout" to pdfSetting for legacy users

## [1.7.0] - 2025-11-20

### Added

- Added new "inline" and "grid" layout options to Technical Skills section
- Updated resume store and types to support layout selection

## [1.6.0] - 2025-10-20

### Fixed

- Restored broken AI functionality by replacing the deprecated model with the new one.

## [v1.5.0] - 2025-09-10

### Changed

- Replaced existing logo and favicon images with updated versions.
- Modified the site web manifest to update the app name and color scheme.
- Updated cvmaster-ui.png for README.md

### Added

- Introduced a new `Logo` component for better code organization and reusability in the `Header` component.

## [v1.4.0] - 2025-08-25

### Changed

- Improved UI consistency across components
- Enhanced drag-and-drop labels to sync with section titles
- Standardized icon positioning (icon before text)
- Refined theme toggle animations

### Fixed

- Better mobile layout handling with dynamic viewport heights
- Resolved layout issues on devices with notches
- Removed debug console logs

## [v1.3.0] - 2025-08-23

### Added

- Introduced **custom icons** for better UI clarity.
- Added **SortableKeyword** component (drag-and-drop skills).
- Introduced **dropdown menu** for improved mobile navigation.

### Changed

- Separated **AppLoader** into its own file for cleaner structure.
- General UI/UX refinements across dialogs and inputs.

## [v1.2.1] - 2025-08-17

### Changed

- Improved error handling for AI model rate limit exceeded.
- Updated **ReviewCvDialog.tsx** to use a more appropriate loading state.

---

## [v1.2.0] - 2025-08-17

### Added

- Implemented **AI-powered CV review** with detailed analysis, scoring, and personalized recommendations.
- Updated **README.md** with enhanced credits and acknowledgments.

### Changed

- Improved overall accuracy and insights for CV evaluation.

---

## [v1.1.0] - 2025-08-16

### Added

- **Enhanced CV Management** features.
- **Import/Export options** for CV data.
- Improved **PDF export** quality and formatting.
- Major **UI/UX enhancements** for a smoother experience.

---

## [v1.0.0] - 2025-08-15

### Initial Release

- First stable release after beta testing.
- Included core CV builder features and editor.
