import 'package:flutter/material.dart';
import 'package:frontend/apis/User/user.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'edit_profile_page.dart';
import 'main_screen.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String name = '';
  String email = '';
  String roll = '';
  String branch = '';
  String hostel = '';
  String room = '';
  String contact = '';

  @override
  void initState() {
    super.initState();
    fetchUserData();
    loadProfileData(); // Load saved profile data from SharedPreferences
  }

  // This method ensures that data is reloaded whenever the screen reappears
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loadProfileData(); // Refresh data when navigating back to this screen
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

  Future<void> loadProfileData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      hostel = prefs.getString('hostel') ?? '';
      room = prefs.getString('room') ?? '';
      contact = prefs.getString('contact') ?? '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: Text("Profile"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity, // Make the card take the full width
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
                      _buildProfileItem("Hostel", hostel),
                      SizedBox(height: 16),
                      _buildProfileItem("Room Number", room),
                      SizedBox(height: 16),
                      _buildProfileItem("Contact", contact),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => EditProfileScreen(
                hostel: hostel,
                room: room,
                contact: contact,
                onSave: (updatedHostel, updatedRoom, updatedContact) async {
                  // Save the updated data locally using SharedPreferences
                  final prefs = await SharedPreferences.getInstance();
                  prefs.setString('hostel', updatedHostel);
                  prefs.setString('room', updatedRoom);
                  prefs.setString('contact', updatedContact);


                  setState(() {
                    hostel = updatedHostel;
                    room = updatedRoom;
                    contact = updatedContact;
                  });

                  Navigator.pop(context);
                },
              ),
            ),
          );
        },
        backgroundColor: Colors.deepPurple,
        child: Icon(Icons.edit),
      ),
    );
  }

  // Helper function to build each label and value pair
  Widget _buildProfileItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        SizedBox(height: 4),
        Text(value.isNotEmpty ? value : 'Not provided', style: TextStyle(fontSize: 16)),
      ],
    );
  }
}
