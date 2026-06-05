# TOOLS AND STANDARDS — ORCHESTRATOR AGENT

## Project and Task Management Tools

### Jira (Atlassian)
**Type**: Enterprise project management and issue tracking  
**URL**: https://www.atlassian.com/software/jira  
**Use Cases**:
- Sprint planning and backlog management
- Kanban boards with configurable WIP limits
- Roadmap planning (epics and versions)
- Velocity charts, burndown charts, cumulative flow diagrams
- Integration with Confluence (documentation), Bitbucket (code), and CI/CD pipelines

**Key Features for Orchestration**:
- Custom workflows with transition rules
- Automation rules (auto-assign, status transitions)
- Advanced Roadmaps for multi-team planning (formerly Portfolio for Jira)
- JQL (Jira Query Language) for custom dashboards and reports

---

### Trello (Atlassian)
**Type**: Visual kanban board tool  
**URL**: https://trello.com  
**Use Cases**:
- Lightweight Kanban for small teams
- Personal task management
- Project templates and checklists

**Key Features**:
- Butler automation for rule-based card movement
- Power-Ups for time tracking, calendar view, and integrations
- Card aging (visual indicator of stale cards)

---

### Linear
**Type**: Modern issue tracker optimized for software teams  
**URL**: https://linear.app  
**Use Cases**:
- Sprint/cycle management with automatic start/end
- Roadmap visualization (quarterly and annual)
- Git integration for auto-status updates from commits and PRs

**Key Features**:
- Triage inbox for incoming requests
- Priority-based ordering with keyboard shortcuts
- Analytics: cycle time, lead time, completion rate

---

### Notion
**Type**: All-in-one workspace (docs, databases, wikis, tasks)  
**URL**: https://www.notion.so  
**Use Cases**:
- Sprint documentation and retrospective notes
- Knowledge base alongside project boards
- Lightweight project tracking with database views (Board, Calendar, Gantt)

---

### Monday.com
**Type**: Work OS for project and workflow management  
**URL**: https://monday.com  
**Use Cases**:
- Cross-functional project tracking
- Workload views for capacity management
- Automations for dependency tracking and notifications

---

## Standards and Methodologies

### Scrum Guide (Schwaber & Sutherland)
**Version**: November 2020  
**URL**: https://scrumguides.org  
**Description**: The official, minimal definition of Scrum. All Scrum implementations should be validated against this document.

### Kanban Method — Kanban University
**URL**: https://kanban.university  
**Description**: The formal body of knowledge for the Kanban Method as defined by David J. Anderson and the Kanban University consortium. Includes maturity models and certification tracks.

### PMI Agile Practice Guide
**Publisher**: Project Management Institute / Agile Alliance (2017)  
**Description**: A joint PMI/Agile Alliance guide on applying agile practices alongside traditional project management. Covers hybrid approaches and governance.

### DORA Metrics (DevOps Research and Assessment)
**Source**: Google Cloud / DORA  
**Four Key Metrics**:
- Deployment Frequency
- Lead Time for Changes
- Change Failure Rate
- Mean Time to Recovery (MTTR)

**Relevance**: Provides objective measures of delivery performance that Orchestrator can track and optimize.
