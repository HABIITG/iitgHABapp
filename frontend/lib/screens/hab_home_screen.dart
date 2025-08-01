import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../items/item_by_qr_screen.dart';

class HabHomeScreen extends StatefulWidget {
  const HabHomeScreen({super.key});

  @override
  State<HabHomeScreen> createState() => _HabHomeScreenState();
}

class _HabHomeScreenState extends State<HabHomeScreen> {
  String? selectedHostel;
  List<String> hostels = ['Lohit', 'Brahmaputra', 'Disang', 'Umiam', 'Kameng', 'Barak',];
  List<Item> items = [];
  bool isLoading = false;

  Future<void> fetchItems(String hostel) async {
    setState(() {
      isLoading = true;
    });
    try {
      final response = await http.get(
        Uri.parse('https://iitgcomplaintapp.onrender.com/api/items/hab/$hostel'),
      );
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        setState(() {
          items = data.map((itemJson) => Item.fromJson(itemJson)).toList();
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load items');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error fetching items: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HAB Complaints'),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 130,
              child: DropdownButton<String>(
                value: selectedHostel,
                hint: const Text('Select Hostel'),
                onChanged: (newHostel) {
                  setState(() {
                    selectedHostel = newHostel;
                  });
                  if (newHostel != null) {
                    fetchItems(newHostel);
                  }
                },
                items: hostels.map<DropdownMenuItem<String>>((String hostel) {
                  return DropdownMenuItem<String>(
                    value: hostel,
                    child: Text(hostel),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16.0),
            isLoading
                ? const Center(child: CircularProgressIndicator())
                : Expanded(
              child: ListView.builder(
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  return ListTile(
                    title: Text(item.name),
                    subtitle: Text(item.description),
                    trailing: Text(
                      '${item.complaints.length} complaints',
                      style: const TextStyle(color: Colors.orange),
                    ),
                    onTap: () {
                      // Navigate to the detailed view for this item
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ItemByQrScreen(
                            qrCode: item.qrCode,
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Item {
  final String qrCode;
  final String name;
  final String description;
  final String location;
  final List<String> complaints;

  Item({
    required this.qrCode,
    required this.name,
    required this.description,
    required this.location,
    required this.complaints,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      qrCode: json['qrCode'] ?? '',
      name: json['name'] ?? 'Unknown Item',
      description: json['description'] ?? 'No description',
      location: json['location'] ?? 'No location',
      complaints: List<String>.from(json['complaints'] ?? []),
    );
  }
}