import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;

  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

// General failures
class ServerFailure extends Failure {
  const ServerFailure([String message = 'Server error occurred'])
      : super(message);
}

class CacheFailure extends Failure {
  const CacheFailure([String message = 'Cache error occurred'])
      : super(message);
}

class NetworkFailure extends Failure {
  const NetworkFailure([String message = 'Network error occurred'])
      : super(message);
}

class ValidationFailure extends Failure {
  const ValidationFailure([String message = 'Validation failed'])
      : super(message);
}

// MTG specific failures
class DeckValidationFailure extends Failure {
  const DeckValidationFailure([String message = 'Deck validation failed'])
      : super(message);
}

class CardNotFoundFailure extends Failure {
  const CardNotFoundFailure([String message = 'Card not found'])
      : super(message);
}

class InvalidFormatFailure extends Failure {
  const InvalidFormatFailure([String message = 'Invalid format selected'])
      : super(message);
}
