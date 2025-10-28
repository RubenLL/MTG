import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../../core/config/app_config.dart';
import '../../../../core/error/failures.dart';
import '../models/home_model.dart';

abstract class HomeRemoteDataSource {
  Future<HomeModel> getHomeData();
}

class HomeRemoteDataSourceImpl implements HomeRemoteDataSource {
  final http.Client client;

  HomeRemoteDataSourceImpl({required this.client});

  @override
  Future<HomeModel> getHomeData() async {
    final response = await client.get(
      Uri.parse('${AppConfig.apiBaseUrl}/home'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = json.decode(response.body);
      return HomeModel.fromJson(jsonResponse);
    } else {
      throw ServerFailure();
    }
  }
}
