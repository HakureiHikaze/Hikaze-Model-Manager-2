# Specification - Internal Communication Refactor & Database Streamlining

## Overview
This track aims to replace implicit dictionary-based data passing with explicit, pre-designed Python `dataclasses`. Simultaneously, it refactors the `DatabaseManager` to a more focused, singleton-based architecture and introduces a dedicated adapter for legacy database extraction.

## Functional Requirements

### 1. Explicit Data Models
- Use `ModelRecord` and `PendingModelRecord` (defined in `shared/types/model_record.py`) as the primary vehicles for model data.
- Refactor all internal signatures to use these classes instead of raw dictionaries.

### 2. Streamlined `DatabaseManager`
- **Responsibilities:**
    - Create the database if it doesn't exist.
    - Maintain a singleton connection to the main internal database.
    - Connect to specific databases on request.
    - Retrieve one or more `ModelRecord` objects by SHA256 from the main table or relationship tables.
    - Retrieve one or more `PendingModelRecord` objects by ID from the pending/migration tables.
    - Resolve Tag IDs to Tag Names (key-value pairs).
    - Provide a generic interface for custom parameterized SQL queries.
- **Strict Typing:** All retrieval methods must return instances of the specified dataclasses, not raw SQL rows.

### 3. Legacy Database Adapter
- Location: `backend/database/migration/legacy_database_adapter.py`.
- Logic: Hardcoded to the schema of the old database version.
- Functionality: Accepts a database path and returns extracted data mapped directly to `ModelRecord` or `PendingModelRecord` lists.
- API Integration: `migration_handler` will use this adapter to fetch data before calling a (currently placeholder) migration function.

## Non-Functional Requirements
- **Stability:** The system must remain fully functional at the end of every phase.
- **Maintainability:** Clear separation between API handlers (`migration_handler`), data adapters (`legacy_database_adapter`), and the core database engine (`DatabaseManager`).
- **Typed Integrity:** Use Python type hints throughout to ensure the "Big Bang" refactor can be verified via static analysis.

## Acceptance Criteria
- [ ] `ModelRecord` and `PendingModelRecord` are the only ways model data is passed between backend modules.
- [ ] `DatabaseManager` no longer contains complex business logic, only core CRUD operations returning objects.
- [ ] Legacy database extraction works without modifying the existing main database schema.
- [ ] The `migration_handler` successfully retrieves and processes legacy records through the adapter.
- [ ] The system passes all build/runtime checks at the end of each implementation phase.

## Out of Scope
- Final implementation of the migration logic (beyond the extraction and placeholder call).
- Refactoring of the frontend state management (stays as-is, mapping from the new backend responses).
