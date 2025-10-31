import 'package:freezed_annotation/freezed_annotation.dart';

part 'deck_validation_entity.freezed.dart';

@freezed
class DeckValidationEntity with _$DeckValidationEntity {
  const factory DeckValidationEntity({
    required String deckList,
    required String format,
    required bool isValid,
    required int mainDeckCount,
    required int sideboardCount,
    required List<String> issues,
    required DateTime lastValidated,
  }) = _DeckValidationEntity;

  const DeckValidationEntity._();

  bool get hasSideboard => sideboardCount > 0;
}
