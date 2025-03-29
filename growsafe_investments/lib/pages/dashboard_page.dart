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
      backgroundColor: const Color(0xFFF5F7FA), // Light gray background
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(constraints.maxWidth > 800 ? 32.0 : 16.0),
                child: constraints.maxWidth > 800
                    ? _buildDesktopLayout(context)
                    : _buildMobileLayout(context),
              ),
            );
          },
        ),
      ),
    );
  }

  // Mobile Layout (Single Column)
  Widget _buildMobileLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        FadeInDown(child: _buildHeader(context)),
        const SizedBox(height: 24),
        FadeInLeft(child: _buildBalanceCards(context)),
        const SizedBox(height: 24),
        FadeInRight(child: _buildInvestmentsSummary(context)),
        const SizedBox(height: 24),
        FadeInUp(child: _buildDynamicInfoSection(context)),
      ],
    );
  }

  // Desktop Layout (Grid-like)
  Widget _buildDesktopLayout(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(child: _buildHeader(context)),
              const SizedBox(height: 24),
              FadeInLeft(child: _buildBalanceCards(context)),
            ],
          ),
        ),
        const SizedBox(width: 32),
        Expanded(
          flex: 3,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInRight(child: _buildInvestmentsSummary(context)),
              const SizedBox(height: 24),
              FadeInUp(child: _buildDynamicInfoSection(context)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'GrowSafe Investments',
          style: GoogleFonts.poppins(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34), // Dark teal
          ),
        ),
        Row(
          children: [
            ElevatedButton.icon(
              onPressed: () {
                // Navigate to chat or support
              },
              icon: const Icon(Icons.chat_bubble_outline, size: 20),
              label: const Text('Support'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: const Color(0xFF26A69A), // Teal
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
            ),
            const SizedBox(width: 16),
            CircleAvatar(
              radius: 20,
              backgroundColor: const Color(0xFF26A69A),
              child: Text(
                user.userId[0].toUpperCase(),
                style: GoogleFonts.poppins(
                  fontSize: 18,
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

  Widget _buildBalanceCards(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 600;
        return isWide
            ? Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: _buildBalanceCard('Total Balance', '\$${user.total.toStringAsFixed(2)}')),
                  const SizedBox(width: 16),
                  Expanded(child: _buildBalanceCard('Daily Earnings', '\$${user.dailyEarnings.toStringAsFixed(2)}')),
                ],
              )
            : Column(
                children: [
                  _buildBalanceCard('Total Balance', '\$${user.total.toStringAsFixed(2)}'),
                  const SizedBox(height: 16),
                  _buildBalanceCard('Daily Earnings', '\$${user.dailyEarnings.toStringAsFixed(2)}'),
                ],
              );
      },
    );
  }

  Widget _buildBalanceCard(String title, String value) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF26A69A), Color(0xFF80CBC4)], // Teal to light teal
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
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            title,
            style: GoogleFonts.poppins(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentsSummary(BuildContext context) {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Investments',
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A3C34),
            ),
          ),
          const SizedBox(height: 16),
          user.investments.isEmpty
              ? Center(
                  child: Text(
                    'No Investments Yet',
                    style: GoogleFonts.poppins(
                      color: Colors.grey[600],
                      fontSize: 16,
                    ),
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
                          style: GoogleFonts.poppins(
                            color: const Color(0xFF1A3C34),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: Text(
                          'Amount: \$${investment.amount.toStringAsFixed(2)}',
                          style: GoogleFonts.poppins(
                            color: Colors.grey[600],
                          ),
                        ),
                        trailing: Text(
                          '${(investment.dailyReturnRate * 100).toStringAsFixed(1)}%',
                          style: GoogleFonts.poppins(
                            color: const Color(0xFF26A69A),
                            fontWeight: FontWeight.w600,
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

  Widget _buildDynamicInfoSection(BuildContext context) {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Market Insights',
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A3C34),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Stay tuned for real-time market updates and personalized recommendations.',
            style: GoogleFonts.poppins(
              color: Colors.grey[600],
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              // Navigate to detailed insights
            },
            child: const Text('Learn More'),
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: const Color(0xFF26A69A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 2,
            ),
          ),
        ],
      ),
    );
  }
}