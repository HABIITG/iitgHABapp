import 'package:flutter/material.dart';
import '../../screens/mess_feedback/mess_feedback_page.dart';

class FeedbackCard extends StatefulWidget {
  @override
  State<FeedbackCard> createState() => _FeedbackCardState();
}

class _FeedbackCardState extends State<FeedbackCard> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('How did the mess do this month?',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text("You can help the mess team serve better meals.",
              style: TextStyle(color: Colors.black54)),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.access_time, color: Colors.red, size: 18),
              SizedBox(width: 4),
              Text('Form closes in ${DateTime.now().day - DateTime(DateTime.now().year, DateTime.now().month + 1, 1).subtract(Duration(days: 1)).day} Days',
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.w500)),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF3754DB),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24)),
              ),
              onPressed: () {
                setState(() {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MessFeedbackPage(),
                    ),
                  );

                });
              },
              child: const Text(
                'Give feedback',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}