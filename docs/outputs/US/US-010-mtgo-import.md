# US-010: MTGO Format Import

## Objective
Allow users to import their deck lists from Magic: The Gathering Online to facilitate analysis.

## Functional Description
As an MTGO player, I want to be able to copy and paste my deck list from the MTGO application directly into the analyzer, so I don't have to manually rewrite my entire card list.

## Inputs and Outputs

**Inputs:**
- Deck list text in MTGO format
- Deck format (for validation)
- Import options (main deck, sideboard)

**Outputs:**
- Correctly parsed card list
- Indication of unrecognized cards
- Successful import confirmation
- Preview of the imported deck

## Validation Logic
1. Parse MTGO format:
   ```
   4 Island
   4 Opt
   3 Lightning Bolt
   SB: 2 Negate
   SB: 1 Mountain
   ```
2. Extract information from each line:
   - Number of copies (at the beginning, optional - default 1)
   - Card name
   - Identify sideboard by "SB:" prefix
3. Validate syntax and format:
   - Verify that each line contains a valid card name
   - Automatically identify the sideboard section
   - Handle different formatting styles
4. Map cards to database:
   - Use card name for search
   - Consider MTGO context (cards available in the client)
   - Handle cards with different names in MTGO vs paper

## Priority
Medium - Feature that improves user experience.

## Acceptance Criteria
- [ ] Correctly parse the standard MTGO format
- [ ] Automatically separate main deck and sideboard
- [ ] Handle explicit and implicit copy numbers
- [ ] Validate that cards exist in the database
- [ ] Provide clear feedback on parsing errors
- [ ] Handle MTGO-specific card name variations
