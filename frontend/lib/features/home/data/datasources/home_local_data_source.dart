import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/home_model.dart';

abstract class HomeLocalDataSource {
  Future<HomeModel?> getLastHomeData();
  Future<void> cacheHomeData(HomeModel homeModel);
}

class HomeLocalDataSourceImpl implements HomeLocalDataSource {
  final SharedPreferences sharedPreferences;
  static const String cachedHomeDataKey = 'CACHED_HOME_DATA';

  HomeLocalDataSourceImpl({required this.sharedPreferences});

  @override
  Future<HomeModel?> getLastHomeData() async {
    final jsonString = sharedPreferences.getString(cachedHomeDataKey);
    if (jsonString != null) {
      return HomeModel.fromJson(json.decode(jsonString));
    }
    return null;
  }

  @override
  Future<void> cacheHomeData(HomeModel homeModel) async {
    final jsonString = json.encode(homeModel.toJson());
    await sharedPreferences.setString(cachedHomeDataKey, jsonString);
  }
}
