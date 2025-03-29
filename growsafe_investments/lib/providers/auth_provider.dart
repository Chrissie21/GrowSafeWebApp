import 'package:flutter/material.dart';
import 'package:growsafe_investments/pages/dashboard_page.dart';
import 'package:growsafe_investments/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:growsafe_investments/models/user.dart';

class AuthProvider with ChangeNotifier {
  String? _accessToken;
  String? _refreshToken;
  User? _user; // Replace individual fields with a User object
  bool _isLoading = false;
  String? _errorMessage;

  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _accessToken != null;

  AuthProvider() {
    _loadTokens();
  }

  Future<void> signup(String username, String email, String password, String confirmPassword) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.signup(username, email, password, confirmPassword);
      if (response.containsKey('access') && response.containsKey('refresh')) {
        _accessToken = response['access'];
        _refreshToken = response['refresh'];
        _user = User(
          id: response['id'] ?? username, // Adjust based on your API response
          userId: email,
          total: 0.0,
          totalDeposit: 0.0,
          totalWithdraw: 0.0,
          investments: [],
          dailyEarnings: 0.0,
        );
        await _saveTokens(_accessToken!, _refreshToken!);
        notifyListeners();
      } else {
        _setError(response['error'] ?? 'Signup failed');
      }
    } catch (e) {
      _setError('An error occurred: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> login(String username, String password, BuildContext context) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.login(username, password);
      if (response.containsKey('access') && response.containsKey('refresh')) {
        _accessToken = response['access'];
        _refreshToken = response['refresh'];
        await _saveTokens(_accessToken!, _refreshToken!);

        final profileResponse = await ApiService.getProfile(_accessToken!);
        _user = User(
          id: profileResponse['id'] ?? username, // Adjust based on your API
          userId: profileResponse['email'] ?? username,
          total: profileResponse['total']?.toDouble() ?? 0.0,
          totalDeposit: profileResponse['total_deposit']?.toDouble() ?? 0.0,
          totalWithdraw: profileResponse['total_withdraw']?.toDouble() ?? 0.0,
          investments: (profileResponse['investments'] as List? ?? [])
              .map((inv) => Investment(
                    name: inv['name'] ?? 'Unknown',
                    amount: inv['amount']?.toDouble() ?? 0.0,
                    dailyReturnRate: inv['daily_return_rate']?.toDouble() ?? 0.0,
                  ))
              .toList(),
          dailyEarnings: profileResponse['daily_earnings']?.toDouble() ?? 0.0,
        );
        _user!.calculateDailyEarnings(); // Calculate earnings after loading investments

        // Navigate to DashboardPage with the User object
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => DashboardPage(user: _user!),
          ),
        );
        notifyListeners();
      } else {
        _setError(response['error'] ?? 'Login failed');
      }
    } catch (e) {
      _setError('An error occurred: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.logout(_accessToken!);
      if (response['message'] == 'Logout successful') {
        _clearAuthData();
      } else {
        _setError('Logout failed');
      }
    } catch (e) {
      _setError('An error occurred: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> checkAuthStatus() async {
    _accessToken = await getAccessToken();
    if (_accessToken != null) {
      try {
        final profileResponse = await ApiService.getProfile(_accessToken!);
        if (profileResponse.containsKey('email')) {
          _user = User(
            id: profileResponse['id'] ?? profileResponse['username'],
            userId: profileResponse['email'],
            total: profileResponse['total']?.toDouble() ?? 0.0,
            totalDeposit: profileResponse['total_deposit']?.toDouble() ?? 0.0,
            totalWithdraw: profileResponse['total_withdraw']?.toDouble() ?? 0.0,
            investments: (profileResponse['investments'] as List? ?? [])
                .map((inv) => Investment(
                      name: inv['name'] ?? 'Unknown',
                      amount: inv['amount']?.toDouble() ?? 0.0,
                      dailyReturnRate: inv['daily_return_rate']?.toDouble() ?? 0.0,
                    ))
                .toList(),
            dailyEarnings: profileResponse['daily_earnings']?.toDouble() ?? 0.0,
          );
          _user!.calculateDailyEarnings();
          notifyListeners();
        } else {
          _clearAuthData();
        }
      } catch (e) {
        _clearAuthData();
      }
    }
  }

  void _clearAuthData() {
    _accessToken = null;
    _refreshToken = null;
    _user = null;
    _clearTokens();
    notifyListeners();
  }

  Future<void> _saveTokens(String accessToken, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', accessToken);
    await prefs.setString('refresh_token', refreshToken);
  }

  Future<void> _loadTokens() async {
    final prefs = await SharedPreferences.getInstance();
    _accessToken = prefs.getString('access_token');
    _refreshToken = prefs.getString('refresh_token');
    if (_accessToken != null) {
      await checkAuthStatus();
    }
  }

  Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  Future<void> _clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
  }

  Future<void> refreshAccessToken() async {
    _setLoading(true);
    _clearError();

    try {
      if (_refreshToken == null) {
        _setError('No refresh token available');
        return;
      }
      final response = await ApiService.refreshToken(_refreshToken!);
      if (response.containsKey('access')) {
        _accessToken = response['access'];
        await _saveTokens(_accessToken!, _refreshToken!);
        notifyListeners();
      } else {
        _setError('Failed to refresh token');
      }
    } catch (e) {
      _setError('An error occurred: $e');
    } finally {
      _setLoading(false);
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String? message) {
    _errorMessage = message;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}