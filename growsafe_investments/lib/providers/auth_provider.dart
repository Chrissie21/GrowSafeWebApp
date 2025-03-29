import 'package:flutter/material.dart';
import 'package:growsafe_investments/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  String? _token;
  String? _username;
  String? _email;
  bool _isLoading = false;
  String? _errorMessage;

  String? get token => _token;
  String? get username => _username;
  String? get email => _email;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _token != null;

  AuthProvider() {
    _loadToken();
  }

  Future<void> signup(String username, String email, String password, String confirmPassword) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.signup(username, email, password, confirmPassword);
      if (response.containsKey('token')) {
        _token = response['token'];
        _username = username;
        _email = email;
        await _saveToken(_token!);
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
      if (response.containsKey('token')) {
        _token = response['token'];
        _username = username;
        await _saveToken(_token!);  // Save token to local storage

        final profileResponse = await ApiService.getProfile(_token!);
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
      final response = await ApiService.logout(_token!);
      if (response['message'] == 'Logout successful') {
        _token = null;
        _username = null;
        _email = null;
        await _clearToken();
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
    if (_token != null) {
      try {
        final profileResponse = await ApiService.getProfile(_token!);
        if (profileResponse.containsKey('username')) {
          _username = profileResponse['username'];
          _email = profileResponse['email'];
          notifyListeners();
        } else {
          _token = null;
          _username = null;
          _email = null;
          await _clearToken();
          notifyListeners();
        }
      } catch (e) {
        _token = null;
        _username = null;
        _email = null;
        await _clearToken();
        notifyListeners();
      }
    }
  }

  // Save token to SharedPreferences
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  // Load token from SharedPreferences
  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    if (_token != null) {
      await checkAuthStatus();
    }
  }

  // Clear token from SharedPreferences
  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
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
