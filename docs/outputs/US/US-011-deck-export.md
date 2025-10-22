# US-011: Deck List Export

## Objective
Allow users to export their deck list in standard format to share or use on other platforms.

## Functional Description
As an MTG player, I want to be able to export my deck list in the standard "4x CardName" format to share with other players or use on platforms like MTGGoldfish, TappedOut, or MTG forums.

## Inputs and Outputs

**Inputs:**
- Analyzed deck card list
- Desired export format
- Export options (main deck, sideboard, complete)
- Additional information to include (prices, analysis)

**Outputs:**
- Formatted deck list text
- Download or copy to clipboard options
- Multiple formats available

## Validation Logic
1. Format list according to standard:
   ```
   4 Island
   4 Opt
   3 Lightning Bolt
   2 Negate

   Sideboard:
   2 Disdainful Stroke
   1 Summary Dismissal
   ```
2. Provide multiple export formats:
   - **Standard format:** "4 CardName"
   - **Arena format:** "4 CardName (SET) 123"
   - **MTGO format:** Similar to standard
   - **CSV format:** For advanced analysis
3. Include additional options:
   - Clearly separate main deck and sideboard
   - Include analysis information if requested
   - Format for easy copy/paste
4. Validate that the export is complete and accurate

## Priority
Low - Convenience feature, not critical for MVP.

## Acceptance Criteria
- [ ] Export in standard "4x CardName" format
- [ ] Provide multiple export formats
- [ ] Clearly separate main deck and sideboard
- [ ] Include copy to clipboard functionality
- [ ] Allow download as text file
- [ ] Maintain accuracy of names and quantities
