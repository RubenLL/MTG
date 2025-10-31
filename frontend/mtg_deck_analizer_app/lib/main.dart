import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'src/app.dart';
import 'src/core/di/injection_container.dart';

void main() async {
  // Ensure Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();
  
  // Configure dependency injection
  configureDependencies();
  
  // Run the app
  runApp(const App());
}
