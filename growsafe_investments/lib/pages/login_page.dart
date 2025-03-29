import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/pages/signup_page.dart';
import 'package:growsafe_investments/providers/auth_provider.dart';
import 'package:growsafe_investments/screens/main_screen.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final TextEditingController _usernameController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();

    void _login() async {
      await authProvider.login(
        _usernameController.text,
        _passwordController.text,
        context,
      );
      if (authProvider.isAuthenticated) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainScreen()),
        );
      }
    }

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
              // Determine max width based on screen size
              double maxFormWidth = constraints.maxWidth > 600 ? 400 : constraints.maxWidth * 0.9;
              double padding = constraints.maxWidth > 600 ? 32.0 : 16.0;

              return SingleChildScrollView(
                padding: EdgeInsets.all(padding),
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: maxFormWidth),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Login to GrowSafe',
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
                            borderRadius: BorderRadius.circular(8),
                          ),
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
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                      SizedBox(height: padding),
                      if (authProvider.errorMessage != null)
                        Text(
                          authProvider.errorMessage!,
                          style: GoogleFonts.poppins(color: Colors.redAccent),
                        ),
                      SizedBox(height: padding),
                      authProvider.isLoading
                          ? const CircularProgressIndicator()
                          : ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.teal,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                padding: EdgeInsets.symmetric(
                                  horizontal: padding * 2,
                                  vertical: padding * 0.75,
                                ),
                              ),
                              onPressed: _login,
                              child: Text(
                                'Login',
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: constraints.maxWidth > 600 ? 18 : 16,
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
                          style: GoogleFonts.poppins(color: Colors.white70),
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