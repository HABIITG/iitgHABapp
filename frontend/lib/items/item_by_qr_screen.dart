import 'package:flutter/material.dart';
import 'package:frontend/apis/protected.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ItemByQrScreen extends StatefulWidget {
  final String qrCode;

  const ItemByQrScreen({Key? key, required this.qrCode}) : super(key: key);

  @override
  _ItemByQrScreenState createState() => _ItemByQrScreenState();
}

class _ItemByQrScreenState extends State<ItemByQrScreen> {
  Item? _item;
  String? _errorMessage;
  bool _isLoading = false;
  TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchItemByQR(widget.qrCode); // Fetch item for the passed QR code
  }

  Future<void> _fetchItemByQR(String qrCode) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await http.get(
        Uri.parse('https://iitgcomplaintapp.onrender.com/api/items/$qrCode'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final itemJson = json.decode(response.body);
        print('Fetched item data: $itemJson');
        if (itemJson != null) {
          final item = Item.fromJson(itemJson);
          setState(() {
            _item = item;
            _errorMessage = null;
          });
        } else {
          setState(() {
            _errorMessage = 'No data found for this QR Code';
            _item = null;
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Failed to fetch item. Status code: ${response.statusCode}';
          _item = null;
        });
      }
    } catch (error) {
      setState(() {
        _errorMessage = 'Error fetching data: $error';
        _item = null;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _saveComment() async {
    final comment = _commentController.text;
    if (comment.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Comment cannot be empty."),
          duration: Duration(seconds: 1),
        ),
      );
      return;
    }

    final token = await getAccessToken();

    try {
      final response = await http.put(
        Uri.parse('https://iitgcomplaintapp.onrender.com/api/items/${widget.qrCode}'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
        body: json.encode({'comment': comment}),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Comment saved: $comment"),
            duration: Duration(seconds: 1),
          ),
        );
      } else {
        throw Exception('Failed to save comment: ${response.body}');
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Error saving comment: $error"),
          duration: Duration(seconds: 1),
        ),
      );
    }

    // Clear the comment field
    _commentController.clear();
  }

    Future<void> updateItem(String itemId) async {
      final url = Uri.parse('http://your-backend-url.com/items/$itemId');  // Adjust the URL as needed

      // Prepare the data to send
      final Map<String, dynamic> requestBody = {
        'status': 'resolved',  // New status
        'complaints': []       // Clear complaints
      };

      try {
        final response = await http.put(
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode(requestBody),
        );

        if (response.statusCode == 200) {
          print('Item updated successfully: ${response.body}');
        } else if (response.statusCode == 404) {
          print('Item not found');
        } else {
          print('Failed to update item: ${response.body}');
        }
      } catch (e) {
        print('Error updating item: $e');
      }
    }




  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Item Details'),
        backgroundColor: Colors.deepPurple,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (_isLoading) CircularProgressIndicator(),
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Text(
                  _errorMessage!,
                  style: TextStyle(color: Colors.red),
                ),
              ),
            if (_item != null) _buildItemDetails(_item!),
          ],
        ),
      ),
    );
  }

  Widget _buildItemDetails(Item item) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Name: ${item.name}",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 8),
            Text("QR Code: ${item.qrCode}"),
            Text("Description: ${item.description ?? 'No description available'}"),
            Text("Location: ${item.location ?? 'Unknown'}"),
            Text("Status: ${item.status}"),
            Text("Current Authority: ${item.currentAuthority}"),
            Text("Hostel: ${item.hostel}"),
            if (item.complainUpdate != null && item.complainUpdate!.isNotEmpty)
              Text("Complain Update: ${item.complainUpdate}"),
            SizedBox(height: 16),
            // Comment Text Field
            Text(
              "Add Comment:",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            TextField(
              controller: _commentController,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Enter your comment here',
              ),
              maxLines: 3,
            ),
            SizedBox(height: 16),
            // Save Comment Button
            ElevatedButton(
              onPressed: _saveComment,
              child: Text("Save Comment"),
            ),
            SizedBox(height: 8),
            // Resolve Button
            ElevatedButton(onPressed: () {}, child: Text("Resolved")),

            SizedBox(height: 8,),

            SizedBox(height: 16),
            Text("Complaints:", style: TextStyle(fontWeight: FontWeight.bold)),
            if (item.complaints.isNotEmpty)
              ...item.complaints.map((complaint) {
                return _buildComplaintCard(complaint);
              }).toList()
            else
              Text("No complaints available."),
          ],
        ),
      ),
    );
  }

  Widget _buildComplaintCard(Complaint complaint) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 2,
            blurRadius: 5,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            complaint.description ?? 'No description available',
            style: TextStyle(fontSize: 14),
          ),
          SizedBox(height: 8),
          Text("Status: ${complaint.status}"),
          Text("Date: ${complaint.date ?? 'Unknown'}"),
        ],
      ),
    );
  }
}

class Item {
  final String? qrCode;
  final String? name;
  final String? description;
  final String? location;
  final String? status;
  final String? currentAuthority;
  final String? hostel;
  final String? complainUpdate;
  final List<Complaint> complaints;

  Item({
    required this.qrCode,
    required this.name,
    this.description,
    this.location,
    required this.status,
    required this.currentAuthority,
    required this.hostel,
    this.complainUpdate,
    required this.complaints,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    var complaintsList = json['complaints'] as List? ?? [];
    List<Complaint> complaints = complaintsList
        .map((complaintJson) => Complaint.fromJson(complaintJson))
        .toList();

    return Item(
      qrCode: json['qrCode'],
      name: json['name'],
      description: json['description'],
      location: json['location'],
      status: json['status'],
      currentAuthority: json['currentAuthority'],
      hostel: json['hostel'],
      complainUpdate: json['complainUpdate'],
      complaints: complaints,
    );
  }
}

class Complaint {
  final String description;
  final String status;
  final String date;

  Complaint({
    required this.description,
    required this.status,
    required this.date,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      description: json['description'],
      status: json['status'],
      date: json['date'] ?? 'Unknown',
    );
  }
}
