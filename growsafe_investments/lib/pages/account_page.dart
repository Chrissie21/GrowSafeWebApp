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
    return SafeArea(
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth > 600;
          return Padding(
            padding: EdgeInsets.all(isWide ? 32.0 : 16.0),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeInDown(
                    child: Text(
                      'My Account',
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF1A3C34),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  FadeInLeft(child: _buildProfileSection(isWide)),
                  const SizedBox(height: 24),
                  FadeInRight(child: _buildNavigationButtons(context, isWide)),
                  const SizedBox(height: 24),
                  FadeInUp(child: _buildAdditionalContent()),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileSection(bool isWide) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: isWide
          ? Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundColor: Color(0xFF26A69A),
                  child: Icon(Icons.person, size: 40, color: Colors.white),
                ),
                const SizedBox(width: 24),
                Expanded(child: _buildProfileDetails()),
                const SizedBox(width: 24),
                Expanded(child: Column(children: _buildAccountStats())),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(
                      radius: 40,
                      backgroundColor: Color(0xFF26A69A),
                      child: Icon(Icons.person, size: 40, color: Colors.white),
                    ),
                    const SizedBox(width: 16),
                    Expanded(child: _buildProfileDetails()),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: _buildAccountStats(),
                ),
              ],
            ),
    );
  }

  Widget _buildProfileDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          user.userId,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34),
          ),
        ),
        Text(
          'ID: ${user.id}',
          style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[600]),
        ),
      ],
    );
  }

  List<Widget> _buildAccountStats() {
    return [
      _buildStatTile("Total", user.total),
      _buildStatTile("Deposits", user.totalDeposit),
      _buildStatTile("Withdrawals", user.totalWithdraw),
    ];
  }

  Widget _buildStatTile(String title, double amount) {
    return Column(
      children: [
        Text(
          '\$${amount.toStringAsFixed(2)}',
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF26A69A),
          ),
        ),
        Text(
          title,
          style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
        ),
      ],
    );
  }

  Widget _buildNavigationButtons(BuildContext context, bool isWide) {
    return isWide
        ? Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleButton(
                label: 'Deposit',
                icon: Icons.account_balance_wallet,
                size: 80,
                onPressed: () => _showDepositDialog(context),
              ),
              const SizedBox(width: 32),
              CircleButton(
                label: 'Withdraw',
                icon: Icons.money_off,
                size: 80,
                onPressed: () => _showWithdrawDialog(context),
              ),
            ],
          )
        : Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              CircleButton(
                label: 'Deposit',
                icon: Icons.account_balance_wallet,
                size: 70,
                onPressed: () => _showDepositDialog(context),
              ),
              CircleButton(
                label: 'Withdraw',
                icon: Icons.money_off,
                size: 70,
                onPressed: () => _showWithdrawDialog(context),
              ),
            ],
          );
  }

  Widget _buildAdditionalContent() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Account Overview',
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A3C34),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Manage your funds and track your investment journey here.',
            style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[600]),
          ),
        ],
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
        title: Text(
          title,
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
            labelStyle: GoogleFonts.poppins(),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            filled: true,
            fillColor: Colors.grey[100],
            prefixIcon: const Icon(Icons.attach_money, color: Color(0xFF26A69A)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: GoogleFonts.poppins(color: Colors.grey[600])),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF26A69A),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              elevation: 2,
            ),
            onPressed: () {
              final amount = double.tryParse(amountController.text) ?? 0.0;
              if (amount > 0 && (title.contains('Withdraw') ? amount <= user.total : true)) {
                action(amount);
                Navigator.pop(context);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      amount <= 0 ? 'Enter a valid amount!' : 'Insufficient balance!',
                      style: GoogleFonts.poppins(),
                    ),
                    backgroundColor: Colors.redAccent,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: Text('Confirm', style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}