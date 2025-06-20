import 'package:flutter/material.dart';
import 'package:frontend1/apis/authentication/login.dart';
import 'package:frontend1/apis/users/user.dart';
import 'package:frontend1/widgets/common/hostel_details.dart';
import 'package:frontend1/widgets/common/custom_linear_progress.dart';
import 'package:frontend1/widgets/common/hostel_name.dart';
import 'package:frontend1/widgets/common/snack_bar.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String name = '';
  String email = '';
  String roll = '';
  String hostel = '';
  String currMess = '';
  bool _isloading = true;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  void _initializeData() async {
    setState(() {
      _isloading = true;
    });
    await getAllocatedHostel();
    setState(() {
      _isloading = false;
    });
  }

  Future<void> getAllocatedHostel() async {
    final prefs = await SharedPreferences.getInstance();
    final hostel1 = prefs.getString('hostelID');//change this from hostel in user.dart
    final email1 = prefs.getString('email');
    final name1 = prefs.getString('name');
    final roll1 = prefs.getString('rollNo');
    setState(() {
      hostel = hostel1 ?? 'Not provided';
      name = name1 ?? 'Name not provided';
      roll = roll1 ?? 'Not provided';
      email = email1 ?? 'Not provided';
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(237, 237, 237, 1),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Profile",
          style: TextStyle(
            fontFamily: 'OpenSans_bold',
            fontWeight: FontWeight.w400,
            fontSize: 24,
          ),
        ),
      ),
      body: _isloading
          ? const Center(
            child: CustomLinearProgress(
          text: 'Loading your details, please wait...',
        ),
      )
          : SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildField("Name", name),
              const SizedBox(height: 16),
              _buildField("Roll Number", roll),
              const SizedBox(height: 16),
              _buildField("Email", email),
              const SizedBox(height: 16),
              _buildField("Hostel", calculateHostel(hostel)),
              //const SizedBox(height: 16),
              //_buildField("Allocated Mess", calculateHostel(currMess)),
              const SizedBox(height: 32),
              Center(
                child: ElevatedButton(
                  onPressed: () => _showSignOutDialog(context),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    backgroundColor: const Color.fromRGBO(57, 77, 198, 1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    "Sign Out",
                    style: TextStyle(
                      fontSize: 16,
                      fontFamily: 'OpenSans_bold',
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "$label:",
          style: const TextStyle(
            fontFamily: 'OpenSans_regular',
            fontSize: 16,
            color: Color.fromRGBO(0, 0, 0, 1),
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontFamily: 'OpenSans_bold',
            fontSize: 24,
            fontWeight: FontWeight.w400,
            color: Color.fromRGBO(57, 77, 198, 1),
          ),
        ),
      ],
    );
  }

  void _showSignOutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Sign Out"),
          content: const Text("Are you sure you want to sign out?"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: const Text("No"),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                logoutHandler(context); // Call the logout handler
              },
              child: const Text("Yes"),
            ),
          ],
        );
      },
    );
  }
}
