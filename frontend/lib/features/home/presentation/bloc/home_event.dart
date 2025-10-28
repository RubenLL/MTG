import 'package:freezed_annotation/freezed_annotation.dart';

part 'home_event.freezed.dart';

@freezed
class HomeEvent with _$HomeEvent {
  const factory HomeEvent.getHomeData() = _GetHomeData;
  const factory HomeEvent.refreshHomeData() = _RefreshHomeData;
}
