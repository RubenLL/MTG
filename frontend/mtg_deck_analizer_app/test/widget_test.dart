// This is a basic Flutter widget test for the MTG Deck Analyzer app.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mtg_deck_analizer_app/src/app.dart';
import 'package:mtg_deck_analizer_app/src/features/deck_validation/presentation/pages/deck_validation_page.dart';

void main() {
  testWidgets('App should render DeckValidationPage', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const App());

    // Verify that the app renders the DeckValidationPage
    expect(find.byType(DeckValidationPage), findsOneWidget);
    
    // Verify that the app title is displayed
    expect(find.text('MTG Deck Analyzer'), findsOneWidget);
  });
}
