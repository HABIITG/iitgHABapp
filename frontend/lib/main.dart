import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:frontend/screens/login_screen.dart';
import 'package:frontend/screens/main_navigation.dart'; // Import the MainScreen
import 'package:frontend/utilities/startup/startup_items.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final bool isLoggedIn = await startupItems();
  runApp(MyApp(isLoggedIn: isLoggedIn));
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends StatelessWidget {
  final bool isLoggedIn;

  const MyApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.black,
        systemNavigationBarColor: Colors.black,
      ),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      navigatorKey: navigatorKey,
      home: isLoggedIn ? MainScreen() : loginScreen(),
      builder: EasyLoading.init(),
    );
  }
}
