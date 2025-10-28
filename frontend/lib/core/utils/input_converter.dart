import 'package:dartz/dartz.dart';

import '../error/failures.dart';

class InputConverter {
  Either<Failure, String> stringToUnsignedInt(String str) {
    try {
      final integer = int.parse(str);
      if (integer < 0) throw const FormatException();
      return Right(str);
    } on FormatException {
      return const Left(ValidationFailure('Invalid number format'));
    }
  }

  Either<Failure, int> stringToUnsignedInteger(String str) {
    try {
      final integer = int.parse(str);
      if (integer < 0) throw const FormatException();
      return Right(integer);
    } on FormatException {
      return const Left(ValidationFailure('Invalid number format'));
    }
  }
}
