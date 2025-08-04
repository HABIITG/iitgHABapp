// import 'package:flutter/material.dart';
// import 'package:frontend1/utilities/notification_card.dart';

// class NotificationScreen extends StatefulWidget {
//   const NotificationScreen({super.key});

//   @override
//   State<NotificationScreen> createState() => _NotificationScreenState();
// }

// class _NotificationScreenState extends State<NotificationScreen> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.grey[100],
//       appBar: AppBar(
//         elevation: 0,
//         backgroundColor: Colors.white,
//         leading: IconButton(
//           icon: Icon(Icons.close, color: Colors.black),
//           onPressed: () {
//             Navigator.pop(context); // Close the screen
//           },
//         ),
//         title: Text(
//           "Notifications",
//           style: TextStyle(
//             fontWeight: FontWeight.bold,
//             color: Colors.black,
//             fontSize: 20,
//           ),
//         ),
//         centerTitle: true,
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: ListView(
//           children: [
//             NotificationCard(
//               title: 'New Message',
//               subtitle: 'You have a new message from John',
//               description: 'Click to view the message details.',
//             ),
//             SizedBox(height: 12),
//             NotificationCard(
//               title: 'System Update',
//               subtitle: 'Your app has been updated to the latest version',
//               description: 'Check out the new features in this update.',
//             ),
//             SizedBox(height: 12),
//             NotificationCard(
//               title: 'Mess Menu Updated',
//               subtitle: 'August menu is now live!',
//               description: 'Tap to view the updated mess schedule.',
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:frontend1/utilities/notification_card.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.6,
        maxChildSize: 0.95,
        builder: (context, controller) {
          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      CircleAvatar(
                          radius: 20,
                          backgroundColor: Colors.blue[50],
                          child: Icon(Icons.notifications_none,
                              weight: 20, color: Colors.blue, size: 27)),
                      SizedBox(width: 8),
                      Text(
                        "Notifications",
                        style: Theme.of(context)
                            .textTheme
                            .headlineMedium
                            ?.copyWith(color: Colors.black, fontSize: 20
                                //fontWeight: FontWeight.w500,
                                ),
                      ),
                      Spacer(),
                      Container(
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,

                          color: Colors.grey[100],
                          //borderRadius: BorderRadius.circular(20),
                        ),
                        // color: Colors.grey[200],
                        child: Center(
                          child: IconButton(
                            icon: Icon(
                              Icons.close,
                              size: 26,
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Scrollable notification list
                Expanded(
                  child: ListView(
                    controller: controller,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    children: const [
                      // // Section 1: Complaints
                      // SectionHeader(title: "Complaints", count: 2),
                      // NotificationCard(
                      //   title: 'Complaint',
                      //   subtitle: 'No water in washroom WB - 05',
                      //   description: 'Click to view',
                      // ),
                      // NotificationCard(
                      //   title: 'Complaint',
                      //   subtitle: 'No water in washroom WB - 05',
                      //   description: 'Click to view',
                      // ),
                      // Section 2: Mess
                      SizedBox(height: 16),
                      //SectionHeader(title: "Mess", count: 2),
                      NotificationCard(
                        title: 'Mess',
                        subtitle: 'This month’s mess menu is live',
                        description: 'Tap to view details',
                      ),
                      NotificationCard(
                        title: 'Mess',
                        subtitle: 'This month’s mess menu is live',
                        description: 'Tap to view details',
                      ),
                      SizedBox(height: 20),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String title;
  final int count;

  const SectionHeader({required this.title, required this.count});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 12, bottom: 4),
      child: Row(
        children: [
          Icon(Icons.folder_open, color: Colors.orange, size: 18),
          SizedBox(width: 6),
          Text(
            "$title ",
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          Text("($count)", style: TextStyle(color: Colors.grey[600])),
        ],
      ),
    );
  }
}
