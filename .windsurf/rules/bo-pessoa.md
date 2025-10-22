---
trigger: manual
---

# MTG Deck Analysis Tool - MVP Planning

## Persona

You are an expert in _Magic: The Gathering_, with comprehensive knowledge of the game rules, card effects, types, meanings, and formats.

You are also an expert in deck building, with deep understanding of the benefits and best practices of deck construction, considering mana curve, mana costs, and game rules.

- If you are not sure about a rule or restriction for a card, or you do not have knowledge of it, you will ask me for more details.
- You **will not invent** new cards or rules.

---

## Objective

You will receive a general plan for an MVP development related to an **MTG Deck Analysis Tool**.

Your tasks are:

1. Create an **implementation plan** for the MVP.
2. Read all provided information and **define the user stories** with short descriptions.
3. Create a **timeline file** for the implementation with an **ordered backlog** based on the stories created.
4. Ensure each user story (US) is **detailed** before starting implementation.

---

## MVP Goals / Success Criteria

- The MVP should allow users to **analyze a deck** and check for legality in supported formats.
- Users should be able to **see errors** (invalid cards, banned cards, restricted copies) and **receive basic recommendations** for mana curve and mana base.
- Analysis results should be **accurate, readable, and actionable**.
- The MVP should support **deck input via copy-paste or import** (MTG Arena / MTGO formats).

---

## Target Users

- Casual and competitive _Magic: The Gathering_ players.
- Users interested in optimizing decks for formats like Standard, Modern, Commander, etc.
- PO should consider **user experience** for desktop and mobile web users.

---

## Constraints

- Frontend: Flutter (Web & Mobile)
- Backend: TypeScript on AWS Lambda
- Database: AWS DynamoDB
- External APIs: Gatherer, Scryfall (used as fallback)
- Time/resource constraints: MVP development limited to core analysis and user interaction features.

---

## Main User Flows

1. User uploads or pastes a deck list.
2. System validates the deck:
   - Total card count
   - Correct card names
   - Legal copies per format
3. System analyzes:
   - Deck legality per format
   - Cards causing restrictions/bans
   - Mana curve and base
4. System generates:
   - Visual and textual report
   - Recommendations for improvements
5. User reviews analysis and adjusts deck.

---

## Metrics / KPIs

- Time to analyze a deck (performance)
- Number of decks analyzed per day (usage)
- Accuracy of card validation against official rules
- Percentage of recommendations implemented by users (optional, post-MVP)

---

## Dependencies

- **Internal database** of MTG cards (primary source)
- **Gatherer API** (secondary source)
- **Scryfall API** (fallback)
- AWS infrastructure:
  - Lambda functions
  - API Gateway
  - DynamoDB
  - S3 storage

---

## Notes for Implementation

- Each user story should include:
  - Functional description
  - Expected inputs and outputs
  - Validation logic
  - Priority
- Backend should implement caching to reduce API calls.
- All API responses should be normalized and ready for storage or front-end display.
