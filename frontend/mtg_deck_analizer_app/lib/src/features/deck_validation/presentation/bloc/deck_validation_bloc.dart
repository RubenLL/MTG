import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/deck_validation_entity.dart';
import 'deck_validation_event.dart';
import 'deck_validation_state.dart';

@injectable
class DeckValidationBloc
    extends Bloc<DeckValidationEvent, DeckValidationState> {
  DeckValidationBloc() : super(const DeckValidationInitial()) {
    on<DeckListChanged>(_onDeckListChanged);
    on<FormatChanged>(_onFormatChanged);
    on<ValidateDeck>(_onValidateDeck);
  }

  void _onDeckListChanged(
    DeckListChanged event,
    Emitter<DeckValidationState> emit,
  ) {
    emit(
      state is DeckValidationSuccess
          ? (state as DeckValidationSuccess).copyWith(deckList: event.deckList)
          : (state as DeckValidationFailure).copyWith(deckList: event.deckList),
    );
  }

  void _onFormatChanged(
    FormatChanged event,
    Emitter<DeckValidationState> emit,
  ) {
    emit(
      state is DeckValidationSuccess
          ? (state as DeckValidationSuccess).copyWith(format: event.format)
          : (state as DeckValidationFailure).copyWith(format: event.format),
    );
  }

  Future<void> _onValidateDeck(
    ValidateDeck event,
    Emitter<DeckValidationState> emit,
  ) async {
    if (state.deckList.isEmpty) {
      emit(
        DeckValidationFailure(
          message: 'Deck list cannot be empty',
          deckList: state.deckList,
          format: state.format,
        ),
      );
      return;
    }

    emit(DeckValidationLoading(deckList: state.deckList, format: state.format));

    try {
      // TODO: Implement actual validation logic with repository
      // This is a mock implementation
      await Future.delayed(const Duration(seconds: 1));

      final result = DeckValidationEntity(
        deckList: state.deckList,
        format: state.format,
        isValid: true, // Mock validation
        mainDeckCount: 60, // Mock count
        sideboardCount: 15, // Mock count
        issues: const [],
        lastValidated: DateTime.now(),
      );

      emit(
        DeckValidationSuccess(
          result: result,
          deckList: state.deckList,
          format: state.format,
        ),
      );
    } catch (e) {
      emit(
        DeckValidationFailure(
          message: e.toString(),
          deckList: state.deckList,
          format: state.format,
        ),
      );
    }
  }
}
