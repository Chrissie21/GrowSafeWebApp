import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/models/user.dart';

class InvestmentSelectionPage extends StatelessWidget {
  final User user;
  final Function(Investment) onInvest;

  const InvestmentSelectionPage({
    super.key,
    required this.user,
    required this.onInvest,
  });

  // Sample investment options
  final List<Map<String, dynamic>> investmentOptions = const [
    {'name': 'Plan A', 'dailyReturnRate': 0.03, 'minAmount': 10.0},
    {'name': 'Plan B', 'dailyReturnRate': 0.05, 'minAmount': 50.0},
    {'name': 'Plan C', 'dailyReturnRate': 0.07, 'minAmount': 100.0},
    {'name': 'Plan D', 'dailyReturnRate': 0.10, 'minAmount': 500.0},
    {'name': 'Plan E', 'dailyReturnRate': 0.12, 'minAmount': 1000.0},
    {'name': 'Plan F', 'dailyReturnRate': 0.15, 'minAmount': 5000.0},
    {'name': 'Plan G', 'dailyReturnRate': 0.20, 'minAmount': 10000.0},
    {'name': 'Plan H', 'dailyReturnRate': 0.25, 'minAmount': 50000.0},
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1,
          ),
          itemCount: investmentOptions.length,
          itemBuilder: (context, index) {
            final option = investmentOptions[index];
            return ZoomIn(
              delay: Duration(milliseconds: index * 100),
              child: _buildInvestmentCard(context, option),
            );
          },
        ),
      ),
    );
  }

  Widget _buildInvestmentCard(BuildContext context, Map<String, dynamic> option) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.teal, Colors.cyan],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            _showInvestmentDialog(context, option);
          },
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  option['name'],
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Daily Return: ${(option['dailyReturnRate'] * 100).toStringAsFixed(1)}%',
                  style: GoogleFonts.poppins(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                Text(
                  'Min: \$${option['minAmount'].toStringAsFixed(2)}',
                  style: GoogleFonts.poppins(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showInvestmentDialog(BuildContext context, Map<String, dynamic> option) {
    final TextEditingController amountController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          'Invest in ${option['name']}',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: Colors.teal,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Daily Return: ${(option['dailyReturnRate'] * 100).toStringAsFixed(1)}%',
              style: GoogleFonts.poppins(color: Colors.black54),
            ),
            Text(
              'Minimum Amount: \$${option['minAmount'].toStringAsFixed(2)}',
              style: GoogleFonts.poppins(color: Colors.black54),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Amount to Invest',
                labelStyle: GoogleFonts.poppins(),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                filled: true,
                fillColor: Colors.grey[200],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(color: Colors.grey),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.teal,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              final amount = double.tryParse(amountController.text) ?? 0.0;
              if (amount >= option['minAmount'] && amount <= user.total) {
                user.total -= amount;
                onInvest(Investment(
                  name: option['name'],
                  amount: amount,
                  dailyReturnRate: option['dailyReturnRate'],
                ));
                Navigator.pop(context);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      amount < option['minAmount']
                          ? 'Amount is less than the minimum required!'
                          : 'Insufficient balance!',
                      style: GoogleFonts.poppins(),
                    ),
                    backgroundColor: Colors.redAccent,
                  ),
                );
              }
            },
            child: Text(
              'Invest',
              style: GoogleFonts.poppins(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}