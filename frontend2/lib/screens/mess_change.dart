// import 'package:flutter/material.dart';
//
// class MessChangeReq extends StatelessWidget {
//   // final double sliderValue = 2;
//   String? selectedValue;
//
//   // List of dropdown items
//   final List<String> items = [
//     'Item 1',
//     'Item 2',
//     'Item 3',
//     'Item 4',
//     'Item 5',
//     'Item 6',
//   ];
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Color(0xFFFFFFFF),
//       appBar: PreferredSize(
//         preferredSize: Size.fromHeight(120),
//         child: AppBar(
//           backgroundColor: Color(0xFFFFFFFF),
//           automaticallyImplyLeading: false,
//           flexibleSpace: Padding(
//             padding: EdgeInsets.only(left: 16, top: 20, right: 16),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 IconButton(
//                   icon: Icon(Icons.arrow_back, size: 30),
//                   onPressed: () {
//                     Navigator.pop(context);
//                   },
//                 ),
//                 SizedBox(height: 4),
//                 Text("Mess Change Form",style: TextStyle(fontWeight: FontWeight.bold, fontSize: 32),),
//               ],
//             ),
//           ),
//         ),
//       ),
//       body: Container(
//           child: SingleChildScrollView(
//               padding: const EdgeInsets.all(24.0),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   SizedBox(height: 24),
//                   Text("Which mess do you want to change to", style: TextStyle(
//                     fontWeight: FontWeight.w500,
//                     fontSize: 20,
//                     color: Color(0xFF2E2F31),
//                   ),),
//                   DropdownButton<String>(
//                     hint: Text('Select an item'),
//                     value: selectedValue,
//                     icon: Icon(Icons.arrow_downward),
//                     elevation: 16,
//                     style: TextStyle(color: Colors.deepPurple),
//                     underline: Container(
//                       height: 2,
//                       color: Colors.deepPurpleAccent,
//                     ),
//                     onChanged: (String? newValue) {
//                       setState(() {
//                         selectedValue = newValue;
//                       });
//                     },
//                     items: items.map<DropdownMenuItem<String>>((String value) {
//                       return DropdownMenuItem<String>(
//                         value: value,
//                         child: Text(value),
//                       );
//                     }).toList(),
//                   ),
//                   SizedBox(height: 20),
//                   Container(
//                     width: double.infinity,
//                     height: 100,
//                     child: TextField(
//                       maxLines: 2,
//                       decoration: InputDecoration(
//                         alignLabelWithHint: true,
//                         border: OutlineInputBorder(
//                           borderRadius: BorderRadius.circular(16),
//                           borderSide: BorderSide(color: Color(0xFFC5C5D1)),
//                         ),
//                         labelText: "Type your mess name here",
//                         labelStyle: TextStyle(color: Color(0xFF2E2F31), fontSize: 14),
//                       ),
//                     ),
//                   ),
//                   SizedBox(height: 20),
//                   Text("Why do you want to change the mess ?", style: TextStyle(
//                     fontWeight: FontWeight.w500,
//                     fontSize: 16,
//                     color: Color(0xFF2E2F31),
//                   ),
//                   ),
//                   SizedBox(height: 10),
//                   Container(
//                     width: double.infinity,
//                     height: 180,
//                     child: TextField(
//                       maxLines: 5,
//                       decoration: InputDecoration(
//                         alignLabelWithHint: true,
//                         border: OutlineInputBorder(
//                           borderRadius: BorderRadius.circular(16),
//                           borderSide: BorderSide(color: Color(0xFFC5C5D1)),
//                         ),
//                         labelText: "Tell us the reason for the change",
//                         labelStyle: TextStyle(color: Color(0xFF2E2F31), fontSize: 14),
//                       ),
//                     ),
//                   ),
//                   SizedBox(height: 100),
//                   Container(
//                     color: Color(0xFFC5C5D1),
//                     height: 1.2,
//                   ),
//                   SizedBox(height: 10),
//                   Center(
//                     child: ElevatedButton(
//                       onPressed: () {},
//                       style: ElevatedButton.styleFrom(
//                         padding:
//                         EdgeInsets.symmetric(horizontal: 110, vertical: 15),
//                         backgroundColor: Color(0xFF3754DB),
//                         foregroundColor: Colors.white,
//                       ),
//                       child: Text("Submit Request", style: TextStyle(fontFamily: 'GeneralSans'),),
//                     ),
//                   )
//                 ],
//               )
//           )
//       ),
//     );
//   }
// }





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
          ],
        ),
      ),
    );
  }
}