import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/config/app_config.dart';
import 'core/config/bloc_observer.dart';
import 'core/config/dependency_injection.dart';
import 'core/routes/app_router.dart';
import 'core/routes/route_names.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize dependencies
  await initDependencies();

  // Setup Bloc observer for debugging
  Bloc.observer = AppBlocObserver();

  runApp(const MTGDeckAnalyzerApp());
}

class MTGDeckAnalyzerApp extends StatelessWidget {
  const MTGDeckAnalyzerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MTG Deck Analyzer',
      theme: AppConfig.theme,
      initialRoute: RouteNames.home,
      onGenerateRoute: AppRouter.generateRoute,
      debugShowCheckedModeBanner: false,
    );
  }
}
