import 'package:flutter/material.dart';

import '../../features/deck_validation/presentation/pages/deck_validation_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import 'route_names.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.home:
        return MaterialPageRoute(builder: (_) => const HomePage());
      case RouteNames.deckValidation:
        return MaterialPageRoute(builder: (_) => const DeckValidationPage());
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(
              child: Text('Page not found'),
            ),
          ),
        );
    }
  }
}
