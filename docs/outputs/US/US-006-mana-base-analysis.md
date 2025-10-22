# US-006: Mana Base Analysis

## Objective
Analyze the land composition and mana sources of the deck to identify consistency issues.

## Functional Description
As an MTG player, I want the system to analyze my mana base to identify if I have enough lands of the correct color and receive recommendations on how to improve my mana base consistency.

## Inputs and Outputs

**Inputs:**
- Card list categorized by color
- Total number of cards in the deck
- Mana cost information from non-land cards
- Analysis preferences (tricolor, dual-color, etc.)

**Outputs:**
- Color distribution analysis
- Recommended land count by color
- Identification of mana problems (color screw, mana flood)
- Specific suggestions for mana base adjustments
- Mana consistency visualization

## Validation Logic
1. Categorize cards by mana colors:
   - Monocolor, dual-color, tricolor, colorless
   - Cards with hybrid or multiple color costs
   - Exclude basic lands from color count
2. Calculate mana requirements:
   - Count mana symbols by color in non-land cards
   - Determine ideal land distribution by color
   - Consider standard ratios (40% lands in 60-card deck)
3. Analyze common problems:
   - **Color screw:** Too few lands of the main color
   - **Mana flood:** Too many lands in general
   - **Mana drought:** Too few lands in general
   - **Color imbalance:** Unequal color distribution
4. Provide specific recommendations:
   - Ideal number of lands by color
   - Suggestions for dual lands or utility lands
   - Adjustments to improve consistency

## Priority
Medium - Important feature for performance optimization.

## Acceptance Criteria
- [ ] Correctly analyze the color distribution of the deck
- [ ] Calculate mana requirements by color
- [ ] Identify common mana base problems
- [ ] Provide specific and actionable recommendations
- [ ] Correctly handle multicolor and hybrid cards
- [ ] Include analysis of utility lands and dual lands
