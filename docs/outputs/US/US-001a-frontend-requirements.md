# US-001a: Frontend Requirements - Deck Size Validation

## Objetivo
Implementar la interfaz de usuario para validación de tamaño de deck con experiencia de usuario intuitiva y manejo robusto de errores.

## Descripción Funcional
Como jugador de MTG, quiero una interfaz clara y responsiva donde pueda ingresar mi deck list, seleccionar el formato, y recibir validación inmediata del tamaño del deck con mensajes de error comprensibles.

## Inputs y Outputs

**Inputs:**
- Lista de cartas del deck (texto o JSON)
- Formato seleccionado (dropdown)
- Opciones de importación (MTG Arena, MTGO)

**Outputs:**
- Resultado de validación visual
- Mensajes de error específicos y contextuales
- Sugerencias para corrección

## Requerimientos de UI/UX

### **Componentes Principales**
- **Deck Input Area:** Área de texto multilínea para pegar deck lists
- **Format Selector:** Dropdown con todos los formatos soportados
- **Validation Button:** Botón principal para ejecutar validación
- **Results Display:** Panel para mostrar resultados de validación
- **Error Messages:** Notificaciones inline y contextuales

### **User Journey**
1. Usuario ingresa deck list (paste o typing)
2. Selecciona formato del dropdown
3. Sistema valida automáticamente (opcional)
4. Usuario presiona "Validate" para análisis completo
5. Sistema muestra resultados con colores y mensajes claros

### **Responsive Design**
- **Mobile-first:** Funcional en móviles y tablets
- **Desktop:** Layout optimizado para pantallas grandes
- **Accessibility:** Soporte para lectores de pantalla
- **Keyboard Navigation:** Navegación completa por teclado

## Implementación Flutter

### **UI Components**
```dart
// Flutter - Main Validation Widget
class DeckSizeValidatorWidget extends StatefulWidget {
  @override
  _DeckSizeValidatorWidgetState createState() => _DeckSizeValidatorWidgetState();
}

class _DeckSizeValidatorWidgetState extends State<DeckSizeValidatorWidget> {
  final _deckController = TextEditingController();
  String _selectedFormat = 'modern';
  ValidationResult? _validationResult;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('MTG Deck Size Validator'),
        actions: [
          IconButton(
            icon: Icon(Icons.help),
            onPressed: _showFormatHelp,
          ),
        ],
      ),
      body: Column(
        children: [
          // Format selector
          _buildFormatSelector(),

          // Deck input area
          Expanded(
            child: _buildDeckInputArea(),
          ),

          // Validation button
          _buildValidationButton(),

          // Results area
          if (_validationResult != null)
            _buildValidationResults(),
        ],
      ),
    );
  }
}
```

### **Form Validation**
```dart
// Flutter - Form validation
class DeckInputValidator {
  static String? validateDeckList(String deckList) {
    if (deckList.trim().isEmpty) {
      return 'Please enter your deck list';
    }

    final lines = deckList.split('\n');
    if (lines.length < 2) {
      return 'Deck list seems too short. Please check your input.';
    }

    // Parse and validate basic structure
    final cards = _parseDeckList(deckList);
    if (cards.isEmpty) {
      return 'Could not parse deck list. Please check the format.';
    }

    return null; // Valid
  }

  static String? validateFormat(String format) {
    final supportedFormats = ['standard', 'modern', 'commander', 'legacy', 'vintage', 'pauper', 'draft', 'sealed'];
    if (!supportedFormats.contains(format)) {
      return 'Please select a valid format';
    }
    return null;
  }
}
```

### **Import/Export Features**
```dart
// Flutter - Import functionality
class DeckImportService {
  static Future<String> importFromMTGArena(String arenaDeckList) async {
    // Parse MTG Arena format
    final lines = arenaDeckList.split('\n');
    final cards = <Map<String, dynamic>>[];

    for (final line in lines) {
      if (line.trim().isEmpty) continue;

      final match = RegExp(r'^(\d+)\s+(.+?)\s+\(([^)]+)\)\s*(\d+)?$').firstMatch(line);
      if (match != null) {
        cards.add({
          'cardName': match.group(2)?.trim(),
          'quantity': int.parse(match.group(1)!),
          'setCode': match.group(3),
          'collectorNumber': match.group(4),
        });
      }
    }

    return _convertToStandardFormat(cards);
  }

  static Future<String> importFromMTGO(String mtgoDeckList) async {
    // Parse MTGO format
    final lines = mtgoDeckList.split('\n');
    final cards = <Map<String, dynamic>>[];

    for (final line in lines) {
      final trimmed = line.trim();
      if (trimmed.isEmpty) continue;

      if (trimmed.startsWith('SB:')) {
        // Sideboard card
        final cardName = trimmed.substring(3).trim();
        cards.add({
          'cardName': cardName,
          'quantity': 1,
          'isSideboard': true,
        });
      } else {
        // Main deck card
        final parts = trimmed.split(' ');
        final quantity = int.tryParse(parts[0]) ?? 1;
        final cardName = parts.sublist(1).join(' ');

        cards.add({
          'cardName': cardName,
          'quantity': quantity,
          'isSideboard': false,
        });
      }
    }

    return _convertToStandardFormat(cards);
  }
}
```

### **Error Handling UI**
```dart
// Flutter - Error display components
class ValidationErrorDisplay extends StatelessWidget {
  final ValidationResult result;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _getErrorColor(result.errorType),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.error, color: Colors.white),
              SizedBox(width: 8),
              Text(
                _getErrorTitle(result.errorType),
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            result.message,
            style: TextStyle(color: Colors.white70),
          ),
          if (result.errorType == ErrorType.VALIDATION_ERROR) ...[
            SizedBox(height: 12),
            _buildDetailedValidationErrors(result),
          ],
        ],
      ),
    );
  }
}
```

## Criterios de Aceptación Frontend

- [ ] UI responsiva funciona en mobile y desktop
- [ ] Validación de input en tiempo real
- [ ] Mensajes de error claros y accionables
- [ ] Soporte para importación MTG Arena y MTGO
- [ ] Loading states durante validación
- [ ] Accessibility completa (WCAG 2.1 AA)
- [ ] Keyboard navigation completa
- [ ] Performance: < 100ms response time para UI updates

## Testing Requirements

### **Unit Tests**
- Form validation logic
- Import/export parsing
- Error message generation
- UI state management

### **Integration Tests**
- API integration
- Error handling flows
- User journey completion

### **E2E Tests**
- Complete validation flow
- Import/export workflows
- Error scenarios
- Mobile responsiveness
