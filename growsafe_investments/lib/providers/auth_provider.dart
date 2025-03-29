import 'package:flutter/material.dart';
import 'package:growsafe_investments/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:growsafe_investments/models/user.dart';

class AuthProvider with ChangeNotifier {
  String? _accessToken;
  String? _refreshToken;
  User? _user;
  bool _isLoading = false;
  String? _errorMessage;

  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _accessToken != null && _user != null;

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
          id: response['id']?.toString() ?? username,
          userId: email,
          total: 0.0,
          totalDeposit: 0.0,
          totalWithdraw: 0.0,
          investments: [],
          dailyEarnings: 0.0,
        );
        await _saveTokens(_accessToken!, _refreshToken!);
        await _fetchUserProfile(); // Fetch full profile after signup
        notifyListeners();
      } else {
        _setError(response['error'] ?? 'Signup failed');
      }
    } catch (e) {
      _setError('Signup failed: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> login(String username, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.login(username, password);
      if (response.containsKey('access') && response.containsKey('refresh')) {
        _accessToken = response['access'];
        _refreshToken = response['refresh'];
        await _saveTokens(_accessToken!, _refreshToken!);
        await _fetchUserProfile(); // Fetch profile without navigation
        notifyListeners();
      } else {
        _setError(response['error'] ?? 'Login failed');
      }
    } catch (e) {
      _setError('Login failed: $e');
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
      _setError('Logout failed: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> checkAuthStatus() async {
    _setLoading(true);
    _clearError();

    _accessToken = await getAccessToken();
    if (_accessToken != null) {
      try {
        await _fetchUserProfile();
        notifyListeners();
      } catch (e) {
        _clearAuthData();
      }
    }
    _setLoading(false);
  }

  Future<void> _fetchUserProfile() async {
    try {
      final profileResponse = await ApiService.getProfile(_accessToken!);
      _user = User(
        id: profileResponse['id']?.toString() ?? profileResponse['username'] ?? '',
        userId: profileResponse['email'] ?? '',
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
    } catch (e) {
      throw Exception('Failed to fetch profile: $e');
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
        await _fetchUserProfile(); // Refresh user data too
        notifyListeners();
      } else {
        _setError('Failed to refresh token');
      }
    } catch (e) {
      _setError('Token refresh failed: $e');
      _clearAuthData();
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