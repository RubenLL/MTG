# US-002: Card Existence and Spelling Validation

## Objective
Verify that all cards in the deck exist and are correctly spelled to avoid typos.

## Functional Description
As an MTG player, I want the system to automatically verify that all cards I listed in my deck exist in the MTG database, to identify typos or incorrect names before proceeding with more complex analysis.

## Inputs and Outputs

**Inputs:**
- Card list with quantities
- Deck format (for context)

**Outputs:**
- List of valid cards found
- List of cards not found or misspelled
- Correction suggestions for similar names
- Overall validation status (total/partial/invalid)

## Validation Logic
1. For each card in the list:
   - Search in internal database first
   - If not found, use Gatherer API
   - If not found, use Scryfall as fallback
2. Implement fuzzy search to detect common typos:
   - Minor spelling errors
   - Card name variations
   - Cards with multiple printings
3. Handle special cards (split cards, double-faced cards)
4. Provide suggestions when partial matches are found

## Priority
High - Critical feature that affects all other validations.

## Acceptance Criteria
- [ ] Verify card existence against official database
- [ ] Implement fuzzy search for typos
- [ ] Provide automatic correction suggestions
- [ ] Handle special cards (split cards, DFC)
- [ ] Display clear validation statistics to user
