import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppConfig {
  static const String appName = 'MTG Deck Analyzer';
  static const String apiBaseUrl = 'https://api.mtgdeckanalyzer.com';

  static ThemeData get theme {
    return ThemeData(
      primarySwatch: Colors.blue,
      textTheme: GoogleFonts.robotoTextTheme(),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.blue.shade800,
        foregroundColor: Colors.white,
        elevation: 2,
        titleTextStyle: GoogleFonts.roboto(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue.shade800,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.blue.shade800, width: 2),
        ),
      ),
    );
  }
}
