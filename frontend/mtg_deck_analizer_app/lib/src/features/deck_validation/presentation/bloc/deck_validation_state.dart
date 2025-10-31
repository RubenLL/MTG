import 'package:equatable/equatable.dart';
import 'package:mtg_deck_analizer_app/src/features/deck_validation/domain/entities/deck_validation_entity.dart';

abstract class DeckValidationState extends Equatable {
  final String deckList;
  final String format;
  final bool isValid;
  final bool isSubmitting;
  final String? errorMessage;
  final DeckValidationEntity? validationResult;

  const DeckValidationState({
    this.deckList = '',
    this.format = 'standard',
    this.isValid = false,
    this.isSubmitting = false,
    this.errorMessage,
    this.validationResult,
  });

  @override
  List<Object?> get props => [
    deckList,
    format,
    isValid,
    isSubmitting,
    errorMessage,
    validationResult,
  ];
}

class DeckValidationInitial extends DeckValidationState {
  const DeckValidationInitial() : super();
}

class DeckValidationLoading extends DeckValidationState {
  const DeckValidationLoading({
    required String deckList,
    required String format,
  }) : super(deckList: deckList, format: format, isSubmitting: true);
}

class DeckValidationSuccess extends DeckValidationState {
  final DeckValidationEntity result;

  DeckValidationSuccess({
    required this.result,
    required String deckList,
    required String format,
  }) : super(
         deckList: deckList,
         format: format,
         isValid: result.isValid,
         validationResult: result,
       );

  @override
  List<Object?> get props => [result, ...super.props];

  DeckValidationSuccess copyWith({
    DeckValidationEntity? result,
    String? deckList,
    String? format,
  }) {
    return DeckValidationSuccess(
      result: result ?? this.result,
      deckList: deckList ?? this.deckList,
      format: format ?? this.format,
    );
  }
}

class DeckValidationFailure extends DeckValidationState {
  final String message;

  const DeckValidationFailure({
    required this.message,
    required String deckList,
    required String format,
  }) : super(deckList: deckList, format: format, errorMessage: message);

  @override
  List<Object?> get props => [message, ...super.props];
  DeckValidationFailure copyWith({
    String? message,
    String? deckList,
    String? format,
  }) {
    return DeckValidationFailure(
      message: message ?? this.message,
      deckList: deckList ?? this.deckList,
      format: format ?? this.format,
    );
  }
}
