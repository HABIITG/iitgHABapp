// import 'package:flutter/material.dart';
//
// class DataScreen extends StatefulWidget {
//   final Map<String, dynamic> itemData; // Data passed to the screen
//
//   const DataScreen({super.key, required this.itemData});
//
//   @override
//   _DataScreenState createState() => _DataScreenState();
// }
//
// class _DataScreenState extends State<DataScreen> {
//   String? data;
//   bool isLoading = true;
//
//   // @override
//   void initState() {
//     super.initState();
//     fetchData();
//   }
//
//   Future<void> fetchData() async {
//     try {
//       // Simulate API call with Future.delayed
//       await Future.delayed(const Duration(seconds: 2));
//       setState(() {
//         data = "Fetched data for ID: ${widget.itemData}";
//         isLoading = false;
//       });
//     } catch (e) {
//       setState(() {
//         data = "Failed to load data";
//         isLoading = false;
//       });
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Data Screen")),
//       body: Center(
//         child: isLoading
//             ? const CircularProgressIndicator()
//             : Text(
//           data ?? "No data available",
//           style: const TextStyle(fontSize: 18),
//         ),
//       ),
//     );
//   }
// }
