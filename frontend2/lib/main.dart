import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:frontend1/apis/authentication/login.dart';
import 'package:frontend1/apis/mess/user_mess_info.dart';
import 'package:frontend1/providers/feedback_provider.dart';
import 'package:frontend1/screens/Home_screen.dart';
import 'package:frontend1/screens/MainNavigationScreen.dart';
import 'package:frontend1/screens/login_screen.dart';

import 'package:frontend1/screens/mess_feedback/mess_feedback_page.dart';
import 'package:frontend1/screens/mess_screen.dart';
import 'package:frontend1/utilities/startupitem.dart';
import 'package:provider/provider.dart';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:frontend1/screens/profile_screen.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:frontend1/utilities/notification.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();
  await FirebaseMessaging.instance.requestPermission();

  // Your existing logic
  final bool asLoggedIn = await isLoggedIn();
  await getUserMessInfo();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => MessInfoProvider()),
        ChangeNotifierProvider(create: (_) => FeedbackProvider()),
      ],
      child: MyApp(isLoggedIn: asLoggedIn),
    ),
  );
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends StatefulWidget {
  final bool isLoggedIn;

  const MyApp({super.key, required this.isLoggedIn});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late Connectivity _connectivity;
  late Stream<ConnectivityResult> _connectivityStream;
  bool _isDialogShowing = false;

  @override
  void initState() {
    super.initState();

    // Firebase Messaging setup
    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      print('📩 Foreground Notification');
      String? title = message.notification?.title ?? 'No Title';
      String? body = message.notification?.body ?? 'No Body';

      SharedPreferences prefs = await SharedPreferences.getInstance();
      List<String> storedNotifications =
          prefs.getStringList('notifications') ?? [];

      storedNotifications.add('$title: $body');
      await prefs.setStringList('notifications', storedNotifications);
    });

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

    print('Access token: 😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊');

    FirebaseMessaging.instance.getToken().then((token) {
      print('FCM Token: $token');
    }).catchError((error) {
      print('Error getting FCM token: $error');
    });

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // This ensures it runs after the first frame
      await context.read<MessInfoProvider>().fetchMessID();
    });

    _connectivity = Connectivity();

    // Use `.map()` to transform the stream into a stream of ConnectivityResult
    _connectivityStream = _connectivity.onConnectivityChanged.map(
        (List<ConnectivityResult> results) =>
            results.isNotEmpty ? results[0] : ConnectivityResult.none);

    _connectivityStream.listen((ConnectivityResult result) {
      _handleConnectivityChange(result);
    });
  }

  void _handleConnectivityChange(ConnectivityResult result) {
    if (result == ConnectivityResult.none) {
      _showNoInternetDialog();
    } else {
      if (_isDialogShowing) {
        Navigator.of(navigatorKey.currentContext!, rootNavigator: true).pop();
        _isDialogShowing = false;
      }
    }
  }

  void _showNoInternetDialog() {
    if (!_isDialogShowing) {
      _isDialogShowing = true;
      showDialog(
        context: navigatorKey.currentContext!,
        barrierDismissible: false, // Prevent dismissal by tapping outside
        builder: (BuildContext context) {
          return const AlertDialog(
            title: Text("No Internet Connection"),
            content: Text("Please check your internet connection."),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.white,
        systemNavigationBarColor: Colors.black,
      ),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      navigatorKey: navigatorKey,

      home: widget.isLoggedIn ? MainNavigationScreen() : LoginScreen(),

      //home:  ProfileScreen(),
      builder: EasyLoading.init(),
      routes: {
        '/home': (context) => const MainNavigationScreen(),
        '/mess': (context) => const MessScreen(),
        '/complaints': (context) => const HomeScreen(),
      },
    );
  }

  @override
  void dispose() {
    // Dispose of the connectivity stream if necessary
    super.dispose();
  }
}
