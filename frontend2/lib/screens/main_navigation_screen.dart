import 'package:flutter/material.dart';
import 'package:frontend2/screens/initial_setup_screen.dart';
import 'package:frontend2/screens/mess_preference.dart';
import 'package:frontend2/screens/profile_screen.dart';
import 'home_screen.dart';
import 'mess_screen.dart';
import '../utilities/notifications.dart';

import '../widgets/common/bottom_nav_bar.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;

  void _handleNavTap(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    // Listen for navigation from notifications
    tabNavigationNotifier.addListener(_onTabNavigationRequested);
    deepNavigationNotifier.addListener(_onDeepNavigationRequested);
  }

  void _onTabNavigationRequested() {
    final targetTab = tabNavigationNotifier.value;
    if (targetTab != null && targetTab != _selectedIndex) {
      setState(() {
        _selectedIndex = targetTab;
      });
      // Clear the navigation request
      tabNavigationNotifier.value = null;
    }
  }

  void _onDeepNavigationRequested() {
    final screenName = deepNavigationNotifier.value;
    if (screenName != null && mounted) {
      // Capture navigator before creating an async gap and wait briefly
      final navigator = Navigator.of(context);
      // Wait for tab navigation to complete
      Future.delayed(const Duration(milliseconds: 100), () {
        if (!mounted) return;

        switch (screenName) {
          case 'mess_change_screen':
            navigator.push(
              MaterialPageRoute(
                builder: (context) => const MessChangePreferenceScreen(),
              ),
            );
            break;
          case 'profile_screen':
            navigator.push(
              MaterialPageRoute(
                builder: (context) => const ProfileScreen(),
              ),
            );
            break;
        }

        // Clear the navigation request
        deepNavigationNotifier.value = null;
      });
    }
  }

  @override
  void dispose() {
    tabNavigationNotifier.removeListener(_onTabNavigationRequested);
    deepNavigationNotifier.removeListener(_onDeepNavigationRequested);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigateToTab: _handleNavTap),
      const MessScreen(),
    ];
    return ValueListenableBuilder(
      valueListenable: ProfilePictureProvider.isSetupDone,
      builder: (context, setupDone, child) => Scaffold(
        body: (setupDone == true)
            ? IndexedStack(
                index: _selectedIndex,
                children: screens,
              )
            : const InitialSetupScreen(),
        bottomNavigationBar: (setupDone == true)
            ? BottomNavBar(
                currentIndex: _selectedIndex,
                onTap: _handleNavTap,
              )
            : const SizedBox(),
      ),
    );
  }
}
