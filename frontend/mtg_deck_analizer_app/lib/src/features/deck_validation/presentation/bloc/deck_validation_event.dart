import 'package:equatable/equatable.dart';

abstract class DeckValidationEvent extends Equatable {
  const DeckValidationEvent();

  @override
  List<Object> get props => [];
}

class DeckListChanged extends DeckValidationEvent {
  final String deckList;

  const DeckListChanged(this.deckList);

  @override
  List<Object> get props => [deckList];
}

class FormatChanged extends DeckValidationEvent {
  final String format;

  const FormatChanged(this.format);

  @override
  List<Object> get props => [format];
}

class ValidateDeck extends DeckValidationEvent {
  const ValidateDeck();
}
