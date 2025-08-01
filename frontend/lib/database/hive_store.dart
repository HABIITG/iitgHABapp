import 'package:hive/hive.dart';


import 'package:frontend/models/user.dart';

class HiveStore {
  static Map<dynamic, dynamic> userData = {};


  static User getUserDetails() {
    return User.fromJson(userData);
  }


  static clearHiveData() {
    userData = {};
  }
}

Future <void> setHiveStore() async {
  final box = await Hive.openBox('iitgcomplain-data');
  HiveStore.userData = box.get('user') ?? {};// ?? means if there is no user than it sets the userdata to empty
}