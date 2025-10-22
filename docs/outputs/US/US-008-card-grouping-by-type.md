# US-008: Card Grouping by Type

## Objective
Organize and visualize deck cards grouped by their type to facilitate structure analysis.

## Functional Description
As an MTG player, I want to see my cards organized by type (creatures, instants, lands, etc.) to better understand the composition and balance of my deck and identify possible improvements in the structure.

## Inputs and Outputs

**Inputs:**
- Complete card list from the deck
- Type and subtype information for each card
- Grouping preferences (main deck, sideboard, complete)

**Outputs:**
- Card list organized by main type
- Card count by each type
- Type distribution visualization
- Type balance analysis
- Identification of over or underrepresented types

## Validation Logic
1. Categorize each card by its main type:
   - **Creatures:** Creature
   - **Instants:** Instant
   - **Sorceries:** Sorcery
   - **Lands:** Land
   - **Enchantments:** Enchantment
   - **Artifacts:** Artifact
   - **Planeswalkers:** Planeswalker
2. Handle cards with multiple types:
   - Prioritize the most specific type
   - Show secondary types when relevant
   - Artifact lands, enchantment creatures, etc.
3. Calculate distribution and balance:
   - Percentage of each type in the deck
   - Comparison with ideal ratios by archetype
   - Identify imbalances (e.g., too few creatures, too many instants)
4. Provide contextual analysis based on detected archetype

## Priority
Medium - Useful feature for deck structure analysis.

## Acceptance Criteria
- [ ] Correctly categorize all card types
- [ ] Appropriately handle cards with multiple types
- [ ] Show counts and percentages by type
- [ ] Provide type balance analysis
- [ ] Identify type distribution problems
- [ ] Allow visualization in different formats (list, chart)
