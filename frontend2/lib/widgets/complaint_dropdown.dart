import 'package:flutter/material.dart';

import '../screens/mess_feedback/mess_feedback_page.dart';

class ComplaintsCard extends StatefulWidget {
  const ComplaintsCard({super.key, this.feedbackform = false, this.daysLeft = 2});
  final bool feedbackform;
  final int daysLeft;

  @override
  State<ComplaintsCard> createState() => _ComplaintsCardState();
}

class _ComplaintsCardState extends State<ComplaintsCard> {
  int expandedSection = 2;

  @override
  Widget build(BuildContext context) {
    const usernameBlue = Color(0xFF3754DB);

    Widget sectionHeader(String title, int section, {Widget? trailing}) {
      return InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: () {
          setState(() {
            expandedSection = expandedSection == section ? 0 : section;
          });
        },
        child: Row(
          children: [
            Text(
              title,
              style: const TextStyle(
                color: usernameBlue,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
            if (trailing != null) ...[const SizedBox(width: 6), trailing],
            const Spacer(),
            Icon(
              expandedSection == section
                  ? Icons.keyboard_arrow_up_rounded
                  : Icons.keyboard_arrow_down_rounded,
              color: Colors.black38,
            ),
          ],
        ),
      );
    }

    Widget sectionBody(int section) {
      if (expandedSection != section) return const SizedBox.shrink();
      if (section == 1) {
        return const Padding(
          padding: EdgeInsets.symmetric(vertical: 18.0),
          child: Center(
            child: Text(
              "Coming soon",
              style: TextStyle(
                color: Colors.black54,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        );
      } else if (section == 2) {
        if (widget.feedbackform) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "How did the mess do this week?",
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  "You can help the mess team serve better meals.",
                  style: TextStyle(
                    color: Colors.black54,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    const Icon(Icons.access_time, color: Colors.red, size: 18),
                    const SizedBox(width: 6),
                    Text(
                      "Form closes in ${widget.daysLeft} Days",
                      style: const TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
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
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF5C60F5),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      elevation: 0,
                    ),
                    child: const Text(
                      "Give Feedback",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        } else {
          return const Padding(
            padding: EdgeInsets.symmetric(vertical: 18.0),
            child: Center(
              child: Text(
                "no new news about mess",
                style: TextStyle(
                  color: Colors.black54,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          );
        }
      } else if (section == 3) {
        return const Padding(
          padding: EdgeInsets.symmetric(vertical: 18.0),
          child: Center(
            child: Text(
              "nothing to be worried about",
              style: TextStyle(
                color: Colors.black54,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        );
      }
      return const SizedBox.shrink();
    }

    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0.5,
      child: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            sectionHeader("Complaints", 1),
            sectionBody(1),
            const SizedBox(height: 16),
            if (expandedSection != 1) const Divider(),
            sectionHeader("Mess", 2),
            sectionBody(2),
            const SizedBox(height: 16),
            if (expandedSection != 2) const Divider(),
            sectionHeader(
              "Alerts",
              3,
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFE9EAFB),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  "0",
                  style: TextStyle(
                    color: usernameBlue,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
            ),
            sectionBody(3),
          ],
        ),
      ),
    );
  }
}
