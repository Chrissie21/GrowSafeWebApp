import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:growsafe_investments/models/user.dart';
import 'package:growsafe_investments/pages/account_page.dart';
import 'package:growsafe_investments/pages/dashboard_page.dart';
import 'package:growsafe_investments/pages/investment_selection_page.dart';
import 'package:growsafe_investments/pages/login_page.dart';
import 'package:growsafe_investments/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  late User _user;
  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _user = User(
      id: 'lp499586',
      userId: '2557459866779',
      total: 1.00,
      totalDeposit: 0.00,
      totalWithdraw: 10.00,
    );
    _user.calculateDailyEarnings();
    _updatePages();

    // Check authentication status on init
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    authProvider.checkAuthStatus().then((_) {
      if (!authProvider.isAuthenticated) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      }
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _handleInvestment(Investment investment) {
    setState(() {
      _user.investments.add(investment);
      _user.calculateDailyEarnings();
      _updatePages();
    });
  }

  void _handleDeposit(double amount) {
    setState(() {
      _user.deposit(amount);
      _updatePages();
    });
  }

  bool _handleWithdraw(double amount) {
    bool success = false;
    setState(() {
      success = _user.withdraw(amount);
      _updatePages();
    });
    return success;
  }

  void _updatePages() {
    _pages = [
      DashboardPage(user: _user),
      InvestmentSelectionPage(
        user: _user,
        onInvest: _handleInvestment,
      ),
      AccountPage(
        user: _user,
        onDeposit: _handleDeposit,
        onWithdraw: _handleWithdraw,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () async {
              await authProvider.logout();
              if (!authProvider.isAuthenticated) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()),
                );
              }
            },
          ),
        ],
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Colors.teal, Colors.cyan],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 8,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          items: <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: ElasticIn(
                child: const Icon(Icons.dashboard),
              ),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: ElasticIn(
                child: const Icon(Icons.trending_up),
              ),
              label: 'Investments',
            ),
            BottomNavigationBarItem(
              icon: ElasticIn(
                child: const Icon(Icons.person),
              ),
              label: 'Account',
            ),
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white70,
          selectedLabelStyle: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
          ),
          unselectedLabelStyle: GoogleFonts.poppins(),
          onTap: _onItemTapped,
        ),
      ),
    );
  }
}