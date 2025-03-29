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

  static const List<Map<String, dynamic>> investmentOptions = [
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
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 1200 ? 4 : constraints.maxWidth > 600 ? 3 : 2;
        return SafeArea(
          child: Padding(
            padding: EdgeInsets.all(constraints.maxWidth > 800 ? 32.0 : 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInDown(
                  child: Text(
                    'Choose Your Investment Plan',
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1A3C34),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Expanded(
                  child: GridView.builder(
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossAxisCount,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 1.2,
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
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildInvestmentCard(BuildContext context, Map<String, dynamic> option) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF26A69A), Color(0xFF80CBC4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _showInvestmentDialog(context, option),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
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
                const SizedBox(height: 12),
                Text(
                  'Return: ${(option['dailyReturnRate'] * 100).toStringAsFixed(1)}%',
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Invest in ${option['name']}',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34),
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Daily Return: ${(option['dailyReturnRate'] * 100).toStringAsFixed(1)}%',
              style: GoogleFonts.poppins(color: Colors.grey[600]),
            ),
            Text(
              'Min Amount: \$${option['minAmount'].toStringAsFixed(2)}',
              style: GoogleFonts.poppins(color: Colors.grey[600]),
            ),
            Text(
              'Available Balance: \$${user.total.toStringAsFixed(2)}',
              style: GoogleFonts.poppins(color: Colors.grey[600]),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Amount to Invest',
                labelStyle: GoogleFonts.poppins(),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                filled: true,
                fillColor: Colors.grey[100],
                prefixIcon: const Icon(Icons.attach_money, color: Color(0xFF26A69A)),
              ),
            ),
          ],
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
                          ? 'Amount below minimum requirement!'
                          : 'Insufficient balance!',
                      style: GoogleFonts.poppins(),
                    ),
                    backgroundColor: Colors.redAccent,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: Text('Invest', style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}