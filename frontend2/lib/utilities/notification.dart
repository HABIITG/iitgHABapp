import 'package:frontend1/apis/protected.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'package:dio/dio.dart';

Future<void> registerFcmToken() async {
  try {
    final header = await getAccessToken();
    print('Access token: 😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊');
    print('1');
    String? token = await FirebaseMessaging.instance.getToken();
    if (token == null) {
      print('No FCM token received');
      return;
    }
    final dio = Dio();
    print('2');
    print('Header Token: $header');
    print('Uri: ${Uri.parse(NotificationEndpoints.registerToken)}');
    final res = await dio.post(
      NotificationEndpoints.registerToken,
      options: Options(
        headers: {
          'Authorization': 'Bearer $header',
          'Content-Type': 'application/json',
        },
      ),
      data: jsonEncode({'fcmToken': token}),
    );

    final notification_connection_token = res.data as Map<String, dynamic>;
    // dio.post(
    //   NotificationEndpoints.registerToken,
    //   options: Options(
    //     headers: {
    //       'Authorization': 'Bearer $header',
    //       'Content-Type': 'application/json',
    //     },
    //   ),
    //   data: jsonEncode({'fcmToken': token}),
    // );

    print('3');
    if (res.statusCode == 200) {
      print('FCM token registered: $token');
    } else {
      print('Failed to register token: ${token}');
    }
    //   },
    //   body: jsonEncode({'fcmToken': token}),
    // );
  } catch (e) {
    print('4');
    print('Error registering FCM token: $e');
  }
}
