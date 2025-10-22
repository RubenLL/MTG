# US-005: Mana Curve Analysis

## Objective
Analyze and visualize the mana cost distribution of the deck to identify balance issues.

## Functional Description
As an MTG player, I want to see a visual analysis of my deck's mana curve to understand if I have the correct distribution of cards by mana cost and receive recommendations to optimize the deck balance.

## Inputs and Outputs

**Inputs:**
- Card list with mana cost information (CMC)
- Type of analysis required (main deck, sideboard, or complete)
- Visualization preferences

**Outputs:**
- Mana curve graph/visualization
- Statistics of distribution by mana cost
- Balance analysis (low curve, high curve, well balanced)
- Specific adjustment recommendations
- Comparison with ideal curves by archetype

## Validation Logic
1. Extract converted mana cost (CMC) from each card:
   - Cards with variable cost (X, {0})
   - Cards without mana cost (lands)
   - Split cards and double-faced cards
2. Generate distribution by mana cost:
   - Count cards by each CMC value
   - Calculate relative percentages
   - Identify peaks and valleys in the curve
3. Analyze overall balance:
   - **Low curve:** Many low-cost cards (0-2 CMC)
   - **High curve:** Many high-cost cards (4+ CMC)
   - **Balanced:** Even distribution
4. Provide recommendations based on detected archetype

## Priority
Medium - Important feature for deck optimization.

## Acceptance Criteria
- [ ] Correctly calculate CMC for all cards
- [ ] Generate clear mana curve visualization
- [ ] Provide automatic balance analysis
- [ ] Include specific recommendations based on analysis
- [ ] Correctly handle cards with special costs
- [ ] Allow separate analysis of main deck and sideboard
