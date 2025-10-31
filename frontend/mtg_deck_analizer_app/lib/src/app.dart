import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/theme/app_theme.dart';
import 'features/deck_validation/presentation/pages/deck_validation_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MTG Deck Analyzer',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: const DeckValidationPage(),
    );
  }
}
