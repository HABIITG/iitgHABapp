import 'package:flutter/material.dart';

class NewMessScreen extends StatefulWidget {
  const NewMessScreen({super.key});

  @override
  State<NewMessScreen> createState() => _NewMessScreenState();
}

class _NewMessScreenState extends State<NewMessScreen> {
  // List of hostels for dropdown at right corner
  List<String> hostels = [
    'Barak',
    'Bramaputra',
    'Dhansiri',
    'Kapili',
    'Lohit',
    'Umiam'
  ];
  String? selectedHostel = 'Kapili'; // Default selected hostel

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Text(
                    "Mess",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Menu",
                    style: TextStyle(color: Colors.grey, fontSize: 24),
                  ),
                  DropdownButton<String>(
                    dropdownColor: Colors.grey.shade100,
                    iconEnabledColor: const Color(0xff4C4EDB),
                    value: selectedHostel,
                    icon: const Icon(Icons.arrow_drop_down_sharp),
                    elevation: 0,
                    style:
                        const TextStyle(color: Color(0xff4C4EDB), fontSize: 20),
                    items:
                        hostels.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                    onChanged: (String? value) {
                      setState(() {
                        selectedHostel = value!;
                      });
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
