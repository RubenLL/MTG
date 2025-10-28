import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/home_entity.dart';
import '../../domain/repositories/home_repository.dart';
import '../datasources/home_local_data_source.dart';
import '../datasources/home_remote_data_source.dart';
import '../models/home_model.dart';

class HomeRepositoryImpl implements HomeRepository {
  final HomeRemoteDataSource remoteDataSource;
  final HomeLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  HomeRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, HomeEntity>> getHomeData() async {
    if (await networkInfo.isConnected) {
      try {
        final remoteHomeData = await remoteDataSource.getHomeData();
        await localDataSource.cacheHomeData(remoteHomeData);
        return Right(remoteHomeData.toEntity());
      } on ServerFailure {
        return const Left(ServerFailure());
      }
    } else {
      try {
        final localHomeData = await localDataSource.getLastHomeData();
        if (localHomeData != null) {
          return Right(localHomeData.toEntity());
        } else {
          return const Left(CacheFailure());
        }
      } on CacheFailure {
        return const Left(CacheFailure());
      }
    }
  }
}
