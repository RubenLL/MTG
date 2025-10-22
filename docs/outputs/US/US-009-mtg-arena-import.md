# US-009: MTG Arena Format Import

## Objective
Allow users to import their deck lists from MTG Arena to facilitate analysis.

## Functional Description
As an MTG Arena player, I want to be able to copy and paste my deck list from the MTG Arena application directly into the analyzer, so I don't have to manually rewrite my entire card list.

## Inputs and Outputs

**Inputs:**
- Deck list text in MTG Arena format
- Deck format (for validation)
- Import options (main deck, sideboard)

**Outputs:**
- Correctly parsed card list
- Indication of unrecognized cards
- Successful import confirmation
- Preview of the imported deck

## Validation Logic
1. Parse MTG Arena format:
   ```
   Deck
   4 Island (ANA) 59
   4 Opt (XLN) 65
   ...

   Sideboard
   2 Negate (ANA) 61
   ...
   ```
2. Extract information from each line:
   - Number of copies (at the beginning)
   - Card name
   - Set code (in parentheses)
   - Collection number (optional)
3. Validate syntax and format:
   - Verify that each line has the correct format
   - Identify sections (Deck, Sideboard)
   - Handle minor format variations
4. Map cards to database:
   - Use card name for search
   - Consider set code as additional context
   - Handle cards with multiple printings

## Priority
Medium - Feature that improves user experience.

## Acceptance Criteria
- [ ] Correctly parse the standard MTG Arena format
- [ ] Automatically separate main deck and sideboard
- [ ] Handle format variations (spaces, capitalization)
- [ ] Validate that cards exist in the database
- [ ] Provide clear feedback on parsing errors
- [ ] Allow partial import if some cards fail
