import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:8000/api/auth';

  static Future<Map<String, dynamic>> signup(String username, String email, String password, String confirmPassword) async {
    final url = Uri.parse('$baseUrl/signup/');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'confirm_password': confirmPassword,
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> login(String username, String password) async {
    final url = Uri.parse('$baseUrl/login/');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> logout(String token) async {
    final url = Uri.parse('$baseUrl/logout/');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',  // Fixed to Bearer
      },
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getProfile(String token) async {
    final url = Uri.parse('$baseUrl/profile/');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    final url = Uri.parse('$baseUrl/token/refresh/');  // Fixed URL
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh': refreshToken}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> deposit(String token, double amount) async {
    final url = Uri.parse('$baseUrl/deposit/');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'amount': amount}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> withdraw(String token, double amount) async {
    final url = Uri.parse('$baseUrl/withdraw/');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'amount': amount}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> invest(String token, String name, double amount, double dailyReturnRate) async {
    final url = Uri.parse('$baseUrl/invest/');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'name': name,
        'amount': amount,
        'daily_return_rate': dailyReturnRate,
      }),
    );
    return jsonDecode(response.body);
  }
}