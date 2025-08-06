import 'package:flutter/material.dart';
import 'package:frontend1/screens/MainNavigationScreen.dart';

class ComingSoonScreen extends StatelessWidget {
  const ComingSoonScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(
      backgroundColor: Colors.white,
      leading: IconButton(
        icon: Icon(Icons.arrow_back),
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (context) => const MainNavigationScreen()));
        },
      ),
    ),
      backgroundColor: Colors.white,
      body: Center(
        child: Text(
          'Coming Soon',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.grey[800],
          ),
        ),
      ),
    );
  }
}
