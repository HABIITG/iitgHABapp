import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';
import 'package:frontend1/apis/mess/user_mess_info.dart';
import 'package:frontend1/apis/protected.dart';
import 'package:frontend1/apis/users/user.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

import '../../screens/login_screen.dart';

Future<void> authenticate() async {
  try {
    final result = await FlutterWebAuth2.authenticate(
        url: AuthEndpoints.getAccess, callbackUrlScheme: "iitgcomplain");
    print(result);

    final accessToken = Uri.parse(result).queryParameters['token'];
    print("access token is");

    debugPrint(accessToken);

    final prefs = await SharedPreferences.getInstance();

    if (accessToken == null) {
      throw ('access token not found');
    }
    prefs.setString('access_token', accessToken);
    await fetchUserDetails();
    await getUserMessInfo();
  } on PlatformException catch (_) {
    rethrow;
  } catch (e) {
    print('Error in getting code');
    rethrow;
  }
}

Future<void> logoutHandler(context) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.clear();
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(
      builder: (context) => const LoginScreen(),
    ),
    (route) => false,
  );
}

Future<void> signInWithApple() async {
  try {
    final credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
    );

    print('User ID: ${credential.userIdentifier}');
    print('Email: ${credential.email}');
    print('Full Name: ${credential.givenName} ${credential.familyName}');
  } catch (e) {
    print('Error during Apple Sign-In: $e');
  }
}

Future<bool> isLoggedIn() async {
  var access = await getAccessToken();

  if (access != 'error') {
    return true;
  } else {
    return false;
  }
}
