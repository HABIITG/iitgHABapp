import 'package:flutter/material.dart';
import 'package:frontend1/widgets/common/hostel_details.dart';
import 'package:frontend1/screens/home_screen.dart';
import 'package:frontend1/widgets/common/hostel_name.dart';
import 'package:http/http.dart' as http;
import 'package:frontend1/apis/protected.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';



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


  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    // Extracting the relevant data from itemData
    print("widget.itemData Type: ${widget.itemData.runtimeType}");
    print("widget.itemData Content: ${jsonEncode(widget.itemData)}");


    final user = widget.itemData['user'] as Map<String, dynamic>? ?? {};

    String name = user['name'] ?? 'N/A';
    String rollNumber = user['rollNumber'] ?? 'Not Available';
    String currMess = user['curr_subscribed_mess'] ?? 'Not Available';
    String hostel = user['hostel'] ?? 'N/A';

    return Scaffold(
      appBar: AppBar(title: Text('QR Details')),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Current Mess is: ${calculateHostel(currMess)}' , style: TextStyle(fontSize: 20)),
              SizedBox(height: 8),
              Text('Name: $name', style: TextStyle(fontSize: 20)),
              SizedBox(height: 8),
              Text('rollNumber: $rollNumber', style: TextStyle(fontSize: 16)),
              SizedBox(height: 8),
              Text('Hostel: ${calculateHostel(hostel)}', style: TextStyle(fontSize: 16)),
              Divider(height: 30),
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