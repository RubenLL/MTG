# MTG Deck Analyzer - Complete Memory Registry

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [📋 User Stories](#-user-stories)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [🔌 API Specifications](#-api-specifications)
- [📊 Monitoring & Instrumentation](#-monitoring--instrumentation)
- [🚨 Error Handling Patterns](#-error-handling-patterns)
- [🎲 MTG Format Rules](#-mtg-format-rules)
- [📤 Import/Export Formats](#-importexport-formats)
- [⏱️ Project Timeline](#-project-timeline)
- [🛠️ Technical Decisions](#️-technical-decisions)

---

## 🎯 Project Overview

**ID:** `mtg_project_overview`
**Tags:** project, mtg, deck-analyzer, overview

**Content:**
MTG Deck Analyzer Project - Complete system for analysis and validation of Magic: The Gathering decks. Web application that allows players to validate the legality of their decks across different formats, analyze structure and composition, and obtain improvement recommendations. Implemented with modern stack: Flutter (frontend), TypeScript/Node.js (backend), FOSS tools for monitoring and analytics.

---

## 📋 User Stories

**ID:** `user_stories_structure`
**Tags:** user-stories, planning, sprints, timeline

**Content:**
User Stories created for MTG Deck Analyzer: US-001 (divided into 001a-frontend, 001b-backend, 001c-monitoring), US-002 (card verification), US-003 (copies and restrictions), US-004 (legality by format), US-005 (mana curve), US-006 (mana base), US-007 (improvement suggestions), US-008 (grouping by type), US-009 (MTG Arena import), US-010 (MTGO import), US-011 (export). All documented in docs/US/ with complete specifications.

---

## 🏗️ Technical Architecture

**ID:** `technical_stack_architecture`
**Tags:** architecture, flutter, typescript, aws-lambda, scryfall, api

**Content:**
Technology stack defined for MTG Deck Analyzer: Frontend - Flutter with Dart (responsive UI, WCAG 2.1 AA accessibility, mobile-first). Backend - TypeScript with Node.js/AWS Lambda, RESTful API with OpenAPI specifications. Database - DynamoDB for card information and caching. External API integration: Scryfall API for card data, Gatherer API as fallback. Supported formats: Standard, Modern, Pioneer, Commander, Legacy, Vintage, Pauper, Draft, Sealed.

---

## 🔌 API Specifications

**ID:** `api_specifications_formats`
**Tags:** api, json, http-codes, validation, error-handling

**Content:**
Complete API Specifications for MTG Deck Analyzer: Request/Response JSON formats, standardized HTTP status codes (200 success, 400 bad request, 422 validation error, 429 rate limit, 500 server error), error response structure with business code, error type, message, details and retryable flag. Request format includes deckList array with cardName, quantity, isSideboard. Response includes isValid, currentCount, validRange, format, validationDetails and errors array. Implementation with Joi for validation and global error handling middleware.

---

## 📊 Monitoring & Instrumentation

**ID:** `monitoring_instrumentation_foss`
**Tags:** monitoring, analytics, posthog, sentry, elk-stack, docker, privacy

**Content:**
Complete instrumentation system with FOSS tools: Analytics - PostHog self-hosted for user behavior and conversion tracking. Error tracking - Sentry open source for frontend and backend error capture. Performance monitoring - Web Vitals library for Core Web Vitals (LCP, FID, CLS) and custom performance traces. Logging - ELK Stack (Elasticsearch, Logstash, Kibana) for structured JSON logging. Dashboards - Grafana for metrics and alerts. Complete Docker Compose for self-hosted deployment. Privacy compliance with GDPR and data minimization.

---

## 🚨 Error Handling Patterns

**ID:** `error_handling_patterns`
**Tags:** error-handling, logging, middleware, retry, correlation-id

**Content:**
Standardized error handling patterns: Global error middleware that automatically categorizes errors, request correlation IDs for debugging, structured JSON logging with timestamp, level, component, requestId, duration and context. Specific business error codes (DECK_SIZE_TOO_SMALL, INVALID_FORMAT, EXTERNAL_API_ERROR, RATE_LIMIT_EXCEEDED). Automatic frontend error mapping with types (NETWORK_ERROR, VALIDATION_ERROR, SERVER_ERROR) and retryable flags. Retry mechanism with exponential backoff. Error boundaries in Flutter and try-catch in TypeScript.

---

## 🎲 MTG Format Rules

**ID:** `mtg_format_rules`
**Tags:** mtg, formats, validation-rules, banned-restricted

**Content:**
MTG format validation rules implemented: Standard/Modern/Pioneer/Legacy/Vintage/Pauper - 60 cards minimum in main deck, maximum 15 in sideboard. Commander - exactly 100 cards including commander, maximum 10 in sideboard. Draft/Sealed - 40 cards minimum, no sideboard. Basic lands unlimited in most formats. Exceptions: banned cards by format (consult official lists), restricted in Vintage (maximum 1 copy), maximum copies per card (4 in constructed, 1 in commander except basic lands). Legality validation by print date and sets.

---

## 📤 Import/Export Formats

**ID:** `import_export_formats`
**Tags:** import, export, mtg-arena, mtgo, clipboard

**Content:**
Import/Export formats implemented: MTG Arena format (parsing "4x Lightning Bolt (DMU) 123"), MTGO format (parsing "4 Lightning Bolt" with sideboard section "SB: 1 Rest in Peace"), standard export format "4x CardName" with sideboard separation. Copy to clipboard functionality, multiple export formats, validation during import. Handling of card name variations, automatic sideboard section identification, fuzzy matching for common typos.

---

## ⏱️ Project Timeline

**ID:** `project_timeline_sprints`
**Tags:** timeline, sprints, planning, mvp, metrics

**Content:**
MTG Deck Analyzer project timeline: Sprint 1 (MVP Core - 2-3 weeks) - US-001a/b/c (frontend/backend/monitoring), US-002/003/004 (basic validation). Sprint 2 (Performance Analysis - 2-3 weeks) - US-005/006/007/008 (mana analysis and types). Sprint 3 (Import/Export Polish - 1-2 weeks) - US-009/010/011 (import and export). Success metrics: <5s response time, 100% accuracy in validation, 99.9% uptime. Prioritized backlog with identified dependencies and risks.

---

## 🛠️ Technical Decisions

**ID:** `technical_decisions_patterns`
**Tags:** patterns, testing, accessibility, performance, privacy, docker

**Content:**
Technical decisions and patterns established in MTG Deck Analyzer: Iterative development with detailed user stories and acceptance criteria. Clear separation of responsibilities (frontend/backend/monitoring). Multi-level testing (unit, integration, E2E). Performance optimization with <100ms response times. WCAG 2.1 AA accessibility compliance. Mobile-first responsive design. Structured JSON logging in all components. Standardized error handling with retry mechanisms. Privacy-first approach with GDPR compliance and data minimization. Self-hosted deployment with Docker Compose.

---

## 📊 Statistical Summary

### **Memories by Category:**
- **Project Management:** 3 memories (project overview, user stories, timeline)
- **Technical Architecture:** 3 memories (technical stack, API specs, patterns)
- **Business Logic:** 2 memories (MTG rules, import/export)
- **Quality & Monitoring:** 2 memories (error handling, instrumentation)

### **Most Used Tags:**
- `project` (2) - General project information
- `api` (2) - API specifications
- `mtg` (2) - Magic-specific rules
- `monitoring` (2) - Monitoring system
- `planning` (2) - Planning and timeline

### **Associated Corpus:**
- **RubenLL/MTG** - Main MTG Deck Analyzer project

---

## 🔍 How to Use These Memories

### **For Developers:**
1. **Quick reference** - Search by specific tags (e.g., "api", "flutter", "monitoring")
2. **Complete context** - Read all memories to understand the project
3. **Technical decisions** - Consult established patterns and architecture

### **For Onboarding:**
1. **Start with overview** - `mtg_project_overview`
2. **Understand structure** - `user_stories_structure`
3. **Technical architecture** - `technical_stack_architecture`
4. **Project timeline** - `project_timeline_sprints`

### **For Maintenance:**
1. **API documentation** - `api_specifications_formats`
2. **Error handling** - `error_handling_patterns`
3. **Monitoring setup** - `monitoring_instrumentation_foss`

---

## 📝 Maintenance Notes

- **Last updated:** October 22, 2025
- **Total memories:** 10 active memories
- **Project status:** Planning completed, ready for implementation
- **Next step:** Start Sprint 1 with US-001a (Frontend Requirements)

*This file is automatically updated when new memories are created to maintain a complete project record.*
