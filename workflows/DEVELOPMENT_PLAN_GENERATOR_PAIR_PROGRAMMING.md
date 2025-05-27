# Development Plan Generator - Pair Programming Approach

This prompt generates a structured development plan for your project, serving as a flexible starting point for MVP development. The plan is designed to be a minimal foundation that can be built upon, not a rigid structure, and is optimized for pair programming with AI. The plan follows an MVP-first approach with TDD and Git workflow integration.

_Feel free to modify, simplify, or expand this plan as your project evolves, maintaining a lean and efficient development process._

## Plan Generation Progress

### Vision Document Progress

- [ ] Project Overview defined and validated
- [ ] User Stories defined and validated
- [ ] User Flows defined and validated
- [ ] MVP Scope defined with core features
- [ ] Vision document completed

### Development Plan Progress

- [ ] First feature identified and tasks defined
- [ ] Development plan completed

## Important Process Rules

1. **Incremental Development**

   - Work on one feature at a time
   - Create a new branch for each feature
   - Follow TDD approach within each feature
   - Validate each step before moving forward

2. **Feature Development Cycle**

   - Define minimal model needed for the feature
   - Write tests for the model
   - Implement the model
   - Write tests for the feature
   - Implement the feature
   - Create PR for review
   - Only move to next feature after validation

3. **Project Structure Analysis**
   The AI should:

   - Scan the project directory structure
   - Identify patterns in file organization
   - Analyze existing test locations and naming
   - Review component architecture
   - Map data flow patterns
   - Document naming conventions
   - [ONLY AFTER VALIDATION] Include analysis in technical guidelines

4. **Feature Progression Guidelines**
   The AI should:

   - Analyze user stories to identify dependencies between features
   - Review completed features to determine next logical steps
   - Consider technical dependencies when suggesting next features
   - Look for patterns in user flows to identify related features
   - Suggest feature combinations that enhance user experience
   - Propose optimizations based on completed features
   - Maintain a balance between new features and improvements

5. **MVP Completion Criteria**
   The AI should:

   - Track progress against defined user stories
   - Monitor completion of core features
   - Validate against MVP scope
   - Check for critical path completion
   - Ensure all user flows are functional
   - Verify test coverage
   - Flag when MVP criteria are met

6. **Validation Steps**
   - Present content for review
   - Wait for explicit validation
   - Only then update the files
   - Keep track of validated vs pending content

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

The development plan will be saved in the `workflows` directory with the following naming convention:

- Vision file: `[PROJECT_NAME]_VISION.md`
- Development plan file: `[PROJECT_NAME]_ROADMAP.md`

## Development Plan Structure

The generated development plan will follow this structure:

1. **Features**

   - Each feature with a checkbox `[ ]` or `[x]`
   - Branch name
   - List of tasks with checkboxes
   - Subtasks for each task

2. **Feature Dependencies**

   - List of identified dependencies between features
   - Suggested order of implementation
   - Potential feature combinations
   - Optimization opportunities

3. **MVP Completion Tracking**

   - Core features completion status
   - User stories coverage
   - Critical paths validation
   - Test coverage metrics
   - MVP readiness indicators

## Interactive Development Process

### Phase 0: Vision & Scope Definition

Let's start by defining the project vision together:

1. **Project Overview**

   - Review and refine project name, type, and technologies
   - Discuss and validate key features
   - Define high-level goals
   - [ONLY AFTER VALIDATION] Update `[PROJECT_NAME]_VISION.md` with validated content

2. **User Personas**

   - Define primary user personas
   - Include key characteristics and goals
   - Map personas to user stories
   - Validate with you
   - [ONLY AFTER VALIDATION] Add to `[PROJECT_NAME]_VISION.md`

3. **User Stories**

   - Work together to define user stories
   - Format: "As a [user], I want to [action], So that [benefit]"
   - Validate each story with you
   - [ONLY AFTER VALIDATION] Add validated stories to `[PROJECT_NAME]_VISION.md`

4. **User Flows**

   - Create flow diagrams using Mermaid.js
   - Format:
     ```mermaid
     graph TD
         A[Start] --> B[Step 1]
         B --> C[Step 2]
         C --> D[End]
     ```
   - Include all main user journeys
   - Add decision points and branches
   - Validate with you
   - [ONLY AFTER VALIDATION] Add to `[PROJECT_NAME]_VISION.md`

5. **MVP Scope**

   - Define core features for MVP
   - Prioritize features based on user stories
   - Get your validation
   - [ONLY AFTER VALIDATION] Add validated core features to `[PROJECT_NAME]_VISION.md`

6. **Vision Document Validation**
   - Present complete vision document for review
   - Allow for modifications and refinements
   - Get explicit validation of:
     - Project overview and goals
     - User personas and stories
     - User flows and diagrams
     - MVP scope and features
   - [ONLY AFTER VALIDATION] Proceed to roadmap generation

### Phase 1: Roadmap Generation

Only after vision document validation:

1. **Technical Structure Planning**

   - Define project architecture
   - Plan file organization
   - Set up development environment
   - Get your validation
   - [ONLY AFTER VALIDATION] Add to `[PROJECT_NAME]_ROADMAP.md`

2. **Feature Breakdown**

   - Break down features into tasks
   - Define dependencies
   - Plan implementation order
   - Get your validation
   - [ONLY AFTER VALIDATION] Add to `[PROJECT_NAME]_ROADMAP.md`

3. **Development Timeline**
   - Estimate task durations
   - Set milestones
   - Define version releases
   - Get your validation
   - [ONLY AFTER VALIDATION] Add to `[PROJECT_NAME]_ROADMAP.md`

### Phase 2: First Feature Development

Only after roadmap validation:

1. **Feature Planning**

   - Review user stories for the first feature
   - Define minimal model needed
   - Plan implementation steps
   - Get your validation
   - [ONLY AFTER VALIDATION] Add feature plan to `[PROJECT_NAME]_ROADMAP.md`

2. **Model Development**

   - Write tests for the model
   - Implement the model
   - Validate model implementation
   - [ONLY AFTER VALIDATION] Update development plan

3. **Feature Implementation**
   - Write tests for the feature
   - Implement the feature
   - Create PR for review
   - Get your validation
   - [ONLY AFTER VALIDATION] Update development plan

### Phase 3: Next Feature Planning

Only after the first feature is fully validated:

1. **Feature Selection**

   - Review remaining user stories
   - Select next feature to implement
   - Define minimal model needed
   - Get your validation

2. **Feature Planning**
   - Define implementation steps
   - Plan testing approach
   - Get your validation
   - [ONLY AFTER VALIDATION] Update development plan

## How to Use This Generator

1. Start by providing the required input
2. We'll work through each phase together
3. I'll ask questions and get your input
4. We'll validate each step before moving forward
5. I'll generate/update files as we progress

This approach ensures that:

- You maintain control over the development plan
- The plan reflects your vision and requirements
- We can adjust and refine as needed
- The process is more engaging and interactive
- Development is incremental and focused
- Each feature is properly validated before moving forward
