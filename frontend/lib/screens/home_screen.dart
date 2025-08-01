import 'package:flutter/material.dart';
import 'package:frontend/screens/hab_home_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/screens/ComplaintDetails.dart';
import 'secy_home_screen.dart';
import 'package:frontend/apis/scan/qrcode.dart';


class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? email;
  String? token;
  List<dynamic> complaints = [];
  List<dynamic> filteredComplaints = [];
  String filter = "All"; // Track the current filter

  @override
  void initState() {
    super.initState();
    fetchComplaints();
  }

  Future<void> fetchComplaints() async {
    final prefs = await SharedPreferences.getInstance();
    email = prefs.getString('email');
    token = prefs.getString('access_token');

    if (email == null || token == null) {
      print('Email or token is null');
      return;
    }

    final url = 'https://iitgcomplaintapp.onrender.com/api/users/complaints/$email';

    try {
      print('Fetching complaints...');
      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        complaints = data['complaints'] ?? [];
        applyFilter(); // Apply filter on fetched complaints
      } else {
        print('Failed to load complaints: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching complaints: $e');
    }
  }

  void applyFilter() {
    setState(() {
      if (filter == "All") {
        filteredComplaints = complaints;
      }else if (filter == "Submitted") {
        filteredComplaints = complaints
            .where((complaint) => complaint['status'] == 'submitted')
            .toList();
      }
      else if (filter == "In Progress") {
        filteredComplaints = complaints
            .where((complaint) => complaint['status'] == 'In Progress')
            .toList();
      } else if (filter == "Resolved") {
        filteredComplaints = complaints
            .where((complaint) => complaint['status'] == 'resolved')
            .toList();
      }
    });
  }

  void updateFilter(String newFilter) {
    setState(() {
      filter = newFilter;
      applyFilter();
    });
  }

  void removeComplaint(String id) {
    setState(() {
      complaints.removeWhere((complaint) => complaint['_id'] == id);
      applyFilter();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Screen'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: 10),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton(
                    onPressed: () => updateFilter("All"),
                    child: Text('All'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: filter == "All" ? Colors.deepPurple : Colors.grey,
                    ),
                  ),ElevatedButton(
                    onPressed: () => updateFilter("Submitted"),
                    child: Text('Submitted'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: filter == "Submitted" ? Colors.deepPurple : Colors.grey,
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => updateFilter("In Progress"),
                    child: Text('In Progress'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: filter == "In Progress" ? Colors.deepPurple : Colors.grey,
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => updateFilter("Resolved"),
                    child: Text('Resolved'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: filter == "Resolved" ? Colors.deepPurple : Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 10),
            Expanded(
              child: filteredComplaints.isEmpty
                  ? const Center(
                      child:Text(
                  'No complaints matching the selected filter.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
              )
                  : ListView.builder(
                     itemCount: filteredComplaints.length,
                      itemBuilder: (context, index) {
                       final complaint = filteredComplaints[index];
                       return GestureDetector(
                         onTap: () {
                           Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ComplaintDetailScreen(
                            id: complaint['_id'],
                            description: complaint['description'] ?? 'No description',
                            status: complaint['status'] ?? 'Unknown',
                            createdOn: complaint['createdOn']?.toString() ?? '',
                            onDelete: removeComplaint,
                          ),
                        ),
                      );
                    },
                    child: Container(
                      margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
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
                            complaint['description'] ?? 'No description',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Status: ${complaint['status']}',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Created On: ${complaint['createdOn']?.toString() ?? ''}',
                            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly, // To space them evenly
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => SecyHomeScreen(), // Navigate to SecyHomeScreen
                        ),
                      );
                    },
                    child: Text("Secy"),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => HabHomeScreen(), // Navigate to HabHomeScreen
                        ),
                      );
                    },
                    child: Text("HAB"),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    ),
                  ),
                ),
              ],
            )

          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => QrScan(),
            ),
          );
        },
        backgroundColor: Colors.deepPurple,
        child: Icon(Icons.add),
      ),
    );
  }
}
