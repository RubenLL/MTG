import 'package:equatable/equatable.dart';

class CardEntity extends Equatable {
  final String name;
  final int quantity;
  final bool isSideboard;

  const CardEntity({
    required this.name,
    required this.quantity,
    this.isSideboard = false,
  });

  @override
  List<Object> get props => [name, quantity, isSideboard];
}

class DeckValidationEntity extends Equatable {
  final bool isValid;
  final int mainDeckCount;
  final int sideboardCount;
  final String format;
  final List<ValidationErrorEntity> errors;
  final List<String> warnings;

  const DeckValidationEntity({
    required this.isValid,
    required this.mainDeckCount,
    required this.sideboardCount,
    required this.format,
    required this.errors,
    required this.warnings,
  });

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

class ValidationErrorEntity extends Equatable {
  final String code;
  final String message;
  final String cardName;

  const ValidationErrorEntity({
    required this.code,
    required this.message,
    required this.cardName,
  });

  @override
  List<Object> get props => [code, message, cardName];
}
