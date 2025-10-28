import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../../core/config/app_config.dart';
import '../../../../core/error/failures.dart';
import '../models/deck_validation_model.dart';

abstract class DeckValidationRemoteDataSource {
  Future<DeckValidationModel> validateDeck({
    required List<String> deckList,
    required String format,
  });
}

class DeckValidationRemoteDataSourceImpl implements DeckValidationRemoteDataSource {
  final http.Client client;

  DeckValidationRemoteDataSourceImpl({required this.client});

  @override
  Future<DeckValidationModel> validateDeck({
    required List<String> deckList,
    required String format,
  }) async {
    final requestBody = {
      'deckList': deckList,
      'format': format,
    };

    final response = await client.post(
      Uri.parse('${AppConfig.apiBaseUrl}/deck/validate'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(requestBody),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = json.decode(response.body);
      return DeckValidationModel.fromJson(jsonResponse);
    } else {
      throw ServerFailure();
    }
  }
}
