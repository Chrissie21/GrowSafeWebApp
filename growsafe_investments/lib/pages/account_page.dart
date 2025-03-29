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
      appBar: AppBar(
        title: Text(
          "Account",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
        ),
        centerTitle: true,
        backgroundColor: const Color.fromARGB(255, 104, 209, 185),
      ),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF1A3C34), Color(0xFF0A1F44)],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  FadeInDown(child: _buildProfileSection()),
                  const SizedBox(height: 20),
                  FadeInLeft(child: _buildNavigationButtons(context)),
                  const SizedBox(height: 20),
                  FadeInUp(child: _buildAdditionalContent()),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const CircleAvatar(
                radius: 40,
                backgroundColor: Colors.white,
                child: Icon(Icons.person, size: 40, color: Color(0xFF1A3C34)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.userId,
                      style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    Text(
                      'ID: ${user.id}',
                      style: GoogleFonts.poppins(fontSize: 14, color: Colors.white70),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: _buildAccountStats(),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildAccountStats() {
    return [
      _buildStatTile("Total", user.total),
      _buildStatTile("Deposit", user.totalDeposit),
      _buildStatTile("Withdraw", user.totalWithdraw),
    ];
  }

  Widget _buildStatTile(String title, double amount) {
    return Column(
      children: [
        Text(
          '\$${amount.toStringAsFixed(2)}',
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        Text(
          title,
          style: GoogleFonts.poppins(fontSize: 12, color: Colors.white70),
        ),
      ],
    );
  }

  Widget _buildNavigationButtons(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        CircleButton(label: 'Deposit', icon: Icons.account_balance_wallet, size: 70, onPressed: () => _showDepositDialog(context)),
        CircleButton(label: 'Withdraw', icon: Icons.money_off, size: 70, onPressed: () => _showWithdrawDialog(context)),
      ],
    );
  }

  Widget _buildAdditionalContent() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(
        child: Text(
          'Additional Content',
          style: GoogleFonts.poppins(fontSize: 16, color: Colors.white70),
        ),
      ),
    );
  }

  void _showDepositDialog(BuildContext context) {
    _showAmountDialog(context, "Deposit Funds", onDeposit);
  }

  void _showWithdrawDialog(BuildContext context) {
    _showAmountDialog(context, "Withdraw Funds", onWithdraw);
  }

  void _showAmountDialog(BuildContext context, String title, Function(double) action) {
    final TextEditingController amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(title, style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.black)),
        content: TextField(
          controller: amountController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: 'Amount',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            filled: true,
            fillColor: Colors.grey.shade200,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: GoogleFonts.poppins(color: Colors.black54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF66C2A5)),
            onPressed: () {
              final amount = double.tryParse(amountController.text) ?? 0.0;
              if (amount > 0) {
                action(amount);
                Navigator.pop(context);
              }
            },
            child: Text('Confirm', style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
