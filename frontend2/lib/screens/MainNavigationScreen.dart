import 'package:flutter/material.dart';
import 'package:frontend1/screens/mess_screen/new_mess_screen.dart';
import 'package:frontend1/utilities/ComingSoon.dart';
import 'home_screen.dart';
import 'mess_screen.dart';
//import 'complaints_screen.dart';  //for future

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
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigateToTab: _handleNavTap),
      NewMessScreen(),
      ComingSoonScreen(),
    ];
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _selectedIndex,
        onTap: _handleNavTap,
      ),
    );
  }
}
