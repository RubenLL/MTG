import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../domain/entities/deck_validation_entity.dart';

part 'deck_validation_state.freezed.dart';

@freezed
class DeckValidationState with _$DeckValidationState {
  const factory DeckValidationState.initial() = _Initial;
  const factory DeckValidationState.loading() = _Loading;
  const factory DeckValidationState.loaded(DeckValidationEntity validationResult) = _Loaded;
  const factory DeckValidationState.error(String message) = _Error;
}
