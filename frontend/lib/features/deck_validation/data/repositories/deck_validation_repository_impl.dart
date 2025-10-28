import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/deck_validation_entity.dart';
import '../../domain/repositories/deck_validation_repository.dart';
import '../datasources/deck_validation_remote_data_source.dart';
import '../models/deck_validation_model.dart';

class DeckValidationRepositoryImpl implements DeckValidationRepository {
  final DeckValidationRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  DeckValidationRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, DeckValidationEntity>> validateDeck({
    required List<String> deckList,
    required String format,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final remoteValidation = await remoteDataSource.validateDeck(
          deckList: deckList,
          format: format,
        );
        return Right(remoteValidation.toEntity());
      } on ServerFailure {
        return const Left(ServerFailure());
      }
    } else {
      return const Left(NetworkFailure());
    }
  }
}
