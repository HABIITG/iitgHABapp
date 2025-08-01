import 'package:flutter/material.dart';
import 'package:frontend/items/item_by_qr_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SecyHomeScreen extends StatefulWidget {
  const SecyHomeScreen({Key? key}) : super(key: key);

  @override
  State<SecyHomeScreen> createState() => _SecyHomeScreenState();
}

class _SecyHomeScreenState extends State<SecyHomeScreen> {
  List<dynamic> complaints = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchComplaints();
  }

  Future<void> fetchComplaints() async {
    try {
      final response = await http.get(Uri.parse('https://iitgcomplaintapp.onrender.com/api/items/hostelcomplaints/Lohit'));

      if (response.statusCode == 200) {
        setState(() {
          complaints = json.decode(response.body);
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load complaints');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      print('Error fetching complaints: $e');
    }
  }

  Future<void> forwardComplaintToHAB(String qrCode) async {

    print('Forwarding complaint with QR Code: $qrCode to HAB');

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All Complaints'),
        backgroundColor: Colors.blueAccent,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: complaints.length,
        itemBuilder: (context, index) {
          final complaint = complaints[index];
          return ListTile(
            title: Text(complaint['qrCode'] ?? 'No QR Code'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(complaint['description'] ?? 'No description'),
                SizedBox(height: 5),
                Text(
                  'Status: ${complaint['status'] ?? 'Unknown'}',
                  style: TextStyle(
                    color: complaint['status'] == 'resolved'
                        ? Colors.green
                        : Colors.orange,
                  ),
                ),
              ],
            ),
            trailing: Container(
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.blueAccent,
                borderRadius: BorderRadius.circular(8),
              ),
              child: TextButton(
                onPressed: () {
                  forwardComplaintToHAB(complaint['qrCode']);
                },
                child: Text(
                  'Forward to HAB',
                  style: TextStyle(
                    color: Colors.white, // Text color of the button
                  ),
                ),
              ),
            ),
            onTap: () {
              // Navigate to the ItemByQrScreen and pass the QR Code
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ItemByQrScreen(qrCode: complaint['qrCode']),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
