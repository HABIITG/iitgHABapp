import 'package:frontend/apis/authentication/login.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend/apis/User/user.dart';
import 'package:frontend/database/hive_store.dart';




Future<bool> startupItems() async {
  try {
    await Future.wait([
      Hive.initFlutter(),
    ]);

    //there we can add a fetchuserdetails fxn
  } catch (e) {
    // logout if error in user only

    final prefs = await SharedPreferences.getInstance();
    final box = await Hive.openBox('iitgcomplain-data');
    prefs.clear();
    box.clear();
    HiveStore.clearHiveData();
    return false;
  }


  final prefs = await SharedPreferences.getInstance();
  final loggedIn = await isLoggedIn();

  return loggedIn;
}