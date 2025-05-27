# Project Generator

## Introduction

This generator creates a flexible starting point for MVP development, optimized for pair programming with AI. It follows an MVP-first approach with TDD and Git workflow integration.

## Project Generation Progress

- [ ] Vision Document (`[PROJECT_NAME]_VISION.md`)
- [ ] Roadmap (`[PROJECT_NAME]_ROADMAP.md`)

## Important Process Rules

1. **Incremental Development**

   - One feature at a time
   - Complete validation at each step
   - Clear progression path

2. **TDD Approach**

   - Write tests first
   - Implement to pass tests
   - Validate against requirements

3. **Git Workflow**

   - Feature branches
   - Pull requests with template
   - Code review
   - Atomic commits

4. **Code Quality**
   - Follow SOLID principles
   - Apply DRY, KISS, YAGNI
   - Maintain separation of concerns
   - Write clean, documented code

## Required Input

```
Project name: [PROJECT_NAME]
Project type: [PROJECT_TYPE]
Core technologies: [TECHNOLOGIES]
Key features (3-5 max):
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]
```

## Output Files

1. `[PROJECT_NAME]_VISION.md`
2. `[PROJECT_NAME]_ROADMAP.md`

## Development Plan Structure

### Phase 0: Vision & Scope

1. **Project Overview**

   - Define project name, type, and technologies
   - List key features
   - Set high-level goals
   - [VALIDATION] Update `[PROJECT_NAME]_VISION.md`

2. **User Stories**

   - Write stories in format: "As a [user], I want to [action], So that [benefit]"
   - Define acceptance criteria
   - [VALIDATION] Add to `[PROJECT_NAME]_VISION.md`

3. **User Flows**

   - Create flow diagrams using Mermaid.js
   - Include main paths and error scenarios
   - [VALIDATION] Add to `[PROJECT_NAME]_VISION.md`

4. **MVP Scope**

   - Define core features
   - Set priorities
   - [VALIDATION] Add to `[PROJECT_NAME]_VISION.md`

5. **Vision Document Validation**
   - [VALIDATION] Present complete Vision document to user
   - [VALIDATION] Get explicit approval before proceeding to Roadmap
   - [VALIDATION] Make any requested modifications
   - [VALIDATION] Confirm final Vision document

### Phase 1: Development Roadmap

1. **Roadmap Structure**

   The roadmap will be saved as `[PROJECT_NAME]_ROADMAP.md` with:

   - **Features**

     - Feature name with checkbox `[ ]` or `[x]`
     - Branch name
     - Atomic tasks with checkboxes, adapted to each feature:
       - Tasks should be specific to the feature being implemented
       - Each task should be a single, complete operation
       - Tasks should follow TDD approach when applicable
       - Example structure (to be adapted per feature):
         - [ ] TASK-1: Write tests for [specific feature functionality]
         - [ ] TASK-2: Implement [specific feature functionality]
         - [ ] TASK-3: Write tests for [specific feature integration]
         - [ ] TASK-4: Implement [specific feature integration]
         - [ ] TASK-5: Create component stories in Storybook
         - [ ] TASK-6: Test component in Storybook
         - [ ] TASK-7: Create PR with template

   - **Dependencies**

     - Feature dependencies
     - Implementation order
     - Feature combinations

   - **MVP Tracking**
     - Feature completion status
     - User story coverage (linked to `[PROJECT_NAME]_VISION.md`)
     - Test coverage by category:
       - Unit Tests
       - Component Tests
       - Integration Tests
       - Storybook Stories
     - Component documentation status:
       - [ ] Component stories created
       - [ ] Stories cover all variants
       - [ ] Stories include interactions
       - [ ] Stories are documented

2. **Roadmap Creation**

   - Create file following the structure above
   - Link tasks to User Stories from `[PROJECT_NAME]_VISION.md`
   - Ensure TDD approach is reflected in task structure
   - [VALIDATION] File created and structure verified

3. **Feature Planning**
   - Break down features into tasks
   - Define dependencies
   - Plan implementation order
   - Link each task to corresponding User Stories
   - [VALIDATION] Add to `[PROJECT_NAME]_ROADMAP.md`

### Phase 2: Feature Implementation

1. **Development**
   - Write tests first (TDD)
   - Implement feature
   - Validate against User Stories
   - Create PR using template:
     ```bash
     gh pr create --title "[type]: [description]" --body "$(cat .github/pull_request_template.md)"
     ```
   - [VALIDATION] Update roadmap with implementation status

### Phase 3: Project Progress Analysis

1. **Feature Analysis**

   - Review completed features
   - Analyze dependencies
   - Check MVP progress
   - Verify User Story coverage
   - [VALIDATION] Update roadmap with analysis

2. **Next Feature Selection**
   - Identify next feature based on:
     - Dependencies
     - User story priorities
     - MVP requirements
   - [VALIDATION] Update roadmap with next feature

## How to Use

1. Provide the required input
2. Work through each phase
3. Validate each step
4. Update files after validation

_Note: This is a flexible template. Feel free to adapt it to your needs._
