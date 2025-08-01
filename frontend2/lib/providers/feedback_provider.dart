import 'package:flutter/material.dart';

class FeedbackProvider extends ChangeNotifier {
  String breakfast = '';
  String lunch = '';
  String dinner = '';
  String comment = '';

  void setMealFeedback(String meal, String value) {
    if (meal == 'breakfast') breakfast = value;
    if (meal == 'lunch') lunch = value;
    if (meal == 'dinner') dinner = value;
    notifyListeners();
  }

  void setComment(String value) {
    comment = value;
    notifyListeners();
  }

  void clear() {
    breakfast = '';
    lunch = '';
    dinner = '';
    comment = '';
  }

  bool isComplete() =>
      breakfast.isNotEmpty && lunch.isNotEmpty && dinner.isNotEmpty;
}
