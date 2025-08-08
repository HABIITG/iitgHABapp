import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:frontend1/widgets/common/mess_pref_dropdowns.dart';
import 'package:frontend1/constants/themes.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/endpoint.dart';

class MessChangePreferenceScreen extends StatefulWidget {
  const MessChangePreferenceScreen({super.key});

  @override
  State<MessChangePreferenceScreen> createState() =>
      _MessChangePreferenceScreenState();
}

class _MessChangePreferenceScreenState
    extends State<MessChangePreferenceScreen> {
  bool first = true;
  String? firstpref;
  // String? secondpref;

  Future<void> handleSubmit(String? firstpref) async {
    if (firstpref == null) {
      //Show error/snackbar
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Error"),
          content: const Text("Please select a mess preference"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text("OK"),
            ),
          ],
        ),
      );
      return;
    }
    // else if (firstpref == secondpref) {
    //   showDialog(
    //     context: context,
    //     builder: (context) => AlertDialog(
    //       title: const Text("Error"),
    //       content: const Text("Please select different mess preferences"),
    //       actions: [
    //         TextButton(
    //           onPressed: () {
    //             Navigator.pop(context);
    //           },
    //           child: const Text("OK"),
    //         ),
    //       ],
    //     ),
    //   );
    //   return;
    // }
    final dio = Dio();

    try {
      final prefs = await SharedPreferences.getInstance();
      final String? UserId = prefs.getString('userId');
      //?? What is the url
      String url = MessChange.messChangeRequest;
      final token = prefs.getString('access_token');
      print(token);
      final res = await dio.post(url,
          options: Options(
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json'
            },
          ),
          data: {
            "mess_pref": firstpref,
            // "sec_pref": secondpref,
          });

      if (res.statusCode == 200) {
        //Success
        if (!mounted) {
          return;
        }
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
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
          builder: (context) => AlertDialog(
            title: const Text("ERROR"),
            content: const Text("Form couldn't be submitted\nTry Again Later!"),
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
        builder: (context) => AlertDialog(
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
                onChanged: (value) => setState(() {
                  firstpref = value;
                }),
              ),
              if (firstpref == null)
                if (first == false)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(12, 0, 8, 0),
                          child: SvgPicture.asset(
                            'assets/icon/information-line.svg',
                            height: 16,
                            width: 16,
                          ),
                        ),
                        const Text(
                          'Fill this Section',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFFC40205),
                          ),
                        ),
                      ],
                    ),
                  ),
              // if (first != false)
              //   const SizedBox(
              //     height: 20,
              //   ),
              // const Text(
              //   '2nd preference',
              //   style: TextStyle(
              //     fontSize: 16,
              //     fontWeight: FontWeight.w500,
              //   ),
              // ),
              // const SizedBox(
              //   height: 8,
              // ),
              // SecondMessChangePrefs(
              //   firstpref: firstpref,
              //   selectedOption: secondpref,
              //   onChanged: (value) => setState(() => secondpref = value),
              // ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
        height: 94,
        decoration: const BoxDecoration(
            border:
                Border(top: BorderSide(width: 1, color: Color(0xFFE5E5E5)))),
        child: ElevatedButton(
          onPressed: () {
            handleSubmit(firstpref);
            setState(() {
              first = false;
            });
          },
          style: ButtonStyle(
            backgroundColor: WidgetStateProperty.all(const Color(0xFF4C4EDB)),
            elevation: WidgetStateProperty.all(0),
          ),
          child: const Text(
            'Submit',
            style: TextStyle(fontSize: 16, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
