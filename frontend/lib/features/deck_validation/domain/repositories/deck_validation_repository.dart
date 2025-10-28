import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/deck_validation_entity.dart';

abstract class DeckValidationRepository {
  Future<Either<Failure, DeckValidationEntity>> validateDeck({
    required List<String> deckList,
    required String format,
  });
}
