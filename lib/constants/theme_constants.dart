import 'package:flutter/material.dart';

const Color primaryColor = Colors.orange;
const Color accentColor = Colors.green;
const Color textColor = Colors.grey;
const double kPadding = 16.0;
const double kCardElevation = 4.0;
const double kBorderRadius = 12.0;

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

class Responsive {
  static bool isMobile(BuildContext context) => MediaQuery.of(context).size.width < 600;
  static bool isTablet(BuildContext context) => MediaQuery.of(context).size.width >= 600 && MediaQuery.of(context).size.width < 1200;
  static double gridChildAspectRatio(BuildContext context) => Responsive.isTablet(context) ? 1.2 : 0.75;
}

