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
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    authProvider.checkAuthStatus().then((_) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          if (!authProvider.isAuthenticated || authProvider.user == null) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const LoginPage()),
            );
          } else {
            _updatePages(authProvider.user!);
          }
        });
      }
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _updatePages(User user) {
    _pages = [
      DashboardPage(user: user),
      InvestmentSelectionPage(user: user, onInvest: (investment) {}),
      AccountPage(user: user, onDeposit: (amount){}, onWithdraw: (amount) {}),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    if (_isLoading || authProvider.user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    _updatePages(authProvider.user!);

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth > 800;
        print("Screen Width: ${constraints.maxWidth}, isDesktop: $isDesktop");  // Debug print

        return Scaffold(
          appBar: AppBar(
            title: Text(
              'GrowSafe Investments',
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1A3C34),
              ),
            ),
            backgroundColor: Colors.white,
            elevation: 2,
            actions: [
              IconButton(
                icon: const Icon(Icons.logout, color: Color(0xFF1A3C34)),
                onPressed: () async {
                  final authProvider = Provider.of<AuthProvider>(context, listen: false);
                  await authProvider.logout();
                  if (mounted) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const LoginPage()),
                    );
                  }
                },
              ),
            ],
          ),
          body: Row(
            children: [
              if (isDesktop)
                NavigationRail(
                  selectedIndex: _selectedIndex,
                  onDestinationSelected: _onItemTapped,
                  labelType: NavigationRailLabelType.all,
                  backgroundColor: const Color(0xFFF5F7FA),
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
                      label: Text('Investments'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.account_circle),
                      label: Text('Account'),
                    ),
                  ],
                ),
              Expanded(child: _pages[_selectedIndex]),
            ],
          ),
          bottomNavigationBar: isDesktop
              ? null
              : BottomNavigationBar(
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
                      label: 'Investments',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.account_circle),
                      label: 'Account',
                    ),
                  ],
                ),
        );
      },
    );
  }

  // _buildAppBar, _buildBottomNavigationBar, _buildSideNavigationBar remain unchanged from previous version
  // Including them here for completeness:

  Widget _buildAppBar(AuthProvider authProvider) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      title: Text(
        'GrowSafe Investments',
        style: GoogleFonts.poppins(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: const Color(0xFF1A3C34),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.logout, color: Color(0xFF1A3C34)),
          tooltip: 'Logout',
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
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF26A69A), Color(0xFF80CBC4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: BottomNavigationBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: ElasticIn(child: const Icon(Icons.dashboard)),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: ElasticIn(child: const Icon(Icons.trending_up)),
            label: 'Investments',
          ),
          BottomNavigationBarItem(
            icon: ElasticIn(child: const Icon(Icons.person)),
            label: 'Account',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white70,
        selectedLabelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.poppins(),
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _buildSideNavigationBar() {
    return Container(
      width: 200,
      color: const Color(0xFF1A3C34),
      child: Column(
        children: [
          const SizedBox(height: 20),
          ListTile(
            leading: const Icon(Icons.dashboard, color: Colors.white),
            title: Text('Dashboard', style: GoogleFonts.poppins(color: Colors.white)),
            selected: _selectedIndex == 0,
            onTap: () => _onItemTapped(0),
          ),
          ListTile(
            leading: const Icon(Icons.trending_up, color: Colors.white),
            title: Text('Investments', style: GoogleFonts.poppins(color: Colors.white)),
            selected: _selectedIndex == 1,
            onTap: () => _onItemTapped(1),
          ),
          ListTile(
            leading: const Icon(Icons.person, color: Colors.white),
            title: Text('Account', style: GoogleFonts.poppins(color: Colors.white)),
            selected: _selectedIndex == 2,
            onTap: () => _onItemTapped(2),
          ),
        ],
      ),
    );
  }
}