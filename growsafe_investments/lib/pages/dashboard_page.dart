import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/models/user.dart';

class DashboardPage extends StatelessWidget {
  final User user;

  const DashboardPage({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            double padding = constraints.maxWidth > 800 ? 32.0 : 16.0;
            return SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(padding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    FadeInDown(child: _buildHeader(constraints)),
                    SizedBox(height: padding),
                    FadeInLeft(child: _buildBalanceCards(constraints)),
                    SizedBox(height: padding),
                    FadeInRight(child: _buildInvestmentsSummary(constraints)),
                    SizedBox(height: padding),
                    FadeInUp(child: _buildDynamicInfoSection(constraints)),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader(BoxConstraints constraints) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Text(
            'GrowSafe Investments',
            style: GoogleFonts.poppins(
              fontSize: constraints.maxWidth > 800 ? 28 : 24,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A3C34),
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.chat_bubble_outline, size: 20),
              label: const Text('Support'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: const Color(0xFF26A69A),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 2,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
            ),
            const SizedBox(width: 16),
            CircleAvatar(
              radius: constraints.maxWidth > 800 ? 20 : 16,
              backgroundColor: const Color(0xFF26A69A),
              child: Text(
                user.userId.isNotEmpty ? user.userId[0].toUpperCase() : 'U',  // Fallback to 'U'
                style: GoogleFonts.poppins(
                  fontSize: constraints.maxWidth > 800 ? 18 : 14,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBalanceCards(BoxConstraints constraints) {
    double cardWidth = (constraints.maxWidth - 48) / 2; // 48 for padding
    return Wrap(
      spacing: 16.0,
      runSpacing: 16.0,
      alignment: WrapAlignment.center,
      children: [
        _buildBalanceCard('Total Balance', '\$${user.total.toStringAsFixed(2)}', cardWidth),
        _buildBalanceCard('Daily Earnings', '\$${user.dailyEarnings.toStringAsFixed(2)}', cardWidth),
      ],
    );
  }

  Widget _buildBalanceCard(String title, String value, double maxWidth) {
    return Container(
      width: maxWidth.clamp(150, 300),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF26A69A), Color(0xFF80CBC4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            title,
            style: GoogleFonts.poppins(color: Colors.white70, fontSize: 16),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentsSummary(BoxConstraints constraints) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Investments',
            style: GoogleFonts.poppins(
              fontSize: constraints.maxWidth > 800 ? 20 : 18,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A3C34),
            ),
          ),
          const SizedBox(height: 16),
          user.investments.isEmpty
              ? Center(
                  child: Text(
                    'No Investments Yet',
                    style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 16),
                  ),
                )
              : SizedBox(
                  height: 200,
                  child: ListView.builder(
                    itemCount: user.investments.length,
                    itemBuilder: (context, index) {
                      final investment = user.investments[index];
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(
                          investment.name,
                          style: GoogleFonts.poppins(color: const Color(0xFF1A3C34), fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(
                          'Amount: \$${investment.amount.toStringAsFixed(2)}',
                          style: GoogleFonts.poppins(color: Colors.grey[600]),
                        ),
                        trailing: Text(
                          '${(investment.dailyReturnRate * 100).toStringAsFixed(1)}%',
                          style: GoogleFonts.poppins(color: const Color(0xFF26A69A), fontWeight: FontWeight.w600),
                        ),
                      );
                    },
                  ),
                ),
        ],
      ),
    );
  }

  Widget _buildDynamicInfoSection(BoxConstraints constraints) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Market Insights',
            style: GoogleFonts.poppins(
              fontSize: constraints.maxWidth > 800 ? 20 : 18,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A3C34),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Stay tuned for real-time market updates and personalized recommendations.',
            style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 16),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: const Color(0xFF26A69A),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 2,
            ),
            child: const Text('Learn More'),
          ),
        ],
      ),
    );
  }
}