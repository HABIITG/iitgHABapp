import 'package:flutter/material.dart';
import 'package:frontend1/screens/notification.dart';

import '../screens/mess_feedback/mess_feedback_page.dart';

class ComplaintsCard extends StatefulWidget {
  const ComplaintsCard(
      {super.key, this.feedbackform = false, this.daysLeft = 2});
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
      return Row(
        children: [
          CircleAvatar(
              radius: 12,
              backgroundColor: Colors.red[50],
              child: Icon(Icons.warning_amber_outlined,
                  weight: 20, color: Colors.red[800], size: 16)),
          SizedBox(
            width: 12,
          ),

          Text(title,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.red[800],
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  )),

          if (trailing != null) ...[const SizedBox(width: 6), trailing],
          // const Spacer(),
          // Icon(
          //   expandedSection == section
          //       ? Icons.keyboard_arrow_up_rounded
          //       : Icons.keyboard_arrow_down_rounded,
          //   color: Colors.black38,
          // ),
        ],
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
                      backgroundColor: Colors.redAccent,
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

    return Column(
      children: [
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.red[800]!, width: 0.5)),
          elevation: 0.5,
          child: Padding(
            padding: const EdgeInsets.all(18.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                //sectionHeader("Complaints", 1),
                //sectionBody(1),
                //const SizedBox(height: 16),
                //if (expandedSection != 1) const Divider(),
                //sectionHeader("Mess", 2),
                //sectionBody(2),
                //const SizedBox(height: 16),
                //if (expandedSection != 2)
                //const Divider(),

                sectionHeader(
                  "Alerts",
                  3,
                ),
                //sectionBody(3),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 18.0),
                  child: Center(
                    child: Text(
                      "nothing to be worried about",
                      style: TextStyle(
                        //color: Colors.red,
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
        GestureDetector(
          onTap: () {
            // Navigator.of(context).push(PageRouteBuilder(
            //   transitionDuration: Duration(milliseconds: 800),
            //   pageBuilder: (context, animation, secondaryAnimation) =>
            //       NotificationScreen(),
            //   transitionsBuilder:
            //       (context, animation, secondaryAnimation, child) {
            //     final tween = Tween(begin: Offset(0, 1), end: Offset.zero)
            //         .chain(CurveTween(curve: Curves.easeOutCubic));

            //     return SlideTransition(
            //       position: animation.drive(tween),
            //       child: child,
            //     );
            //   },
            // ));
            showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (context) => NotificationScreen(),
            );
          },
          child: Card(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              //side: BorderSide(color: Colors.red, width: 0.5)
            ),
            elevation: 0.5,
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: Row(
                children: [
                  CircleAvatar(
                      radius: 12,
                      backgroundColor: Colors.blue[50],
                      child: Icon(Icons.notifications_none,
                          weight: 20, color: Colors.blue, size: 16)),
                  SizedBox(
                    width: 12,
                  ),
                  Text("Notifications",
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            //color: Colors.red,
                            fontWeight: FontWeight.w500,
                            fontSize: 16,
                          )),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
