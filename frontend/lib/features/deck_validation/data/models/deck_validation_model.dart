import 'package:equatable/equatable.dart';

import '../../domain/entities/deck_validation_entity.dart';

class CardModel extends Equatable {
  final String name;
  final int quantity;
  final bool isSideboard;

  const CardModel({
    required this.name,
    required this.quantity,
    this.isSideboard = false,
  });

  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      name: json['name'] as String,
      quantity: json['quantity'] as int,
      isSideboard: json['isSideboard'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'quantity': quantity,
      'isSideboard': isSideboard,
    };
  }

  CardEntity toEntity() {
    return CardEntity(
      name: name,
      quantity: quantity,
      isSideboard: isSideboard,
    );
  }

  @override
  List<Object> get props => [name, quantity, isSideboard];
}

class DeckValidationModel extends Equatable {
  final bool isValid;
  final int mainDeckCount;
  final int sideboardCount;
  final String format;
  final List<ValidationErrorModel> errors;
  final List<String> warnings;

  const DeckValidationModel({
    required this.isValid,
    required this.mainDeckCount,
    required this.sideboardCount,
    required this.format,
    required this.errors,
    required this.warnings,
  });

  factory DeckValidationModel.fromJson(Map<String, dynamic> json) {
    return DeckValidationModel(
      isValid: json['isValid'] as bool,
      mainDeckCount: json['mainDeckCount'] as int,
      sideboardCount: json['sideboardCount'] as int,
      format: json['format'] as String,
      errors: (json['errors'] as List<dynamic>?)
              ?.map((e) => ValidationErrorModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      warnings: (json['warnings'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'isValid': isValid,
      'mainDeckCount': mainDeckCount,
      'sideboardCount': sideboardCount,
      'format': format,
      'errors': errors.map((e) => e.toJson()).toList(),
      'warnings': warnings,
    };
  }

  DeckValidationEntity toEntity() {
    return DeckValidationEntity(
      isValid: isValid,
      mainDeckCount: mainDeckCount,
      sideboardCount: sideboardCount,
      format: format,
      errors: errors.map((e) => e.toEntity()).toList(),
      warnings: warnings,
    );
  }

  @override
  List<Object> get props => [
        isValid,
        mainDeckCount,
        sideboardCount,
        format,
        errors,
        warnings,
      ];
}

class ValidationErrorModel extends Equatable {
  final String code;
  final String message;
  final String cardName;

  const ValidationErrorModel({
    required this.code,
    required this.message,
    required this.cardName,
  });

  factory ValidationErrorModel.fromJson(Map<String, dynamic> json) {
    return ValidationErrorModel(
      code: json['code'] as String,
      message: json['message'] as String,
      cardName: json['cardName'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'message': message,
      'cardName': cardName,
    };
  }

  ValidationErrorEntity toEntity() {
    return ValidationErrorEntity(
      code: code,
      message: message,
      cardName: cardName,
    );
  }

  @override
  List<Object> get props => [code, message, cardName];
}
