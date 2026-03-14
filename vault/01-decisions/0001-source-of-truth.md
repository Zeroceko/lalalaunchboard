# Decision 0001 - Source Of Truth

Date: 2026-03-14
Status: accepted

## Decision

The official project source of truth is the `specs/` directory in the repository root.

## Why

- It is versionable with the codebase
- It is easy to reference while implementing
- It avoids tool-specific lock-in

## Consequence

The `vault/` directory may contain notes, summaries, and decisions, but it should not become a second spec system.
