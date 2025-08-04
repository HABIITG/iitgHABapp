import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dropdown Demo',
      home: MessChangeReq(),
    );
  }
}

class MessChangeReq extends StatefulWidget {
  @override
  _MessChangeReqState createState() => _MessChangeReqState();
}

class _MessChangeReqState extends State<MessChangeReq> {
  String? selectedValue;

  final List<String> items = [
    'Bramhaputra',
    'Lohit',
    'Umiam',
    'Barak',
    'Disang',
    'Kapili',
    'Dhansiri',
    'Siang',
    'Subansiri',
    'Dihing',
    'Gaurang',
    'Manas',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mess Preference',style: TextStyle(
          fontWeight: FontWeight.w700,
        ),),
      ),
      backgroundColor: Colors.white,
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 20),
            Text('Choose the mess that suits your taste or convenience'),
            SizedBox(height: 10),
            DropdownButton<String>(
              hint: Text('First Preference'),
              value: selectedValue,
              icon: Icon(Icons.keyboard_arrow_down),
              elevation: 16,
              style: TextStyle(color: Colors.deepPurple),
              underline: Container(
                height: 2,
                color: Colors.deepPurpleAccent,
              ),
              onChanged: (String? newValue) {
                setState(() {
                  selectedValue = newValue;
                });
              },
              items: items.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            SizedBox(height: 10),
            DropdownButton<String>(
              hint: Text('Second Preference'),
              value: selectedValue,
              icon: Icon(Icons.keyboard_arrow_down),
              elevation: 16,
              style: TextStyle(color: Colors.deepPurple),
              underline: Container(
                height: 2,
                color: Colors.deepPurpleAccent,
              ),
              onChanged: (String? newValue) {
                setState(() {
                  selectedValue = newValue;
                });
              },
              items: items.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}