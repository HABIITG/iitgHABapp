import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hive/hive.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:http/http.dart' as http;
import 'package:frontend/screens/profile_screen.dart';



import '../../constants/endpoints.dart';

import 'package:frontend/database/hive_store.dart';
import 'package:frontend/models/user.dart';
import '../../screens/login_screen.dart';
import 'package:frontend/apis/protected.dart';
import 'package:frontend/apis/User/user.dart';

Future<void> authenticate() async {
  try {

      final result = await FlutterWebAuth.authenticate(
          url: AuthEndpoints.getAccess, callbackUrlScheme: "iitgcomplain");
      print(result);

    final accessToken = Uri.parse(result).queryParameters['token'];
    print(accessToken);

      final prefs = await SharedPreferences.getInstance();

      if (accessToken == null) {
        throw ('access token not found');
      }
      prefs.setString('access_token', accessToken);
    await setHiveStore();
    await fetchUserDetails();


  } on PlatformException catch (_) {
    rethrow;
  } catch (e) {
    print('Error in getting code');
    rethrow;
  }
}

Future<void> logoutHandler(context) async {
  final prefs = await SharedPreferences.getInstance();
  final box = await Hive.openBox('coursehub-data');

  prefs.clear();
  box.clear();
  HiveStore.clearHiveData();

  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(
      builder: (context) => const loginScreen(),
    ),
        (route) => false,
  );
}

Future<bool> isLoggedIn() async {
  var access = await getAccessToken();

  if (access != 'error') {
    await setHiveStore();
    return true;
  } else {
    return false;
  }
}
