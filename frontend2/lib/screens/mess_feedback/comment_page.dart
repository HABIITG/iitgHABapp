import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend2/constants/endpoint.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../apis/protected.dart';
import '../../constants/themes.dart';
import '../../providers/feedback_provider.dart';

class CommentPage extends StatefulWidget {
  @override
  State<CommentPage> createState() => _CommentPageState();
}

class _CommentPageState extends State<CommentPage> {
  final TextEditingController commentController = TextEditingController();

  Future<void> submitFeedback(BuildContext context) async {
    try {
      print('submitFeedback triggered');
      final provider = Provider.of<FeedbackProvider>(context, listen: false);

      final isSMC =
          (await SharedPreferences.getInstance()).getBool('isSMC') ?? false;

      provider.isSMC = isSMC;

      // Set comment in provider
      provider.setComment(commentController.text);

      final prefs = await SharedPreferences.getInstance();
      final name = prefs.getString('name');
      final roll = prefs.getString('rollNumber');

      final token = await getAccessToken();

      if (token == 'error') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Access token not found. Please login again.')),
        );
        return;
      }

      print("starting feedback request");

      // Prepare payload
      final Map<String, dynamic> payload = {
        'name': name,
        'rollNumber': roll,
        'breakfast': provider.breakfast,
        'lunch': provider.lunch,
        'dinner': provider.dinner,
        'comment': provider.comment,
      };

      // Add SMC fields if applicable
      if (isSMC) {
        payload['smcFields'] = {
          'hygiene': provider.hygiene,
          'wasteDisposal': provider.wasteDisposal,
          'qualityOfIngredients': provider.qualityOfIngredients,
          'uniformAndPunctuality': provider.uniformAndPunctuality,
        };
      }

      print("Payload: : : ${jsonEncode(payload)}");

      final url = Uri.parse(messFeedback.feedbackSubmit);

      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Feedback submitted successfully')),
        );
        provider.clear();
        Navigator.popUntil(context, (route) => route.isFirst);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${response.body}')),
        );
      }
    } catch (e, stack) {
      print("Error in submitFeedback: $e");
      print(stack);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Unexpected error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    print("Building CommentPage");
    final provider = Provider.of<FeedbackProvider>(context);

    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        backgroundColor: Colors.white,
      ),
      body: Container(
        color: Colors.white,
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Mess Feedback",
                        style: TextStyle(
                          fontFamily: 'OpenSans_Bold',
                          color: Themes.feedbackColor,
                          fontSize: 32,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 32),
                      const Text("Step 2 / 2",
                          style: TextStyle(color: Colors.deepPurple)),
                      const SizedBox(height: 16),
                      const LinearProgressIndicator(
                        value: 1,
                        color: Colors.deepPurple,
                      ),
                      const SizedBox(height: 11),
                      const Text(
                        "Add additional comments that would help improve the mess service",
                        style: TextStyle(
                          fontFamily: 'OpenSans-Regular',
                          fontWeight: FontWeight.w500,
                          fontSize: 20,
                          color: Color.fromRGBO(46, 47, 49, 1),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: commentController,
                        maxLines: 5,
                        maxLength: 100,
                        decoration: const InputDecoration(
                          hintText: "Write in less than 100 words",
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 16.0, horizontal: 10),
                child: ElevatedButton(
                  onPressed: () => submitFeedback(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromRGBO(76, 78, 219, 1),
                    shape: const StadiumBorder(),
                    minimumSize: const Size(358, 54),
                  ),
                  child: const Text(
                    'Submit',
                    style: TextStyle(
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
