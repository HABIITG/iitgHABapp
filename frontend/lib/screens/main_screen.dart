import 'package:flutter/material.dart';
import 'package:frontend/screens/home_screen.dart'; // Import your HomeScreen
import 'package:frontend/screens/my_complaints_screen.dart'; // Import your MyComplaintsScreen
import 'package:frontend/screens/profile_screen.dart'; // Import your ProfileScreen

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0; // Track the currently selected tab

  // List of pages for each tab
  final List<Widget> _pages = [
    HomeScreen(), // Your Home screen
     // Your My Complaints screen
    ProfileScreen(), // Your Profile screen
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index; // Update the selected index
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex], // Show the selected page
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex, // Highlight the selected tab
        onTap: _onItemTapped, // Handle tab selection
        selectedItemColor: Colors.deepPurple, // Color for the selected item
        unselectedItemColor: Colors.grey, // Color for unselected items
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
