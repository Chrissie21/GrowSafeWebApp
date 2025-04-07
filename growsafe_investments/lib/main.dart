import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/dashboard/login_page.dart';
import 'package:growsafe_investments/providers/auth_provider.dart';
import 'package:provider/provider.dart';
import 'package:growsafe_investments/dashboard/dashboard_page.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AuthProvider(),
      child: const GrowSafeInvestmentsApp(),
    ),
  );
}

class GrowSafeInvestmentsApp extends StatelessWidget {
  const GrowSafeInvestmentsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GrowSafe Page',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        scaffoldBackgroundColor: Colors.transparent,
        textTheme: GoogleFonts.poppinsTextTheme(
          Theme.of(context).textTheme,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
      ),
      home: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          if (authProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (authProvider.isAuthenticated && authProvider.user != null) {
            return DashboardPage(user: authProvider.user!);
          } else {
            return const LoginPage();
          }
        },
      ),
    );
  }
}