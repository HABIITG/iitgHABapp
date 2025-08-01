import 'package:flutter/material.dart';
import 'package:frontend/apis/User/user.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/apis/protected.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../apis/protected.dart';
import 'main_screen.dart';

class EditProfileScreen extends StatefulWidget {
  final String hostel;
  final String room;
  final String contact;
  final Function(String hostel, String room, String contact) onSave;

  EditProfileScreen({
    Key? key,
    required this.hostel,
    required this.room,
    required this.contact,
    required this.onSave,
  }) : super(key: key);

  @override
  _EditProfileScreenState createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  String name = '';
  String email = '';
  String roll = '';
  String branch = '';

  TextEditingController hostelController = TextEditingController();
  TextEditingController roomController = TextEditingController();
  TextEditingController contactController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchUserData();
    hostelController.text = widget.hostel;
    roomController.text = widget.room;
    contactController.text = widget.contact;
  }

  Future<void> fetchUserData() async {
    final userDetails = await fetchUserDetails();
    if (userDetails != null) {
      setState(() {
        name = userDetails['name'] ?? '';
        email = userDetails['email'] ?? '';
        roll = userDetails['roll'] ?? '';
        branch = userDetails['branch'] ?? '';

      });
    } else {
      print("Failed to load user details.");
    }
  }

  Future<void> saveProfile() async {
    final token = await getAccessToken(); // Retrieve token here
    if (token == 'error') {
      _showSnackbar('Error: Authentication required.');
      return;
    }

    try {
      final response = await http.put(
        Uri.parse('https://iitgcomplaintapp.onrender.com/api/users/$email'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // Added token here
        },
        body: json.encode({
          'hostel': hostelController.text,
          'roomNumber': roomController.text,
          'phoneNumber': contactController.text,
        }),
      );
      var resp = response.body;

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');


      if (response.statusCode == 200) {
        // Save updated data to SharedPreferences
        final decodedResp = jsonDecode(resp);
        final userID = decodedResp['_id'];
        final prefs = await SharedPreferences.getInstance();
        prefs.setString('hostel', hostelController.text);
        prefs.setString('room', roomController.text);
        prefs.setString('contact', contactController.text);

        prefs.setString('userID', userID);

        widget.onSave(
          hostelController.text,
          roomController.text,
          contactController.text,
        );

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Profile updated successfully!')),
        );

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => MainScreen()),
        );
      } else {
        _showSnackbar('Failed to update profile. Please try again.');
      }
    } catch (e) {
      print('Error occurred: $e');
      _showSnackbar('An error occurred. Please try again.');
    }
  }

  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: Text("Edit Profile"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              child: Card(
                elevation: 5,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildProfileItem("Name", name),
                      SizedBox(height: 16),
                      _buildProfileItem("Roll Number", roll),
                      SizedBox(height: 16),
                      _buildProfileItem("Email", email),
                      SizedBox(height: 16),
                      _buildProfileItem("Branch", branch),
                      SizedBox(height: 16),
                      _buildEditableProfileItem("Hostel", hostelController),
                      SizedBox(height: 16),
                      _buildEditableProfileItem("Room Number", roomController),
                      SizedBox(height: 16),
                      _buildEditableProfileItem("Contact", contactController),
                      SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: saveProfile,
                        child: Text('Save Changes'),
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 12.0, horizontal: 24.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 16)),
      ],
    );
  }

  Widget _buildEditableProfileItem(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        SizedBox(height: 4),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: 'Enter your $label',
          ),
        ),
      ],
    );
  }
}
