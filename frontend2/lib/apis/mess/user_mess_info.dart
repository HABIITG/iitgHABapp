import 'package:flutter/material.dart';
import 'package:frontend1/apis/protected.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import 'package:dio/dio.dart';




Future<void> getUserMessInfo() async {
  try {
    print('API calling');
    final dio = Dio();
    final token = await getAccessToken();

    final response = await dio.post(
      messInfo.getUserMessInfo,
      options: Options(
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ),
    );

    if (response.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();

      final Map<String, dynamic> userData = response.data as Map<String, dynamic>;
      print('user mess info is $userData');
      final String messID = userData['_id'] ?? "Not found";
      final String messName = userData['name'] ?? "Not found";
      final String hostelID = userData['hostelId'] ?? "Not found";
      //Leaving complaints for now,
      final int rating = userData['rating'] ?? "Not found";
      final int ranking = userData['ranking']?? "Not found";

      prefs.setString('messID', messID);
      prefs.setString('messName', messName);
      prefs.setString('hostelID', hostelID);
      prefs.setInt('rating', rating);
      prefs.setInt('ranking', ranking);
    }
  } catch (e) {
    print('API Error in userMessInfo: $e');
  }
}
