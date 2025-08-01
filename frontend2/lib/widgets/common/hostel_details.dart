import 'package:http/http.dart' as http;
import 'package:frontend1/apis/protected.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'dart:convert';

// Function to fetch hostel data
Future<Map<String, dynamic>> fetchHostelData(String hostelName, String rollNumber ) async {
  final jwtToken = await getAccessToken(); // Retrieve the JWT token
  final String url =
      '$baseUrl/hostel/hostel/$hostelName/user/$rollNumber';

  try {
    final response = await http.get(
      Uri.parse(url),
      headers: {
        'Authorization': 'Bearer $jwtToken', // Include the JWT token in the Authorization header
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>; // Return parsed JSON data
    } else {
      throw Exception(
          'Failed to fetch data. Status code: ${response.statusCode}\nResponse: ${response.body}');
    }
  } catch (e) {
    throw Exception('Error occurred: $e');
  }
}



