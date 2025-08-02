import 'package:flutter/material.dart';
import 'package:frontend1/constants/themes.dart';
import 'package:dropdown_button2/dropdown_button2.dart';

class MessChangePrefs extends StatefulWidget {
  const MessChangePrefs({super.key});

  @override
  State<MessChangePrefs> createState() => _MessChangePrefsState();
}

class _MessChangePrefsState extends State<MessChangePrefs> {
  String? selectedOption;
  final List<String> options = [
    'Brahmaputra',
    'Disang',
    'Dihing',
    'Dhansiri',
    'Subansiri',
    'Siang',
    'Kapili',
    'Manas',
    'Barak',
    'Umiam',
    'Kameng',
    'Gaurang'
  ];

  @override
  Widget build(BuildContext context) {
    return DropdownButtonHideUnderline(
      child: DropdownButton2<String>(
        isExpanded: true,
        items: options
            .map((String item) => DropdownMenuItem(
                value: item,
                child: Column(
                  children: [
                    Container(
                      alignment: Alignment.centerLeft,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      child: Text(item,
                          style: const TextStyle(
                              fontWeight: FontWeight.w500,
                              fontSize: 16,
                              height: 1.5,
                              color: Color(0xFF2E2F31))),
                    ),
                    if (item != options.last)
                      Divider(height: 1, color: Colors.grey.shade300),
                  ],
                )))
            .toList(),
        value: selectedOption,
        onChanged: (String? value) {
          setState(() {
            selectedOption = value;
          });
        },
        dropdownStyleData: const DropdownStyleData(
            maxHeight: 752,
            width: 358,
            decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.zero)),
        menuItemStyleData:
            const MenuItemStyleData(height: 56, padding: EdgeInsets.all(16)),
      ),
    );
  }
}

class MessChangePreferenceScreen extends StatefulWidget {
  const MessChangePreferenceScreen({super.key});

  @override
  State<MessChangePreferenceScreen> createState() =>
      _MessChangePreferenceScreenState();
}

class _MessChangePreferenceScreenState
    extends State<MessChangePreferenceScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: BackButton(),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
        child: ListView(
          children: [
            Text(
              "Mess Preference",
              style: TextStyle(
                  fontFamily: 'OpenSans_Bold',
                  color: Themes.feedbackColor,
                  fontSize: 32,
                  fontWeight: FontWeight.w700),
            ),
            SizedBox(
              height: 32,
            ),
            Text(
              'Choose the mess that suits your taste or convenience.',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 20,
              ),
            ),
            SizedBox(
              height: 24,
            ),
            Text(
              '1st preference',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(
              height: 8,
            ),
            MessChangePrefs(),
            Text(
              '2nd preference',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(
              height: 8,
            ),
            MessChangePrefs(),
          ],
        ),
      ),
    );
  }
}
