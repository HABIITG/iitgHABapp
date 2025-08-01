import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/apis/protected.dart';
import 'package:intl/intl.dart'; // Import for date formatting

class ComplaintDetailScreen extends StatelessWidget {
  final String id; // Add ID to identify the complaint
  final String description;
  final String status;
  final String createdOn;
  final Function(String) onDelete; // Callback for deletion

  const ComplaintDetailScreen({
    Key? key,
    required this.id, // Initialize the ID
    required this.description,
    required this.status,
    required this.createdOn,
    required this.onDelete, // Initialize the callback

  }) : super(key: key);

  // Function to delete the complaint
  Future<void> deleteComplaint(BuildContext context) async {
    final header = await getAccessToken();
    final url = 'http://192.168.195.85:3000/api/complaints/$id';
    print(id);// URL to delete the complaint
    final response = await http.delete(Uri.parse(url),
    headers: {"Authorization": "Bearer $header"});

    if (response.statusCode == 200) {
      onDelete(id); // Call the delete callback to update the HomeScreen
      Navigator.pop(context); // Go back to the previous screen
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Complaint deleted successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete complaint')),
      );
    }
  }

  // Function to check if the complaint is older than 10 days
  bool isOlderThan10Days() {
    final createdDate = DateTime.parse(createdOn);
    final currentDate = DateTime.now();
    final difference = currentDate.difference(createdDate).inDays;

    return difference > 10; // Return true if older than 10 days
  }

  @override
  Widget build(BuildContext context) {
    final isOlder = isOlderThan10Days();

    return Scaffold(
      appBar: AppBar(
        title: Text('Complaint Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Description:',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(description),
            SizedBox(height: 16),
            Text(
              'Status:',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(status),
            SizedBox(height: 16),
            Text(
              'Created On:',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(DateFormat('yyyy-MM-dd').format(DateTime.parse(createdOn))),
            SizedBox(height: 16),

            // Delete button
            ElevatedButton(
              onPressed: () {
                deleteComplaint(context); // Call the delete function
              },
              child: Text('Delete Complaint'),
              style: ElevatedButton.styleFrom(),
            ),

            // Conditionally show submit button
            if (isOlder) ...[
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  // Implement your POST request logic here

                  // For example, you could call a function to handle submission
                },
                child: Text('Submit Request to HAB'),
                style: ElevatedButton.styleFrom(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
