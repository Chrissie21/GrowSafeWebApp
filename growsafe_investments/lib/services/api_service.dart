import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:8000/api/auth';

  // Signup
  static Future<Map<String, dynamic>> signup(String username, String email, String password, String confirmPassword) async {
    final url = Uri.parse('$baseUrl/signup/');
    print("Signup URL: $url"); // Added for debugging
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
    print("Signup Status: ${response.statusCode}");
    print("Signup Response: ${response.body}");
    return jsonDecode(response.body);
  }

  // Login
  static Future<Map<String, dynamic>> login(String username, String password) async {
  final url = Uri.parse('$baseUrl/login/');
  print("Login URL: $url");
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'username': username,
      'password': password,
    }),
  );
  print("Login Status: ${response.statusCode}");
  print("Login Response: ${response.body}");
  if (response.statusCode == 200) {
    return jsonDecode(response.body); // Should contain 'token'
  } else {
    return {'error': 'Login failed', 'status': response.statusCode, 'body': response.body};
  }
}

  // Logout
  static Future<Map<String, dynamic>> logout(String token) async {
    final url = Uri.parse('$baseUrl/logout/');
    print("Logout URL: $url");
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token $token',
      },
    );
    print("Logout Status: ${response.statusCode}");
    print("Logout Response: ${response.body}");
    return jsonDecode(response.body);
  }

  // Get Profile
  static Future<Map<String, dynamic>> getProfile(String token) async {
    final url = Uri.parse('$baseUrl/profile/');
    print("Profile URL: $url");
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token $token',
      },
    );
    print("Profile Status: ${response.statusCode}");
    print("Profile Response: ${response.body}");
    return jsonDecode(response.body);
  }
}