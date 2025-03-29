import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/models/user.dart';
import 'package:growsafe_investments/widgets/circle_button.dart';

class AccountPage extends StatelessWidget {
  final User user;
  final Function(double) onDeposit;
  final Function(double) onWithdraw;

  const AccountPage({
    super.key,
    required this.user,
    required this.onDeposit,
    required this.onWithdraw,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background layer
          Container(
            width: double.infinity,
            height: double.infinity, // Ensure it covers the full screen
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF1A3C34), Color(0xFF0A1F44)],
              ),
            ),
          ),
          // Scrollable content layer
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                double padding = constraints.maxWidth > 600 ? 32.0 : 16.0;
                double maxContentWidth = constraints.maxWidth > 800 ? 600 : constraints.maxWidth * 0.85;

                return SingleChildScrollView(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight, // Ensure content takes full height if shorter
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(padding),
                      child: Center(
                        child: ConstrainedBox(
                          constraints: BoxConstraints(maxWidth: maxContentWidth),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              FadeInDown(child: _buildProfileSection(constraints)),
                              SizedBox(height: padding * 1.5),
                              FadeInLeft(child: _buildNavigationButtons(context, constraints)),
                              SizedBox(height: padding * 1.5),
                              FadeInUp(child: _buildAdditionalContent(constraints)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(BoxConstraints constraints) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF66C2A5), Color(0xFF3E6B6B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                radius: 40,
                backgroundColor: Color(0xFFD5F0E8),
                child: Icon(Icons.person, size: 40, color: Color(0xFF1A3C34)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.userId,
                      style: GoogleFonts.poppins(
                        fontSize: constraints.maxWidth > 600 ? 20 : 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'ID: ${user.id}',
                      style: GoogleFonts.poppins(
                        color: Colors.white70,
                        fontSize: constraints.maxWidth > 600 ? 16 : 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: constraints.maxWidth > 600 ? 32 : 16,
            runSpacing: 8,
            children: [
              Column(
                children: [
                  Text(
                    '\$${user.total.toStringAsFixed(2)}',
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: constraints.maxWidth > 600 ? 16 : 14,
                    ),
                  ),
                  Text(
                    'Total',
                    style: GoogleFonts.poppins(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    '\$${user.totalDeposit.toStringAsFixed(2)}',
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: constraints.maxWidth > 600 ? 16 : 14,
                    ),
                  ),
                  Text(
                    'Total Deposit',
                    style: GoogleFonts.poppins(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    '\$${user.totalWithdraw.toStringAsFixed(2)}',
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: constraints.maxWidth > 600 ? 16 : 14,
                    ),
                  ),
                  Text(
                    'Total Withdraw',
                    style: GoogleFonts.poppins(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNavigationButtons(BuildContext context, BoxConstraints constraints) {
    double buttonSize = constraints.maxWidth > 600 ? 80.0 : 60.0;
    return Wrap(
      spacing: constraints.maxWidth > 600 ? 32 : 16,
      runSpacing: 16,
      alignment: WrapAlignment.center,
      children: [
        ZoomIn(
          child: CircleButton(
            label: 'Deposit',
            icon: Icons.account_balance_wallet,
            size: buttonSize,
            onPressed: () => _showDepositDialog(context),
          ),
        ),
        ZoomIn(
          child: CircleButton(
            label: 'Withdraw',
            icon: Icons.money_off,
            size: buttonSize,
            onPressed: () => _showWithdrawDialog(context),
          ),
        ),
        ZoomIn(
          child: CircleButton(
            label: 'Password',
            icon: Icons.lock,
            size: buttonSize,
            onPressed: () => _showPasswordDialog(context),
          ),
        ),
        ZoomIn(
          child: CircleButton(
            label: 'Account',
            icon: Icons.person,
            size: buttonSize,
          ),
        ),
      ],
    );
  }

  Widget _buildAdditionalContent(BoxConstraints constraints) {
    return Container(
      width: double.infinity,
      height: constraints.maxWidth > 600 ? 250 : 200,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF66C2A5), Color(0xFF3E6B6B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: Text(
          'Additional Content',
          style: GoogleFonts.poppins(
            color: Colors.white70,
            fontSize: constraints.maxWidth > 600 ? 18 : 16,
          ),
        ),
      ),
    );
  }

  void _showDepositDialog(BuildContext context) {
    final TextEditingController amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFFD5F0E8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          'Deposit Funds',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34),
          ),
        ),
        content: TextField(
          controller: amountController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Amount',
            labelStyle: GoogleFonts.poppins(color: const Color(0xFF3E6B6B)),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            filled: true,
            fillColor: Colors.white,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(color: const Color(0xFF3E6B6B)),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF66C2A5),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              final amount = double.tryParse(amountController.text) ?? 0.0;
              if (amount > 0) {
                onDeposit(amount);
                Navigator.pop(context);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Please enter a valid amount',
                      style: GoogleFonts.poppins(),
                    ),
                    backgroundColor: Colors.redAccent,
                  ),
                );
              }
            },
            child: Text(
              'Deposit',
              style: GoogleFonts.poppins(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showWithdrawDialog(BuildContext context) {
    final TextEditingController amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFFD5F0E8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          'Withdraw Funds',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34),
          ),
        ),
        content: TextField(
          controller: amountController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Amount',
            labelStyle: GoogleFonts.poppins(color: const Color(0xFF3E6B6B)),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            filled: true,
            fillColor: Colors.white,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(color: const Color(0xFF3E6B6B)),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF66C2A5),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              final amount = double.tryParse(amountController.text) ?? 0.0;
              if (amount > 0) {
                final success = onWithdraw(amount);
                Navigator.pop(context);
                if (!success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Insufficient balance',
                        style: GoogleFonts.poppins(),
                      ),
                      backgroundColor: Colors.redAccent,
                    ),
                  );
                }
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Please enter a valid amount',
                      style: GoogleFonts.poppins(),
                    ),
                    backgroundColor: Colors.redAccent,
                  ),
                );
              }
            },
            child: Text(
              'Withdraw',
              style: GoogleFonts.poppins(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showPasswordDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFFD5F0E8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          'Change Password',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34),
          ),
        ),
        content: Text(
          'Password change functionality coming soon!',
          style: GoogleFonts.poppins(color: const Color(0xFF3E6B6B)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'OK',
              style: GoogleFonts.poppins(color: const Color(0xFF3E6B6B)),
            ),
          ),
        ],
      ),
    );
  }
}