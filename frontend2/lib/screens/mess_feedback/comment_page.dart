import 'dart:convert';

import 'package:flutter/material.dart';


import 'package:frontend1/constants/endpoint.dart';
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
    final provider = Provider.of<FeedbackProvider>(context, listen: false);
    final prefs = await SharedPreferences.getInstance();
    final name = prefs.getString('name');
    final roll = prefs.getString('rollNumber');
    final token = await getAccessToken();

    if (token == 'error') {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Access token not found. Please login again.')),
      );
      return;
    }

    final url = Uri.parse(messFeedback.feedbackSubmit);
    final response = await http.post(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'name': name,
        'rollNumber': roll,
        'breakfast': provider.breakfast,
        'lunch': provider.lunch,
        'dinner': provider.dinner,
        'comment': provider.comment,
      }),
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Feedback submitted successfully')),
      );
      provider.clear();
      Navigator.popUntil(context, (route) => route.isFirst);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${response.body}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<FeedbackProvider>(context);


    return Scaffold(
      appBar: AppBar(leading: BackButton(),backgroundColor: Colors.white,),
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
                      Text(
                        "Mess Feedback",
                        style: TextStyle(
                          fontFamily: 'OpenSans_Bold',
                          color: Themes.feedbackColor,

                          fontSize: 32,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 32),
                      Text("Step 2 / 2",
                          style: TextStyle(color: Colors.deepPurple)),
                      SizedBox(height: 16),
                      LinearProgressIndicator(value: 1, color: Colors.deepPurple),
                      SizedBox(height: 11),
                      Text(
                        "Add additional comments that would help improve the mess service",
                        style: TextStyle(
                          fontFamily: 'OpenSans-Regular',
                          fontWeight: FontWeight.w500,
                          fontSize: 20,
                          color: Color.fromRGBO(46, 47, 49, 1),
                        ),
                      ),
                      SizedBox(height: 10),
                      TextField(
                        controller: commentController,
                        maxLines: 5,
                        maxLength: 100,

                        decoration: InputDecoration(
                          hintText: "Write in less than 100 words",
                          border: OutlineInputBorder(),
                        ),
                        onChanged: provider.setComment,
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 16.0, horizontal: 10),
                child: GestureDetector(

                  onTap: () => submitFeedback(context),

                  child: Container(
                    width: 358,
                    height: 54,
                    decoration: BoxDecoration(
                      color: Color.fromRGBO(76, 78, 219, 1),
                      borderRadius: BorderRadius.circular(9999),
                    ),

                    child: Center(
                      child: Text(
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
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
