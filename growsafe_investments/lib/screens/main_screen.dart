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
  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = []; // Initialize empty to avoid null errors
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeApp();
    });
  }

  Future<void> _initializeApp() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.checkAuthStatus();

    if (!mounted) return;

    if (!authProvider.isAuthenticated || authProvider.user == null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
      return;
    }

    _updatePages(authProvider.user!);
    setState(() {}); // Force rebuild after initialization
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _updatePages(User user) {
    _pages = [
      DashboardPage(user: user),
      InvestmentSelectionPage(
        user: user,
        onInvest: (_) => setState(() {}), // Refresh on investment
      ),
      AccountPage(
        user: user,
        onDeposit: (_) => setState(() {}),
        onWithdraw: (_) => setState(() {}),
      ),
    ];
  }

  Widget _buildAppBar(AuthProvider authProvider) {
    return AppBar(
      title: FadeIn(
        child: Text(
          'GrowSafe Investments',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A3C34),
          ),
        ),
      ),
      backgroundColor: Colors.white,
      elevation: 2,
      actions: [
       FadeIn(
          child: IconButton(
            icon: const Icon(Icons.logout, color: Color(0xFF1A3C34)),
            onPressed: () async {
              await authProvider.logout();
              if (mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()),
                );
              }
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBody() {
    if (_pages.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    return _pages[_selectedIndex];
  }

  Widget _buildNavigationRail() {
    return NavigationRail(
      selectedIndex: _selectedIndex,
      onDestinationSelected: _onItemTapped,
      labelType: NavigationRailLabelType.all,
      backgroundColor: const Color(0xFFF5F7FA),
      minWidth: 80,
      selectedIconTheme: const IconThemeData(color: Color(0xFF26A69A)),
      unselectedIconTheme: const IconThemeData(color: Color(0xFF1A3C34)),
      selectedLabelTextStyle: GoogleFonts.poppins(
        color: const Color(0xFF26A69A),
        fontWeight: FontWeight.w600,
      ),
      unselectedLabelTextStyle: GoogleFonts.poppins(
        color: const Color(0xFF1A3C34),
      ),
      destinations: const [
        NavigationRailDestination(
          icon: Icon(Icons.dashboard),
          label: Text('Dashboard'),
        ),
        NavigationRailDestination(
          icon: Icon(Icons.trending_up),
          label: Text('Invest'),
        ),
        NavigationRailDestination(
          icon: Icon(Icons.account_circle),
          label: Text('Account'),
        ),
      ],
    );
  }

  Widget _buildBottomNavigation() {
    return BottomNavigationBar(
      currentIndex: _selectedIndex,
      onTap: _onItemTapped,
      selectedItemColor: const Color(0xFF26A69A),
      unselectedItemColor: const Color(0xFF1A3C34),
      selectedLabelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w600),
      unselectedLabelStyle: GoogleFonts.poppins(),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Dashboard',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.trending_up),
          label: 'Invest',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_circle),
          label: 'Account',
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (authProvider.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (!authProvider.isAuthenticated || authProvider.user == null) {
          return const LoginPage();
        }

        if (_pages.isEmpty || (_pages[0] as DashboardPage).user != authProvider.user) {
          _updatePages(authProvider.user!);
        }

        return LayoutBuilder(
          builder: (context, constraints) {
            final isWideScreen = constraints.maxWidth > 600;
            return Scaffold(
              body: isWideScreen
                  ? Row(
                      children: [
                        _buildNavigationRail(),
                        const VerticalDivider(thickness: 1, width: 1),
                        Expanded(child: _buildBody()),
                      ],
                    )
                  : _buildBody(),
              bottomNavigationBar: isWideScreen ? null : _buildBottomNavigation(),
            );
          },
        );
      },
    );
  }
}