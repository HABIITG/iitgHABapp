import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'package:frontend1/constants/endpoint.dart';
import '../../models/mess_menu_model.dart';



//cache so that it doesnt do api calls when state persists (only does it when app reopens)
final Map<String, List<MenuModel>> _menuCache = {};

Future<List<MenuModel>> fetchMenu(String messId, String day) async {
  final startTime = DateTime.now();
  final key = '$messId-$day';

  // Return from cache if available
  if (_menuCache.containsKey(key)) {
    print('✅ Returning cached menu for $key');

    final endTime = DateTime.now();
    final responseTime = endTime.difference(startTime).inMilliseconds;
    print("⏱️ fetchMenu Response Time (from cache): $responseTime ms");

    return _menuCache[key]!;
  }

  try {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token') ?? '';

    if (token.isEmpty) {
      throw Exception('⚠️ Access token not found');
    }

    print('📤 Fetching menu for Mess ID: $messId, Day: $day');

    final response = await Dio().post(
      '$baseUrl/mess/menu/$messId',
      options: Options(
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ),
      data: {'day': day},
    );

    if (response.statusCode == 200) {
      final List data = response.data;
      final menu = data.map<MenuModel>((json) => MenuModel.fromJson(json)).toList();
      _menuCache[key] = menu;
      print(response.data);
      print('✅ Menu fetched and cached for $key');

      final endTime = DateTime.now();
      final responseTime = endTime.difference(startTime).inMilliseconds;
      print("⏱️ fetchMenu Response Time (from API): $responseTime ms");

      return menu;
    } else {
      throw Exception('❌ Server responded with status: ${response.statusCode}');
    }
  } on DioError catch (dioError) {
    print('❌ DioError: ${dioError.message}');
    if (dioError.response != null) {
      print('❌ Response Data: ${dioError.response?.data}');
    }
    throw Exception('Failed to fetch menu: ${dioError.message}');
  } catch (e) {
    print('❌ Unexpected error: $e');
    throw Exception('Unexpected error while fetching menu');
  }
}



