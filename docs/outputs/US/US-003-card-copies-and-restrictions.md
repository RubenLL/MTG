# US-003: Card Copies and Restricted Lists Validation

## Objective
Verify that the number of copies of each card complies with format rules and detect banned or restricted cards.

## Functional Description
As an MTG player, I want the system to automatically verify that I'm using the correct number of copies of each card and if there are banned or restricted cards in my deck, to ensure my deck is legal in the format I want to play.

## Inputs and Outputs

**Inputs:**
- Card list with quantities
- Selected format
- Card database with legality information

**Outputs:**
- List of cards with copy problems
- List of banned cards in the format
- List of restricted cards in the format
- Deck legality summary
- Correction suggestions

## Validation Logic
1. For each card in the deck:
   - Verify number of copies against format rules:
     - **Constructed formats (Standard, Modern, Pioneer):** Maximum 4 copies
     - **Commander:** Maximum 1 copy per card (except basic lands)
     - **Legacy/Vintage:** Maximum 4 copies (with exceptions in Vintage)
   - Check legality status in the format:
     - **Banned:** Completely prohibited
     - **Restricted:** Limited to 1 copy (Vintage)
     - **Legal:** No additional restrictions
2. Handle special exceptions:
   - Basic lands unlimited in most formats
   - Cards with format-specific restrictions
3. Prioritize errors by severity (banned > restricted > excess copies)

## Priority
High - Essential feature for deck legality.

## Acceptance Criteria
- [ ] Correctly validate number of copies by format
- [ ] Detect banned cards in each format
- [ ] Correctly identify restricted cards
- [ ] Handle basic land exceptions
- [ ] Provide clear and actionable error messages
- [ ] Display up-to-date legality information
