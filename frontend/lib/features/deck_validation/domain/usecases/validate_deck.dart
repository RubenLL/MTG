import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/deck_validation_entity.dart';
import '../repositories/deck_validation_repository.dart';

class ValidateDeck implements UseCase<Either<Failure, DeckValidationEntity>, ValidateDeckParams> {
  final DeckValidationRepository repository;

  ValidateDeck(this.repository);

  @override
  Future<Either<Failure, DeckValidationEntity>> call(ValidateDeckParams params) async {
    return await repository.validateDeck(
      deckList: params.deckList,
      format: params.format,
    );
  }
}

class ValidateDeckParams {
  final List<String> deckList;
  final String format;

  const ValidateDeckParams({
    required this.deckList,
    required this.format,
  });

  List<Object> get props => [deckList, format];
}
