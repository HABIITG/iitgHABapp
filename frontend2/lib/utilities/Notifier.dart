import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationNotifier {
  static ValueNotifier<List<String>> notifier = ValueNotifier([]);
  static SharedPreferences? prefs;

  static void init() async {
    prefs = await SharedPreferences.getInstance();
    notifier.value = prefs?.getStringList("notifications") ?? [];
    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      String? title = message.notification?.title ?? 'No Title';
      String? body = message.notification?.body ?? 'No Body';
      NotificationNotifier.addNewNotification(title, body);
    });
  }

  static void addNewNotification(String title, String body) {
    notifier.value.add('$title: $body');
    prefs?.setStringList('notifications', notifier.value);
  }
}