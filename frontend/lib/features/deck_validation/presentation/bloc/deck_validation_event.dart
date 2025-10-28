import 'package:freezed_annotation/freezed_annotation.dart';

part 'deck_validation_event.freezed.dart';

@freezed
class DeckValidationEvent with _$DeckValidationEvent {
  const factory DeckValidationEvent.validateDeck({
    required List<String> deckList,
    required String format,
  }) = _ValidateDeck;
  const factory DeckValidationEvent.reset() = _Reset;
}
