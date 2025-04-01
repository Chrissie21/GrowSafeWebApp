import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/pages/login_page.dart';
import 'package:growsafe_investments/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class SignupPage extends StatelessWidget {
  const SignupPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final TextEditingController usernameController = TextEditingController();
    final TextEditingController emailController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();
    final TextEditingController confirmPasswordController = TextEditingController();

    Future <void> signup() async {
      await authProvider.signup(
        usernameController.text,
        emailController.text,
        passwordController.text,
        confirmPasswordController.text,
      );
      if (authProvider.isAuthenticated) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
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
              double maxFormWidth = constraints.maxWidth > 600 ? 400 : constraints.maxWidth * 0.9;
              double padding = constraints.maxWidth > 600 ? 32.0 : 16.0;

              return SingleChildScrollView(
                padding: EdgeInsets.all(padding),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Title above the box
                    Text(
                      'Sign Up for GrowSafe',
                      style: GoogleFonts.poppins(
                        fontSize: constraints.maxWidth > 600 ? 32 : 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: padding),
                    // Box with shadow containing the form
                    Container(
                      padding: EdgeInsets.all(padding),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05), // Slightly transparent white for contrast
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            spreadRadius: 2,
                            blurRadius: 10,
                            offset: const Offset(0, 4), // Shadow below the box
                          ),
                        ],
                      ),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: maxFormWidth),
                        child: Column(
                          children: [
                            TextField(
                              controller: usernameController,
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
                              controller: emailController,
                              style: const TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                labelText: 'Email',
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
                              controller: passwordController,
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
                            TextField(
                              controller: confirmPasswordController,
                              style: const TextStyle(color: Colors.white),
                              obscureText: true,
                              decoration: InputDecoration(
                                labelText: 'Confirm Password',
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
                                    onPressed: signup,
                                    child: Text(
                                      'Sign Up',
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
                                  MaterialPageRoute(builder: (context) => const LoginPage()),
                                );
                              },
                              child: Text(
                                'Already have an account? Login',
                                style: GoogleFonts.poppins(color: Colors.white70),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}