import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class NewComplaintScreen extends StatefulWidget {
  @override
  _NewComplaintScreenState createState() => _NewComplaintScreenState();
}

class _NewComplaintScreenState extends State<NewComplaintScreen> {
  final _formKey = GlobalKey<FormState>(); // Key for form validation
  String complaintName = '';
  String complaintDescription = '';
  bool _isSubmitting = false; // For loading state

  // Function to submit the complaint to the backend
  Future<void> submitComplaint() async {
    setState(() {
      _isSubmitting = true; // Show loading indicator
    });

    // Replace with your actual backend URL
    final url = Uri.parse('http://192.168.62.85:3000/api/complaints/');

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": complaintName,
          "description": complaintDescription,
          "date": DateTime.now().toIso8601String(),
          "status": "submitted"
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

  // Show a snackbar for error messages
  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Register New Complaint'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Complaint Name'),
                onChanged: (value) {
                  setState(() {
                    complaintName = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter complaint name';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Complaint Description'),
                onChanged: (value) {
                  setState(() {
                    complaintDescription = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter complaint description';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              _isSubmitting
                  ? CircularProgressIndicator() // Show loading indicator when submitting
                  : ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    submitComplaint(); // Only submit if form is valid
                  }
                },
                child: Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
