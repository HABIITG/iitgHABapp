import 'package:flutter/material.dart';
import 'package:frontend/screens/home_screen.dart';
import 'package:http/http.dart' as http;
import 'package:frontend/apis/protected.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import 'main_screen.dart';

class QrDetail extends StatefulWidget {
  final Map<String, dynamic> itemData;

  const QrDetail({super.key, required this.itemData});

  @override
  State<QrDetail> createState() => _QrDetailState();
}

class _QrDetailState extends State<QrDetail> {
  final TextEditingController _complaintNameController = TextEditingController();
  final TextEditingController _complaintDescriptionController = TextEditingController();


  final _formKey = GlobalKey<FormState>(); // Key for form validation
  String complaintName = '';
  String complaintDescription = '';
  bool _isSubmitting = false; // For loading state

  // Function to submit the complaint to the backend
  Future<void> submitComplaint() async {
    setState(() {
      _isSubmitting = true; // Show loading indicator
    });
    print('submitting ');
    final prefs = await SharedPreferences.getInstance();
    final token = await getAccessToken(); // Retrieve token here
    if (token == 'error') {
      _showSnackbar('Error: Authentication required.');
      return;
    }
    // Replace with your actual backend URL
    final url = Uri.parse('https://iitgcomplaintapp.onrender.com/api/complaints/');

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json",
          'Authorization': 'Bearer $token',},
        body: jsonEncode({
          "title": complaintName,
          "description": complaintDescription,
          "status": "unresolved",
          "user" : prefs.getString('userID'),
          "item" : widget.itemData['_id'] ?? 'N/A',
        }),
      );
      print("submitting complaint");
      if (response.statusCode == 201) {
        // Successfully posted complaint
        Navigator.pop(context, true); // Pop back with a success result
      } else {
        // Handle error by showing a message
        _showSnackbar('Failed to submit the complaint. Please try again.');
      }
    } catch (e) {
      // Handle network or server errors
      _showSnackbar('Error: Could not connect to the server.');
    } finally {
      setState(() {
        _isSubmitting = false; // Reset loading state
      });
    }
  }

  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    // Extracting the relevant data from itemData
    String qrCode = widget.itemData['qrCode'] ?? 'N/A';
    String itemid = widget.itemData['_id'] ?? 'N/A';
    print("item id is $itemid");

    String name = widget.itemData['name'] ?? 'N/A';
    String location = widget.itemData['location'] ?? 'N/A';
    List<dynamic> complaints = widget.itemData['complaints'] ?? [];
    String hostel = widget.itemData['hostel'] ?? 'N/A';

    return Scaffold(
      appBar: AppBar(title: Text('QR Details')),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('QR Code: $qrCode', style: TextStyle(fontSize: 20)),
              SizedBox(height: 8),
              Text('Name: $name', style: TextStyle(fontSize: 20)),
              SizedBox(height: 8),
              Text('Location: $location', style: TextStyle(fontSize: 16)),
              SizedBox(height: 8),
              Text('Complaints: ${complaints.length}', style: TextStyle(fontSize: 16)),
              SizedBox(height: 8),
              Text('Hostel: $hostel', style: TextStyle(fontSize: 16)),
              Divider(height: 30),
              TextField(
                controller: _complaintNameController,
                decoration: InputDecoration(
                  labelText: 'Complaint Name',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 12),
              TextField(
                controller: _complaintDescriptionController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Complaint Description',
                  border: OutlineInputBorder(),
                ),
              ),

              SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  // Handle the complaint submission here
                complaintName = _complaintNameController.text;
                complaintDescription = _complaintDescriptionController.text;

                  // Add logic to save or send the complaint details
                  print('Complaint Name: $complaintName');
                  print('Complaint Description: $complaintDescription');
                  await submitComplaint();

                  // Clear the fields after submission
                  _complaintNameController.clear();
                  _complaintDescriptionController.clear();

                  // Show a snackbar indicating success
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Complaint Submitted')),
                  );

                  // Navigate to the home page using MaterialPageRoute
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => MainScreen()),
                        (Route<dynamic> route) => false, // Remove all previous routes
                  );
                },
                child: Text('Submit Complaint'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _complaintNameController.dispose();
    _complaintDescriptionController.dispose();
    super.dispose();
  }
}