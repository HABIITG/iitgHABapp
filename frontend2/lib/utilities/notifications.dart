import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'package:frontend1/apis/protected.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    FirebaseMessaging.instance.onTokenRefresh
    .listen((fcmToken) async {
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
      if (res.statusCode == 200) {
        print('FCM token reregistered: $token');
      } else {
        print('Failed to reregister token');
      }
    })
    .onError((err) {
      print('Failed to reregister token');
    });
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

    // final notification_connection_token = res.data as Map<String, dynamic>;
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
      print('Failed to register token');
    }
    //   },
    //   body: jsonEncode({'fcmToken': token}),
    // );
  } catch (e) {
    print('4');
    print('Error registering FCM token: $e');
  }
}

Future<void> listenNotifications() async {
  await FirebaseMessaging.instance.requestPermission();

  // App opened via notification (terminated)
  FirebaseMessaging.instance.getInitialMessage().then((message) {
    if (message != null) {
      print('🔁 App opened from terminated via notification');
    }
  });

  // App opened via notification (background)
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    print('🔁 App opened from background via notification');
  });

  FirebaseMessaging.instance.getToken().then((token) {
    print('FCM Token: $token');
  }).catchError((error) {
    print('Error getting FCM token: $error');
  });
}

/*
  
*/