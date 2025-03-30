import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/pages/signup_page.dart';
import 'package:growsafe_investments/providers/auth_provider.dart';
import 'package:growsafe_investments/screens/main_screen.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  Future<void> _login() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.login(
      _usernameController.text,
      _passwordController.text,
    );
    print("Login: isAuthenticated=${authProvider.isAuthenticated}, user=${authProvider.user}");
    if (mounted && authProvider.isAuthenticated && authProvider.user != null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainScreen()),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            authProvider.errorMessage ?? 'Login failed. Please try again.',
            style: GoogleFonts.poppins(),
          ),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A3C34), Color(0xFF0A1F44)],
          ),
        ),
        child: Center(
          child: LayoutBuilder(
            builder: (context, constraints) {
              double maxFormWidth = constraints.maxWidth > 600 ? 400 : constraints.maxWidth * 0.9;
              double padding = constraints.maxWidth > 600 ? 32.0 : 16.0;

              return SingleChildScrollView(
                padding: EdgeInsets.all(padding),
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: maxFormWidth),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Login to GrowSafe',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: constraints.maxWidth > 600 ? 32 : 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: padding * 2),
                      TextField(
                        controller: _usernameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: 'Username',
                          labelStyle: GoogleFonts.poppins(color: Colors.white70),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.1),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.person, color: Colors.white70),
                        ),
                      ),
                      SizedBox(height: padding),
                      TextField(
                        controller: _passwordController,
                        style: const TextStyle(color: Colors.white),
                        obscureText: true,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          labelStyle: GoogleFonts.poppins(color: Colors.white70),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.1),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.lock, color: Colors.white70),
                        ),
                      ),
                      SizedBox(height: padding),
                      if (authProvider.errorMessage != null)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: Text(
                            authProvider.errorMessage!,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(color: Colors.redAccent, fontSize: 14),
                          ),
                        ),
                      SizedBox(height: padding),
                      authProvider.isLoading
                          ? const Center(child: CircularProgressIndicator(color: Colors.white))
                          : ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF26A69A),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: EdgeInsets.symmetric(
                                  horizontal: padding * 2,
                                  vertical: padding * 0.75,
                                ),
                                elevation: 2,
                              ),
                              onPressed: _login,
                              child: Text(
                                'Login',
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: constraints.maxWidth > 600 ? 18 : 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                      SizedBox(height: padding),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const SignupPage()),
                          );
                        },
                        child: Text(
                          'Don\'t have an account? Sign Up',
                          style: GoogleFonts.poppins(color: Colors.white70, fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}