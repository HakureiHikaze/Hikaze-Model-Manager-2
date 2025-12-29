# Specification - Model Details Implementation & Image Management

## Overview
This track implements the "Model Details" pane (right sidebar) functionality. It transitions from placeholders to a fully interactive interface for viewing technical metadata, managing multiple sample images, and editing model attributes/tags. It also involves correcting the architectural decision regarding the single-model fetch API and refactoring the image delivery system.

## Functional Requirements

### 1. API Corrections & Backend Updates
- **Re-enable/Implement `GET /api/models/{sha256}`:** Returns the full database record for a model (including `meta_json`).
- **New `GET /api/get_img_num?sha256={sha256}`:** Returns the count of sample images associated with a hash.
- **Refactor `GET /api/images/{sha256}`:** Update to use query parameters for sequence: `/api/images/{sha256}?seq={seq}&quality=...`.
- **New `DELETE /api/images/delete?sha256={sha256}&seq={seq}`:** Deletes a specific sample image, shifts subsequent image sequences forward, and updates filesystem/database records.
- **New `POST /api/tags_add`:** Accepts `{"newtags": ["name1", "name2"]}` and returns a list of `{id, name}` objects.

### 2. Frontend - Image Gallery Component
- **Properties:** Accepts `sha256`.
- **UI/UX:**
    - 3:4 Aspect ratio.
    - Hover effects: Circular navigation buttons (prev/next) and central "Add/Delete" buttons.
    - Pagination dots at the bottom.
    - Asynchronous loading: Request image count first, then fetch images by sequence.
    - Refresh logic: Re-fetch state automatically after successful upload or deletion.

### 3. Frontend - Interactive Tag Chips Component
- **Features:**
    - Display tags as chips with "trash" icons for removal.
    - Autocomplete input for existing tags.
    - Multi-stage save: Create new tags first via `POST /api/tags_add`, then include resulting IDs in the model `PATCH`.
    - Error handling: Alert user on tag creation failure; allow partial save of existing tags.

### 4. Frontend - Details Form & Integration
- **Selection Logic:** Selecting a model in the library highlights it (green border) and triggers data fetching.
- **Form Fields:** Render editable fields (Name, Path, etc.) and read-only technical data from the full model object.
- **Saving:** Use `PATCH /api/models/{sha256}` to persist changes.

### 5. Model Library Card Refactor
- **Image Cycling:** Card previews should cycle through available sample images with a fade transition.
- **Real-time Updates:** Cycling queue must refresh if images are added or deleted.

## Non-Functional Requirements
- **Performance:** Use placeholders/skeleton states while fetching full model details. Use asynchronous tasks for gallery playback to avoid UI blocking.
- **Fidelity:** Maintain the GitHub-dark aesthetic.

## Acceptance Criteria
- [ ] Clicking a model correctly populates the details pane with full data and images.
- [ ] Images can be navigated, added, and deleted.
- [ ] Deleting an image correctly re-sequences remaining images on the server.
- [ ] Tags can be added (new or existing) and removed.
- [ ] The "Save" button successfully persists form changes and new tag associations.
- [ ] `GET /api/models/{sha256}` is documented and functional.
- [ ] Library cards cycle through preview images.

## Out of Scope
- Bulk editing of multiple models at once.
- Advanced image editing (cropping/filtering).
