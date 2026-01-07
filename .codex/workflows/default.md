# Project Workflow

## Guiding Principles

1. **The Job File is the Source of Truth:** All work must be tracked in `.codex/jobs/<job>/<job>.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **User Experience First:** Every decision should prioritize user experience
4. **Non-Interactive & CI-Aware:** Prefer non-interactive commands.
5. **Branch Out:** Branch out from the main development branch before starting the entire agent development process.
6. **No Automatic Testing:** Do NOT execute any automatic unit tests (e.g., `pytest`, `npm test`). All testing, including writing and verifying tests, is the exclusive responsibility of the human developer. The agent must strictly rely on manual verification steps provided to the user. **Exception:** You MUST run build commands (e.g., `npm run build`) at phase completion, before user verification, and fix any build errors first.
7. **Evidence-Based Claims:** When stating code behavior or structure, cite the exact file path and relevant lines or command output.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from the active job file (`.codex/jobs/<job>/<job>.md`) in sequential order

2. **Mark In Progress:** Before beginning work, edit the active job file and change the task from `[ ]` to `[~]`

3. **Implement Task:**
   - Write the application code necessary to fulfill the task requirements.
   - Ensure the implementation aligns with the tech stack and product guidelines.
   - Do not run build commands per task; builds are executed at phase completion before user verification.

4. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

5. **Update Job File:**
   - Read the active job file, find the line for the completed task.
   - Update its status from `[~]` to `[x]`.
   - **Do NOT commit yet.** Commits are performed at the end of the phase.

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed that also concludes a phase in the active job file.

1.  **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2.  **Run Build Before User Verification:**
    - For any frontend/TypeScript work in the phase, run the build commands (e.g., `npm run build`).
    - **Fix all build errors immediately** before moving on to user verification.

3.  **Propose a Detailed, Actionable Manual Verification Plan:**
    -   **CRITICAL:** To generate the plan, first analyze `product.md`, `product-guidelines.md`, and the active job file to determine the user-facing goals of the completed phase.
    -   You **must** generate a step-by-step plan that walks the user through the verification process, including any necessary commands and specific, expected outcomes.
    -   The plan you present to the user **must** follow this format:

        **For a Frontend Change:**
        ```
        The phase implementation is complete. For manual verification, please follow these steps:

        **Manual Verification Steps:**
        1.  **Start the development server with the command:** `npm run dev`
        2.  **Open your browser to:** `http://localhost:3000`
        3.  **Confirm that you see:** The new user profile page, with the user's name and email displayed correctly.
        ```

        **For a Backend Change:**
        ```
        The phase implementation is complete. For manual verification, please follow these steps:

        **Manual Verification Steps:**
        1.  **Ensure the server is running.**
        2.  **Execute the following command in your terminal:** `curl -X POST http://localhost:8080/api/v1/users -d '{"name": "test"}'`
        3.  **Confirm that you receive:** A JSON response with a status of `201 Created`.
        ```

        **For a Migration (Database/Schema) Change:**
        ```
        The phase implementation is complete. For manual verification, please follow these steps:

        **Manual Verification Steps:**
        1. **Stage 1 (Legacy Import):** Call `/api/migration/migrate_legacy_db` with a valid legacy path.
        2. **Verify Pending Queue:** Call `GET /api/migration/pending_models` and confirm the presence of unhashed models.
        3. **Stage 2 (Promotion):** Call `/api/migration/import_models` with a pending ID and a conflict strategy (e.g., 'override').
        4. **Verify Active Catalog:** Verify the model now appears in the `models` table with a valid SHA256.
        ```

4.  **Await Explicit User Feedback:**
    -   After presenting the detailed plan, ask the user for confirmation: "**Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed.**"
    -   **PAUSE** and await the user's response. Do not proceed without an explicit yes or confirmation.

5.  **Create Checkpoint Commit:**
    -   Stage all changes. If no changes occurred in this step, proceed with an empty commit.
    -   Perform the commit with a clear and concise message (e.g., `codex(checkpoint): Checkpoint end of Phase X`).

6.  **Attach Auditable Verification Report using Git Notes:**
    -   **Step 5.1: Draft Note Content:** Create a detailed verification report including the manual verification steps and the user's confirmation.
    -   **Step 5.2: Attach Note:** Use the `git notes` command and the full commit hash from the previous step to attach the full report to the checkpoint commit.

7.  **Get and Record Phase Checkpoint SHA:**
    -   **Step 6.1: Get Commit Hash:** Obtain the hash of the *just-created checkpoint commit* (`git log -1 --format="%H"`).
    -   **Step 6.2: Update Job File:** Read the active job file, find the heading for the completed phase, and append the first 7 characters of the commit hash in the format `[checkpoint: <sha>]`.
    -   **Step 6.3: Write Job File:** Write the updated content back to the job file.

8. **Commit Job File Update:**
    - **Action:** Stage the modified job file.
    - **Action:** Commit this change with a descriptive message following the format `codex(job): Mark phase '<PHASE NAME>' as complete`.

9.  **Announce Completion:** Inform the user that the phase is complete and the checkpoint has been created, with the detailed verification report attached as a git note.

### Quality Gates

Before marking any task complete, verify:

- [ ] Code follows project's code style guidelines (as defined in `code_styleguides/`)
- [ ] For TS/Frontend work in the phase: run `npm run build` before user verification and resolve any build errors.
- [ ] Evidence cited for code claims (file paths and/or command output).
- [ ] All public functions/methods are documented (e.g., docstrings, JSDoc, GoDoc)
- [ ] Type safety is enforced (e.g., type hints, TypeScript types, Go types)
- [ ] Works correctly on mobile (if applicable)
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities introduced

## Auxiliary Development Tools

### Discrepancy Reporting

**Purpose:** Document and resolve architectural or implementation gaps discovered during audits or development.

**Location:** `.codex/manual_discrepancies.md`

**Workflow:**
1.  **Identify Discrepancy:** During development or audit, identify a gap between design and implementation.
2.  **Draft Report:** Add a section to `.codex/manual_discrepancies.md` with a clear title, evidence, and proposed resolution.
3.  **Review & Fix:** Discuss findings with the user. Add a user approval line under each item before action.
4.  **Finalize:** Mark the discrepancy as resolved or deferred, and record follow-up work in the relevant job.

## Development Commands

**AI AGENT INSTRUCTION: This section should be adapted to the project's specific language, framework, and build tools.**

### Setup
```bash
# Example: Commands to set up the development environment (e.g., install dependencies, configure database)
# e.g., for a Node.js project: npm install
# e.g., for a Go project: go mod tidy
```

### Daily Development
```bash
# Example: Commands for common daily tasks (e.g., start dev server, lint, format)
# e.g., for a Node.js project: npm run dev, npm run lint
# e.g., for a Go project: go run main.go, go fmt ./...
```

### Before Committing
```bash
# Example: Commands to run all pre-commit checks (e.g., format, lint, type check)
# e.g., for a Node.js project: npm run check
# e.g., for a Go project: make check (if a Makefile exists)
```

## Code Review Process

### Self-Review Checklist
Before requesting review:

1. **Functionality**
   - Feature works as specified
   - Edge cases handled
   - Error messages are user-friendly

2. **Code Quality**
   - Follows style guide
   - DRY principle applied
   - Clear variable/function names
   - Appropriate comments

3. **Security**
   - No hardcoded secrets
   - Input validation present
   - SQL injection prevented
   - XSS protection in place

4. **Performance**
   - Database queries optimized
   - Images optimized
   - Caching implemented where needed

5. **Mobile Experience**
   - Touch targets adequate (44x44px)
   - Text readable without zooming
   - Performance acceptable on mobile
   - Interactions feel native

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): Add remember me functionality"
git commit -m "fix(posts): Correct excerpt generation for short posts"
git commit -m "test(comments): Add tests for emoji reaction limits"
git commit -m "style(mobile): Improve button touch targets"
```

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Code passes all configured linting and static analysis checks
3. **Build Verification:** `npm run build` passes successfully before user verification (for frontend/TS phases).
4. Works beautifully on mobile (if applicable)
5. Implementation notes added to the active job file (if any)
6. Task marked as `[x]` in the active job file

## Emergency Procedures

### Critical Bug in Production
1. Create hotfix branch from main
2. Implement minimal fix
3. Deploy immediately
4. Document in the active job file

### Data Loss
1. Stop all write operations
2. Restore from latest backup
3. Verify data integrity
4. Document incident
5. Update backup procedures

### Security Breach
1. Rotate all secrets immediately
2. Review access logs
3. Patch vulnerability
4. Notify affected users (if any)
5. Document and update security procedures

## Deployment Workflow

### Pre-Deployment Checklist
- [ ] No linting errors
- [ ] Mobile testing complete
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created

### Deployment Steps
1. Merge feature branch to main
2. Tag release with version
3. Push to deployment service
4. Run database migrations
5. Verify deployment
6. Test critical paths
7. Monitor for errors

### Post-Deployment
1. Monitor analytics
2. Check error logs
3. Gather user feedback
4. Plan next iteration

## Continuous Improvement

- Review workflow weekly
- Update based on pain points
- Document lessons learned
- Optimize for user happiness
- Keep things simple and maintainable
