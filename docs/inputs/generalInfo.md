# **MTG Deck Analyzer**

## **Objective**

We will develop a web application designed to analyze a _Magic: The Gathering_ deck list — the collectible card game created by _Wizards of the Coast_.

The system will allow users to:

- Determine which formats their deck is legal in.
- Identify which cards invalidate the deck (for example, banned or restricted cards).
- Receive a general performance and structure analysis, including mana curve and mana base recommendations.

---

## **Main Features**

1. Validate the total number of cards in the deck to confirm if the size is correct.
2. Check if all listed cards exist or if any are misspelled.
3. Validate the number of copies of each card, considering restricted and banned lists.
4. Analyze in which formats the deck is legal.
   - 4.1 List the cards that are illegal in each analyzed format.
5. Analyze the deck’s mana curve.
6. Analyze the deck’s mana base.
7. Suggest improvements for the mana base.
8. Group cards by their type (creature, instant, land, enchantment, etc.).
9. Allow copying a deck list following the format: `number of copies | card name`.
10. Import deck lists using the _MTG Arena_ format.
11. Import deck lists using the _MTG Online (MTGO)_ format.

Each of these features will be documented in a separate `.md` file representing a **User Story**.

---

## **Input and Output Data**

- **Input:**  
  The user may paste or upload a `.txt` or `.csv` file containing the deck list, or type it directly in a text field.

- **Output:**  
  The system will generate both a visual and textual report indicating:
  - Formats where the deck is legal.
  - Detected issues (illegal cards, format errors, etc.).
  - Suggested improvements.

---

## **Data Sources**

The application will use the following data sources, in priority order:

1. **Internal Database:**  
   Primary source for card information, legality data, and format definitions.

2. **Gatherer (Wizards of the Coast):**  
   Used if the requested data is not available in the internal database.

3. **Scryfall:**  
   Fallback source for card validation and data retrieval when no information is found in the previous sources.
   - Base endpoint: `https://api.scryfall.com/cards/named?fuzzy=...`

---

## **Validation Rules**

A deck is considered **valid** if:

- It meets the minimum and maximum size required for the selected format.
- It does not exceed the allowed number of copies per card.
- All cards exist and are legal in the analyzed format.

---

## **Architecture and Technologies**

### **Overview**

The project will include both front-end and back-end development.  
**AWS** will be used for data storage and website deployment.

### **Front-End**

- Built with **Flutter**, supporting both web and mobile platforms.
- Focused on usability and clear visualization of deck analysis results.

### **Back-End**

- Developed with **TypeScript**, using **AWS Lambda**.
- Endpoints exposed through **API Gateway**.
- Data stored in **AWS DynamoDB**.
- **S3** will be used to store deck lists, analysis reports, and related assets.

### **Processing Flow**

1. The user uploads or enters a deck list.
2. The system validates basic structure (deck size and syntax).
3. Card and legality data are retrieved in this order:
   - Internal database
   - Gatherer
   - Scryfall (as a fallback source)
4. Mana curve and mana base analyses are performed.
5. The final report is generated, including format validation and recommendations.

---

## **Future Enhancements**

- Allow users to share decks publicly or with specific groups.
- Store analysis history per user.
- Enable deck comparison features.
- Integrate AI-driven recommendations for improving deck performance.

---

## **Notes for Implementation**

- Each user story should describe functional details, required inputs, validation logic, and expected outputs.
- The backend should implement caching mechanisms to reduce external API requests when possible.
- All interactions between the front-end and back-end must follow a clean API contract to support scalability and maintenance.

---

## Database storage Format

```json
{
  "internalId": "",
  "ScryfallId": "",
  "GathererId": "",
  "isDoubleCard": false,
  "source": 0,
  "lastUpdatedAt": "",
  "face": [
    {
      "cardDetail": {
        "name": "",
        "Color": ["", ""],
        "Rarity": "",
        "Type": "",
        "Subtype": "",
        "Supertype": "",
        "FormatsInvalid": [
          {
            "format": "",
            "isBanned": false,
            "isRestricted": false
          }
        ],
        "CMC": 0,
        "ManaCost": ["", ""],
        "CardText": "",
        "FlavorText": "",
        "Strength": "",
        "Toughness": "",
        "sckyFallImageURL": "",
        "GathererImageURL": "",
        "localImageURL": "",
        "keywords": ["", ""],
        "loyalty": ""
      }
    }
  ]
}
```
