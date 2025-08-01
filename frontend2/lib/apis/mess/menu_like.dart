// lib/apis/mess/menu_like.dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../constants/endpoint.dart';

class MenuLikeAPI {
  static Future<bool> toggleLike(String menuItemId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');

      final dio = Dio();
      final response = await dio.post(
        '$baseUrl/mess/menu/item/like/$menuItemId', // Match your backend route
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error toggling like: $e');
      return false;
    }
  }
}
