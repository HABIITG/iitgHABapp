import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:frontend1/constants/themes.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/endpoint.dart';

class MessChangePrefs extends StatelessWidget {
  final String? selectedOption;
  final ValueChanged<String?> onChanged;

  const MessChangePrefs(
      {super.key, required this.selectedOption, required this.onChanged});

  @override
  Widget build(BuildContext context) {
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
    return DropdownButtonHideUnderline(
      child: DropdownButton2<String>(
        isExpanded: true,
        hint: const Padding(
          padding: EdgeInsetsGeometry.all(8),
          child: Text(
            'Select',
            style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 16,
                color: Color(0xFF676767),
                fontFamily: 'General Sans Variable'),
          ),
        ),
        items: options
            .map((String item) =>
            DropdownMenuItem(
              value: item,
              child: Container(
                decoration: BoxDecoration(
                    border: (item == options.last
                        ? null
                        : Border(
                        bottom: BorderSide(
                            color: Colors.grey.shade300, width: 1.0)))),
                alignment: Alignment.centerLeft,
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Text(item,
                    style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 16,
                        height: 1.5,
                        color: Color(0xFF2E2F31))),
              ),
            ))
            .toList(),
        selectedItemBuilder: (context) {
          return options.map((String item) {
            return Padding(
                padding: const EdgeInsetsGeometry.symmetric(
                    horizontal: 8, vertical: 8),
                child: Text(item,
                    style: const TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                      color: Color(0xFF4C4EDB),
                      decoration: TextDecoration.none,
                    )));
          }).toList();
        },
        value: selectedOption,
        onChanged: onChanged,
        buttonStyleData: ButtonStyleData(
            height: 56,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
                color: selectedOption == null
                    ? const Color(0xFFF5F5F5)
                    : const Color(0xFFEDEDFB),
                borderRadius: BorderRadius.circular(16),
                border: selectedOption == null
                    ? Border.all(color: const Color(0xFFC5C5D1), width: 1)
                    : Border.all(color: const Color(0xFF4C4EDB), width: 2))),
        dropdownStyleData: DropdownStyleData(
            maxHeight: MediaQuery
                .of(context)
                .size
                .height * 0.5,
            width: MediaQuery
                .of(context)
                .size
                .width * 0.9,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300, width: 1.0)),
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 16)),
        menuItemStyleData: const MenuItemStyleData(
            height: 56, padding: EdgeInsets.symmetric(horizontal: 16)),
      ),
    );

    //State<MessChangePrefs> createState() => _MessChangePrefsState();
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
  String? firstpref;
  String? secondpref;

  Future<void> handleSubmit(String? firstpref, String? secondpref) async {
    if (firstpref == null) {
      //Show error/snackbar
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
              title: const Text("Error"),
              content: const Text("Please select a mess preference"),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: const Text("OK"),
                ),
              ],
            ),
      );
      return;
    }
    final dio = Dio();

    try {
      final prefs = await SharedPreferences.getInstance();
      final String? rollnumber = prefs.getString('rollNumber');
      //?? What is the url
      String url = '$baseUrl/mess-change/reqchange';
      final token = prefs.getString('access_token');

      final res = await dio.post(url,
          options: Options(
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json'
            },
          ),
          data: {
            "hostel_name": firstpref,
            "sec_pref": secondpref,
            "roll_number": rollnumber
          });

      if (res.statusCode == 200) {
        //Success
        if (!mounted) {
          return;
        }
        showDialog(
          context: context,
          builder: (context) =>
              AlertDialog(
                title: const Text("Success"),
                content: const Text("Form submitted successfully!"),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    child: const Text("OK"),
                  ),
                ],
              ),
        );
      } else {
        //Show error message or something
        if (!mounted) {
          return;
        }

        showDialog(
          context: context,
          builder: (context) =>
              AlertDialog(
                title: const Text("ERROR"),
                content: const Text(
                    "Form couldn't be submitted\nTry Again Later!"),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    child: const Text("OK"),
                  ),
                ],
              ),
        );
      }
    } catch (e) {
      //Show error
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
              title: const Text("Error!!"),
              content: const Text("We couldn't process your request!"),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: const Text("OK"),
                ),
              ],
            ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          leading: const BackButton(),
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
            child: ListView(
              shrinkWrap: true,
              children: [
                const Text(
                  "Mess Preference",
                  style: TextStyle(
                      fontFamily: 'OpenSans_Bold',
                      color: Themes.feedbackColor,
                      fontSize: 32,
                      fontWeight: FontWeight.w700),
                ),
                const SizedBox(
                  height: 32,
                ),
                const Text(
                  'Choose the mess that suits your taste or convenience.',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(
                  height: 24,
                ),
                const Text(
                  '1st preference',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(
                  height: 8,
                ),
                MessChangePrefs(
                  selectedOption: firstpref,
                  onChanged: (value) =>
                      setState(() {
                        firstpref = value;
                      }),
                ),
                if (firstpref == null)
                  Row(
                    children: [
                      SvgPicture.asset(
                        'frontend2/assets/icon/information-line.svg',
                        height: 16,
                        width: 16,
                      ),
                      const Text(
                        'Fill this Section',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFC40205),
                        ),
                      ),
                    ],
                  )
                else
                  const SizedBox(
                    height: 20,
                  ),
                const Text(
                  '2nd preference',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(
                  height: 8,
                ),
                MessChangePrefs(
                  selectedOption: secondpref,
                  onChanged: (value) => setState(() => secondpref = value),
                ),
              ],
            ),
          ),
        ),
        bottomNavigationBar: Container(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          height: 94,
          decoration: const BoxDecoration(border: Border(
              top: BorderSide(width: 1, color: Color(0xFFE5E5E5)))),
            child: ElevatedButton(
              onPressed: () {
                handleSubmit(firstpref, secondpref);
              },
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(const Color(0xFF4C4EDB)),elevation: WidgetStateProperty.all(0),),
              child: const Text(
                'Submit',
                style: TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ),
        );
    }
}
