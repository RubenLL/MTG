import 'package:flutter/material.dart';

class BuildConfig {
  static const String appName = 'MTG Deck Analyzer';
  static const String version = '1.0.0';
  static const int versionCode = 1;

  // Environment configuration
  static const bool isDebug = !const bool.fromEnvironment('dart.vm.product');
  static const String environment = isDebug ? 'development' : 'production';

  // API Configuration
  static const String apiBaseUrl = isDebug
      ? 'http://localhost:3000/api'
      : 'https://api.mtgdeckanalyzer.com';

  // Feature flags
  static const bool enableLogging = isDebug;
  static const bool enableErrorReporting = true;

  // App settings
  static const Duration networkTimeout = Duration(seconds: 30);
  static const int maxRetries = 3;
}
