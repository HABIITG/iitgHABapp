import 'package:flutter/material.dart';
import 'package:frontend1/constants/themes.dart';

import 'package:provider/provider.dart';

import '../../providers/feedback_provider.dart';
import '../../widgets/feedback/custom_option.dart';
import 'comment_page.dart';

class MessFeedbackPage extends StatelessWidget {
  final List<String> options = [
    'Very Poor',
    'Poor',
    'Average',
    'Good',
    'Very Good'
  ];

  Widget mealBlock(String meal, String selected, Function(String) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(meal, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        SizedBox(
          height: 8,
        ),
        ...options.map((option) => customOption(
              text: option,
              groupValue: selected,
              value: option,
              onChanged: onChanged,
            )),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {

    final provider = Provider.of<FeedbackProvider>(context);


    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: BackButton(),
      ),
      body: Container(
        color: Colors.white,
        child: Padding(
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
                    fontWeight: FontWeight.w700),
              ),
              SizedBox(
                height: 32,
              ),
              Text("Step 1 / 2", style: TextStyle(color: Colors.deepPurple)),
              SizedBox(
                height: 11,
              ),
              LinearProgressIndicator(value: 0.5, color: Colors.deepPurple),
              SizedBox(height: 16),
              SizedBox(height: 8),
              Expanded(
                child: ListView(
                  children: [
                    Text(
                      "How satisfied are you with the respective meals?",
                      style: TextStyle(
                          fontFamily: 'OpenSans-Regular',
                          fontWeight: FontWeight.w500,
                          fontSize: 20),
                    ),

                    SizedBox(
                      height: 24,
                    ),
                    mealBlock("Breakfast", provider.breakfast,
                        (val) => provider.setMealFeedback('breakfast', val)),
                    mealBlock("Lunch", provider.lunch,
                        (val) => provider.setMealFeedback('lunch', val)),
                    mealBlock("Dinner", provider.dinner,
                        (val) => provider.setMealFeedback('dinner', val)),
                  ],
                ),
              ),
              Center(
                child: GestureDetector(
                  onTap: provider.isComplete()
                      ? () => Navigator.push(context,
                          MaterialPageRoute(builder: (_) => CommentPage()))
                      : null,
                  child: Container(
                    width: 358,
                    height: 54,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding:
                        const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                    decoration: BoxDecoration(
                      color: Color.fromRGBO(76, 78, 219, 1),

                      borderRadius: BorderRadius.circular(9999), // pill shape
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(width: 12),
                        Text(
                          'Next',
                          style: TextStyle(
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 16,
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
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
