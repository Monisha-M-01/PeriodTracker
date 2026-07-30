import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFC15F3C),
        primary: const Color(0xFFC15F3C),
        secondary: const Color(0xFFE5A475),
        surface: const Color(0xFFFAFAFA),
        background: const Color(0xFFFFFDFB),
      ),
      scaffoldBackgroundColor: const Color(0xFFFFFDFB),
      fontFamily: 'Inter',
    );
  }
}
