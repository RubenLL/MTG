# US-004: Format Legality Analysis

## Objective
Determine in which formats the deck is legal and list the cards that cause problems in each format.

## Functional Description
As an MTG player, I want to know in which formats I can play my deck and which specific cards are causing legality problems in each format, so I can make informed decisions about how to modify my deck.

## Inputs and Outputs

**Inputs:**
- Validated card list from the deck
- Formats to analyze (selected by user or all)
- Updated card database with legality information

**Outputs:**
- List of formats where the deck is legal
- For each format where it is NOT legal:
  - Specific list of problematic cards
  - Reason for the problem (banned, restricted, doesn't exist in format)
- General compatibility summary
- Alternative format suggestions

## Validation Logic
1. For each requested format:
   - Check each card's legality in that specific format
   - Compile list of problematic cards by restriction type
   - Determine if the complete deck is legal in that format
2. Consider different format types:
   - **Eternal formats:** Legacy, Vintage
   - **Rotating formats:** Standard, Pioneer, Modern
   - **Casual formats:** Commander, Pauper
   - **Limited formats:** Draft, Sealed
3. Handle cards with different legalities by region/printing
4. Provide updated information based on the most recent banlist

## Priority
High - Core feature of the application's main objective.

## Acceptance Criteria
- [ ] Correctly analyze legality in all major formats
- [ ] List specific problematic cards by format
- [ ] Provide clear explanations of why a card is illegal
- [ ] Display up-to-date legality information
- [ ] Suggest alternative formats when appropriate
- [ ] Handle cards with multiple printings and different legalities
