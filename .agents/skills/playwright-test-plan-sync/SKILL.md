---
name: playwright-test-plan-sync
description: "Review or synchronize a test plan against implemented Playwright assertions, classify automated, partial, and missing coverage, and report evidence-backed gaps. Use for test-plan maintenance and coverage mapping, not test implementation or lint configuration."
---

# Playwright Test Plan Sync

Keep the test plan consistent with what the test suite actually verifies.
Coverage describes implemented assertions, not whether tests have passed.

## Scope and inputs

- For a review request, report findings without editing. For synchronization,
  update the requested plan and summarize the changes.
- In this repository, default to `TEST_PLAN.md`, `tests/`, and
  `playwright.config.ts`, resolved from the repository root. Honor explicitly
  supplied paths and follow the configured test directories and project matches.
- Read repository agent instructions and `CODING_STANDARDS.md` when present;
  refer to their conventions instead of duplicating them in the plan.
- Keep test implementation and configuration changes outside synchronization
  unless the user separately requests them. Static coverage mapping does not
  require installing dependencies, running browsers, or accessing credentials.

## Map expected outcomes to evidence

Read each scenario's expected results and locate the corresponding test bodies.
Use test titles and tags to find candidates, then inspect their assertions.
Follow Page Objects, fixtures, setup, and helpers where they affect the evidence.
Navigation, clicks, setup actions, and comments alone do not verify an outcome.

Account for parameterized cases, project selection, dependencies, skipped tests,
and conditional execution. Flag assertions that exist but are excluded or skipped;
do not present them as active coverage. If evidence cannot be inspected, report
the uncertainty rather than treating it as proof of missing coverage.

Evaluate every part of a compound expected result. For example, a redirect after
logout does not establish that protected access is rejected, and creating a
resource does not establish that editing or assignment works. Identify the
unsupported parts explicitly. Assertions inside setup or cleanup count only for
the outcome they actually establish.

Use the plan's definitions when supplied. Otherwise use:

- **Automated:** all expected outcomes have corresponding active assertions.
- **Partial:** some expected outcomes have active assertions; others do not.
- **Missing:** no corresponding active assertion exists in the inspected scope.

Keep execution results separate. A mapped assertion may still fail at runtime;
claim a pass only when supported by an actual run and identify its scope.

## Update the plan

Preserve scenario IDs, relevant manual scenarios, and the existing structure.
Correct coverage labels and test references, and explain partial coverage or
execution exclusions in the existing notes format. Prefer a file plus test title
when a file contains several scenarios; use line references in reported findings
when they help locate the evidence.

Add distinct implemented scenarios absent from the plan where useful. Ground new
expected behavior in available requirements or assertions, and distinguish
observed implementation from a confirmed requirement. Do not invent product
requirements or weaken an expected result merely to label it automated.
Report unresolved requirement conflicts as gaps or questions.

## Verify and report

Recheck changed rows against their cited tests. Verify references resolve, IDs
remain unique, and partial rows identify the unasserted outcomes. Inspect the diff
for unrelated changes and use relevant non-mutating documentation checks where
available; browser execution is unnecessary for a documentation-only sync.

Report the updated coverage, remaining gaps, and inspection or execution limits.
For review mode, provide actionable findings with plan and test references.
