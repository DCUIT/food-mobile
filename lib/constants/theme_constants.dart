import 'package:flutter/material.dart';

const Color primaryColor = Colors.orange;
const Color accentColor = Colors.green;
const Color textColor = Colors.grey;

ThemeData appTheme() {
  return ThemeData(
    colorScheme: const ColorScheme.light(primary: Colors.orange),
    useMaterial3: true,
    fontFamily: 'Roboto',
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.orange,
      foregroundColor: Colors.white,
    ),
  );
}
