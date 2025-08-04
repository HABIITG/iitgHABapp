// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
//
// import 'new_complaint_screen.dart'; // for jsonEncode
//
// class MyComplaintsScreen extends StatefulWidget {
//   @override
//   _MyComplaintsScreenState createState() => _MyComplaintsScreenState();
// }
//
// class _MyComplaintsScreenState extends State<MyComplaintsScreen> {
//   List<Map<String, String>> complaints = [];
//
//   @override
//   void initState() {
//     super.initState();
//     fetchComplaints();
//   }
//
//   // Fetch complaints from the backend (replace with your actual endpoint)
//   Future<void> fetchComplaints() async {
//     // replace with your actual URL
//     final response = await http.get(Uri.parse('https://hab.codingclub.in/api/complaints'));
//
//     if (response.statusCode == 200) {
//       setState(() {
//         complaints = List<Map<String, String>>.from(jsonDecode(response.body));
//       });
//     } else {
//       // Handle errors if needed
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('User Complaints'),
//         actions: [
//           IconButton(
//             icon: Icon(Icons.search),
//             onPressed: () {
//               // Search functionality can be implemented here
//             },
//           ),
//         ],
//       ),
//       body: ListView.builder(
//         itemCount: complaints.length,
//         itemBuilder: (context, index) {
//           return ComplaintTile(
//             complaint: complaints[index],
//             onTap: () {
//               Navigator.push(
//                 context,
//                 MaterialPageRoute(
//                   builder: (context) => ComplaintDetailScreen(
//                     complaint: complaints[index],
//                   ),
//                 ),
//               );
//             },
//           );
//         },
//       ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: () async {
//           // Navigate to new complaint form
//           final result = await Navigator.push(
//             context,
//             MaterialPageRoute(builder: (context) => NewComplaintScreen()),
//           );
//           if (result == true) {
//             // Refresh the complaints list when a new complaint is added
//             fetchComplaints();
//           }
//         },
//         child: Icon(Icons.add),
//       ),
//     );
//   }
// }
//
// class ComplaintTile extends StatelessWidget {
//   final Map<String, String> complaint;
//   final VoidCallback onTap;
//
//   ComplaintTile({required this.complaint, required this.onTap});
//
//   @override
//   Widget build(BuildContext context) {
//     return Card(
//       margin: EdgeInsets.all(10),
//       child: ListTile(
//         title: Text(complaint['name'] ?? ''),
//         subtitle: Text(complaint['date'] ?? ''),
//         trailing: Column(
//           crossAxisAlignment: CrossAxisAlignment.end,
//           children: [
//             Text(complaint['time'] ?? '', style: TextStyle(fontSize: 16)),
//             SizedBox(height: 5),
//             Text(complaint['status'] ?? '', style: TextStyle(color: Colors.grey)),
//           ],
//         ),
//         onTap: onTap,
//       ),
//     );
//   }
// }
//
// class ComplaintDetailScreen extends StatelessWidget {
//   final Map<String, String> complaint;
//
//   ComplaintDetailScreen({required this.complaint});
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Complaint Details'),
//       ),
//       body: Padding(
//         padding: EdgeInsets.all(16.0),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text('Complaint: ${complaint['name']}', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
//             SizedBox(height: 10),
//             Text('Date: ${complaint['date']}'),
//             SizedBox(height: 10),
//             Text('Time: ${complaint['time']}'),
//             SizedBox(height: 10),
//             Text('Status: ${complaint['status']}'),
//             SizedBox(height: 20),
//             Text('Details: ', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
//           ],
//         ),
//       ),
//     );
//   }
// }
