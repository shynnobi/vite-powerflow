# AI Pair Programming & Cursor Rules

## Introduction

This guide explains how to leverage AI pair programming in Vite PowerFlow using Cursor rules for a collaborative and high-quality development workflow. The `.cursor/rules` directory provides explicit instructions for the AI assistant, ensuring it follows your team's standards and workflows—whether you use traditional or AI-powered tools like [Cursor](https://www.cursor.so/). This approach guarantees a seamless, high-quality experience for all contributors.

## Why AI Pair Programming?

- Accelerates development by providing intelligent code suggestions and automation.
- Ensures consistency by enforcing project-specific standards and workflows.
- Facilitates onboarding and knowledge sharing for new contributors.
- Complements traditional development practices without replacing them.

## How Cursor Rules Work

Cursor reads the rules in `.cursor/rules/` to adapt its behavior as your AI pair programmer.
Each rule file describes a specific aspect of the workflow, coding standards, or communication protocol.

## Overview of Rule Files

- **code-standards.mdc**: Coding standards for the project (e.g., TypeScript, React, naming conventions).
- **development-methodology.mdc**: Methodologies to follow (e.g., TDD, atomic commits, SoC).
- **expected-AI-behavior.mdc**: How the AI should interact, suggest, and validate code.
- **github-cli-integration.mdc**: How to use GitHub CLI efficiently in the workflow.
- **github-pr-conventions.mdc**: Pull request standards and templates.
- **git-practices.mdc**: Commit message conventions and best practices.
- **interaction-protocol.mdc**: How the AI should communicate and interact with the user.
- **language-policy.mdc**: Language and naming conventions for code and documentation.
- **documentation-versioning.mdc**: How to manage documentation and versioning.
- **project-architecture-principles.mdc**: Architectural guidelines for the project.
- **ecosystem-convention.mdc**: How to align with ecosystem and tool-specific conventions.
- **technical-AI-posture.mdc**: The expected technical rigor and posture of the AI assistant.

## Development Plan Generation

Before starting any new project, use the Development Plan Generator Prompt (`workflows/DEVELOPMENT_PLAN_PROMPT.md`) to create a structured development plan. This prompt helps you:

- Define clear user stories and requirements
- Create a feature-slice based MVP approach
- Establish a TDD workflow with explicit test-writing steps
- Set up Git workflow integration with proper conventions
- Define milestones and versioning strategy

The generated plan serves as a roadmap for both you and the AI assistant, ensuring:

- Consistent understanding of project goals
- Clear progression through development phases
- Proper test coverage from the start
- Incremental feature delivery
- Better collaboration between human and AI pair programmers

## Customizing AI Behavior

You can edit or add rules in `.cursor/rules/` to tailor the AI's behavior to your team's needs.
For example, you can enforce stricter code review, change commit message formats, or adapt the interaction style.

## Best Practices

- Keep rules concise and focused on one topic per file.
- Update rules as your project evolves or as your team's workflow changes.
- Review the rules with your team to ensure alignment.
- Always start new projects with the Development Plan Generator Prompt.
- Use the generated plan to guide both human and AI development efforts.

## Further Reading

- [Cursor Documentation](https://docs.cursor.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**In summary:**
The `.cursor/rules` directory is the backbone of the AI pair programming experience in this starter.
It ensures that every contributor—human or AI—follows the same high standards and workflow, making collaboration seamless and efficient.
