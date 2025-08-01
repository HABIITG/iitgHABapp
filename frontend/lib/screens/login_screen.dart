import 'package:flutter/material.dart';
import 'package:frontend/apis/authentication/login.dart';
import 'package:frontend/screens/profile_screen.dart';
import 'package:frontend/screens/edit_profile_page.dart';
import 'dart:io';
import 'package:frontend/widgets/Login_screen/login_button.dart';
import 'package:frontend/widgets/common/snack_bar.dart';
import 'package:frontend/widgets/common/custom_linear_progress.dart';

class loginScreen extends StatefulWidget {
  const loginScreen({super.key});

  @override
  State<loginScreen> createState() => _loginScreenState();
}

class _loginScreenState extends State<loginScreen> {
  final Cleanimage = const AssetImage('assets/fonts/clean.png');
  final logoiitg = const AssetImage('assets/fonts/IITG_logo.png');
  var _inprogress = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        top: Platform.isAndroid,
        bottom: Platform.isAndroid,
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: Cleanimage,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Center(
              // Center the content
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Image.asset(
                    'assets/fonts/IITG_logo.png',
                    height: 100, // Adjust size as needed
                  ),
                  const SizedBox(height: 20),
                  // Add some space
                  const Text(
                    'IITG MAINTENANCE',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 50,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 150),
                  // Add space between text and button
                  Padding(
                    padding: EdgeInsets.all(30),
                    child: Material(
                      color: Colors.black,
                      // No background color for the container
                      child: InkWell(
                        splashColor: Colors.white,
                        onTap: () async {
                          try {
                            setState(() {
                              _inprogress = true;
                            });
                            await authenticate();
                            setState(() {
                              _inprogress = false;
                            });
                            if (!mounted) return;
                            Navigator.pushReplacement(
                                context,
                              MaterialPageRoute(
                                builder: (context) => EditProfileScreen(
                                  hostel: '',
                                  room: '',
                                  contact: '',
                                  onSave: (hostel, room, contact) {
                                    // Handle save logic here if needed
                                  },
                                ),
                              ),
                            );
                            showSnackBar('Successfully Logged In', context);
                          } catch (e) {
                            setState(() {
                              _inprogress = false;
                            });
                            showSnackBar('Something Went Wrong', context);
                          }
                        },
                        child: Padding(
                            padding: EdgeInsets.all(15),
                            child: const LoginButton()),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Visibility(
              visible: _inprogress,
              child: const CustomLinearProgress(
                text: 'Loading your details,please wait....',
              ),
            )
          ],
        ),
      ),
    );
  }
}
