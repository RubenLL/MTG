import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/error/failures.dart';
import '../../domain/usecases/validate_deck.dart';
import 'deck_validation_event.dart';
import 'deck_validation_state.dart';

class DeckValidationBloc extends Bloc<DeckValidationEvent, DeckValidationState> {
  final ValidateDeck validateDeck;

  DeckValidationBloc({required this.validateDeck}) : super(const DeckValidationState.initial()) {
    on<_ValidateDeck>(_onValidateDeck);
    on<_Reset>(_onReset);
  }

  Future<void> _onValidateDeck(
    _ValidateDeck event,
    Emitter<DeckValidationState> emit,
  ) async {
    emit(const DeckValidationState.loading());
    final result = await validateDeck(ValidateDeckParams(
      deckList: event.deckList,
      format: event.format,
    ));
    result.fold(
      (failure) => emit(DeckValidationState.error(_mapFailureToMessage(failure))),
      (validationResult) => emit(DeckValidationState.loaded(validationResult)),
    );
  }

  Future<void> _onReset(
    _Reset event,
    Emitter<DeckValidationState> emit,
  ) async {
    emit(const DeckValidationState.initial());
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'Server error occurred. Please try again.';
      case NetworkFailure:
        return 'No internet connection. Please check your network.';
      case ValidationFailure:
        return 'Validation error. Please check your input.';
      default:
        return 'An unexpected error occurred.';
    }
  }
}
