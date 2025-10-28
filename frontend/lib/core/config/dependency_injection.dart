import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../features/deck_validation/data/datasources/deck_validation_remote_data_source.dart';
import '../../features/deck_validation/data/repositories/deck_validation_repository_impl.dart';
import '../../features/deck_validation/domain/repositories/deck_validation_repository.dart';
import '../../features/deck_validation/domain/usecases/validate_deck.dart';
import '../../features/deck_validation/presentation/bloc/deck_validation_bloc.dart';
import '../../features/home/data/datasources/home_local_data_source.dart';
import '../../features/home/data/datasources/home_remote_data_source.dart';
import '../../features/home/data/repositories/home_repository_impl.dart';
import '../../features/home/domain/repositories/home_repository.dart';
import '../../features/home/domain/usecases/get_home_data.dart';
import '../../features/home/presentation/bloc/home_bloc.dart';
import '../network/network_info.dart';
import '../utils/input_converter.dart';

final getIt = GetIt.instance;

Future<void> initDependencies() async {
  // Core
  await _initCore();

  // Features
  await _initHomeFeature();
  await _initDeckValidationFeature();
}

Future<void> _initCore() async {
  // External dependencies
  final sharedPreferences = await SharedPreferences.getInstance();
  getIt.registerLazySingleton(() => sharedPreferences);
  getIt.registerLazySingleton(() => http.Client());

  // Network info
  getIt.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(getIt()));

  // Utils
  getIt.registerLazySingleton(() => InputConverter());
}

Future<void> _initHomeFeature() async {
  // Data sources
  getIt.registerLazySingleton<HomeRemoteDataSource>(
    () => HomeRemoteDataSourceImpl(client: getIt()),
  );
  getIt.registerLazySingleton<HomeLocalDataSource>(
    () => HomeLocalDataSourceImpl(sharedPreferences: getIt()),
  );

  // Repository
  getIt.registerLazySingleton<HomeRepository>(() => HomeRepositoryImpl(
        remoteDataSource: getIt(),
        localDataSource: getIt(),
        networkInfo: getIt(),
      ));

  // Use cases
  getIt.registerLazySingleton(() => GetHomeData(getIt()));

  // Bloc
  getIt.registerFactory(() => HomeBloc(getHomeData: getIt()));
}

Future<void> _initDeckValidationFeature() async {
  // Data sources
  getIt.registerLazySingleton<DeckValidationRemoteDataSource>(
    () => DeckValidationRemoteDataSourceImpl(client: getIt()),
  );

  // Repository
  getIt.registerLazySingleton<DeckValidationRepository>(() => DeckValidationRepositoryImpl(
        remoteDataSource: getIt(),
        networkInfo: getIt(),
      ));

  // Use cases
  getIt.registerLazySingleton(() => ValidateDeck(getIt()));

  // Bloc
  getIt.registerFactory(() => DeckValidationBloc(validateDeck: getIt()));
}
