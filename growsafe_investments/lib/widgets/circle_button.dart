import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CircleButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onPressed;
  final double size; // Added size parameter

  const CircleButton({
    super.key,
    required this.label,
    required this.icon,
    this.onPressed,
    this.size = 60.0, // Default size (diameter of the button)
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: onPressed,
          child: Container(
            width: size, // Set width based on size
            height: size, // Set height based on size
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Colors.teal, Colors.cyan],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: CircleAvatar(
              radius: size / 2, // Radius is half the size
              backgroundColor: Colors.transparent,
              child: Icon(
                icon,
                size: size * 0.5, // Icon scales with button size
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: size * 0.2, // Text scales with button size
          ),
        ),
      ],
    );
  }
}