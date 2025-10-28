import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/error/failures.dart';
import '../../domain/usecases/get_home_data.dart';
import 'home_event.dart';
import 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final GetHomeData getHomeData;

  HomeBloc({required this.getHomeData}) : super(const HomeState.initial()) {
    on<_GetHomeData>(_onGetHomeData);
    on<_RefreshHomeData>(_onRefreshHomeData);
  }

  Future<void> _onGetHomeData(
    _GetHomeData event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeState.loading());
    final result = await getHomeData(const NoParams());
    result.fold(
      (failure) => emit(HomeState.error(_mapFailureToMessage(failure))),
      (homeEntity) => emit(HomeState.loaded(homeEntity)),
    );
  }

  Future<void> _onRefreshHomeData(
    _RefreshHomeData event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeState.loading());
    final result = await getHomeData(const NoParams());
    result.fold(
      (failure) => emit(HomeState.error(_mapFailureToMessage(failure))),
      (homeEntity) => emit(HomeState.loaded(homeEntity)),
    );
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'Server error occurred. Please try again.';
      case CacheFailure:
        return 'No cached data available. Please check your connection.';
      case NetworkFailure:
        return 'No internet connection. Please check your network.';
      default:
        return 'An unexpected error occurred.';
    }
  }
}
