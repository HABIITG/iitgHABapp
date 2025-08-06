import 'dart:convert';

import 'package:frontend1/apis/protected.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

Future<Map<String, String>?> fetchUserDetails() async {
  final header = await getAccessToken();

  print("token is " + header);
  if (header == 'error') {
    throw ('token not found');
  }
  try {
    print(
        "Fetching user details... ${UserEndpoints.currentUser}, 😂😂😂😂😂😂😂😂😂😂😂😂😂😂");
    final resp = await http.get(
      Uri.parse(UserEndpoints.currentUser),
      headers: {
        "Authorization": "Bearer $header", //make sure to include Bearer
        "Content-Type": "application/json",
      },
    );
    print('Response headers: ${resp.headers}');

    if (resp.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      final Map<String, dynamic> userData = json.decode(resp.body);

      // Extract user details
      final String name = userData['name'] ?? "User";
      final String userId = userData['_id'] ?? "";
      final String degree = userData['degree'] ?? "Not Provided";
      final String mail = userData['email'];
      prefs.setString('email', mail);

      final String roll = userData['rollNumber'] ?? "Not provided";
      final String CurrSubscribedMess =
          userData['curr_subscribed_mess'] ?? "Not provided";
      final String appliedMess =
          userData['applied_hostel_string'] ?? "Not provided";
      final hostel = userData['hostel'] ?? "Not provided";

      final bool gotHostel = userData['got_mess_changed'];
      final bool buttonPressed = userData['mess_change_button_pressed'];
      prefs.setBool('gotMess', gotHostel);
      prefs.setString('rollNumber', roll);
      prefs.setBool('buttonpressed', buttonPressed);
      prefs.setString('appliedMess', appliedMess);
      prefs.setString('rollNo', roll);
      prefs.setString('hostel', hostel);
      prefs.setString('currMess', CurrSubscribedMess);
      prefs.setString('name', name);
      prefs.setString('userId', userId);

      print("Name: $name");
      print("Degree: $degree");
      print("Email: $mail");
      print("Roll: $roll");
      print("Curr Mess: $CurrSubscribedMess");
      print("your mess is $gotHostel");
      print('you pressed: $buttonPressed');

      // Return the data as a map
      return {
        'name': name,
        'email': mail,
        'roll': roll,
      };
    } else if (resp.statusCode == 401) {
      print("Unauthorized access: Invalid token or session expired.");
      throw Exception('Unauthorized: Please log in again.');
    } else {
      print("Error occurred: ${resp.statusCode} - ${resp.reasonPhrase}");
      throw Exception('Failed to fetch user details.');
    }
  } catch (e) {
    print("error is: $e");
    rethrow;
  }
}
