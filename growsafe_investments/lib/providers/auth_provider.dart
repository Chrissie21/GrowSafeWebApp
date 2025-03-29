import 'package:flutter/material.dart';
import 'package:growsafe_investments/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  String? _accessToken;
  String? _refreshToken;
  String? _username;
  String? _email;
  bool _isLoading = false;
  String? _errorMessage;

  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;
  String? get username => _username;
  String? get email => _email;
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
        _username = username;
        _email = email;
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

  Future<void> login(String username, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.login(username, password);
      if (response.containsKey('access') && response.containsKey('refresh')) {
        _accessToken = response['access'];
        _refreshToken = response['refresh'];
        _username = username;
        await _saveTokens(_accessToken!, _refreshToken!);  // Save tokens to local storage

        final profileResponse = await ApiService.getProfile(_accessToken!);
        _email = profileResponse['email'];
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
        _accessToken = null;
        _refreshToken = null;
        _username = null;
        _email = null;
        await _clearTokens();
        notifyListeners();
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
    if (_accessToken != null) {
      try {
        final profileResponse = await ApiService.getProfile(_accessToken!);
        if (profileResponse.containsKey('username')) {
          _username = profileResponse['username'];
          _email = profileResponse['email'];
          notifyListeners();
        } else {
          _accessToken = null;
          _refreshToken = null;
          _username = null;
          _email = null;
          await _clearTokens();
          notifyListeners();
        }
      } catch (e) {
        _accessToken = null;
        _refreshToken = null;
        _username = null;
        _email = null;
        await _clearTokens();
        notifyListeners();
      }
    }
  }

  // Save access and refresh tokens to SharedPreferences
  Future<void> _saveTokens(String accessToken, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', accessToken);
    await prefs.setString('refresh_token', refreshToken);
  }

  // Load tokens from SharedPreferences
  Future<void> _loadTokens() async {
    final prefs = await SharedPreferences.getInstance();
    _accessToken = prefs.getString('access_token');
    _refreshToken = prefs.getString('refresh_token');
    if (_accessToken != null) {
      await checkAuthStatus();
    }
  }

  // Get the access token from SharedPreferences
  Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  // Clear access and refresh tokens from SharedPreferences
  Future<void> _clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
  }

  // Token refresh logic (use refresh token to get a new access token)
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
        await _saveTokens(_accessToken!, _refreshToken!);  // Save the new access token
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

  // Helper methods for loading, setting loading state, and errors
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
