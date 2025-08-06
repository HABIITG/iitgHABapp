// import 'package:flutter/material.dart';
// import 'package:frontend1/utilities/notification_card.dart';

// class NotificationScreen extends StatelessWidget {
//   const NotificationScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.transparent,
//       body: DraggableScrollableSheet(
//         initialChildSize: 0.85,
//         minChildSize: 0.6,
//         maxChildSize: 0.95,
//         builder: (context, controller) {
//           return Container(
//             decoration: BoxDecoration(
//               color: Colors.white,
//               borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
//             ),
//             child: Column(
//               children: [
//                 Padding(
//                   padding:
//                       const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//                   child: Row(
//                     children: [
//                       CircleAvatar(
//                           radius: 20,
//                           backgroundColor: Colors.blue[50],
//                           child: Icon(Icons.notifications_none,
//                               weight: 20, color: Colors.blue, size: 27)),
//                       SizedBox(width: 8),
//                       Text(
//                         "Notifications",
//                         style: Theme.of(context)
//                             .textTheme
//                             .headlineMedium
//                             ?.copyWith(color: Colors.black, fontSize: 20
//                                 //fontWeight: FontWeight.w500,
//                                 ),
//                       ),
//                       Spacer(),
//                       Container(
//                         height: 40,
//                         decoration: BoxDecoration(
//                           shape: BoxShape.circle,

//                           color: Colors.grey[100],
//                           //borderRadius: BorderRadius.circular(20),
//                         ),
//                         // color: Colors.grey[200],
//                         child: Center(
//                           child: IconButton(
//                             icon: Icon(
//                               Icons.close,
//                               size: 26,
//                             ),
//                             onPressed: () => Navigator.pop(context),
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//                 // Scrollable notification list
//                 Expanded(
//                   child: ListView(
//                     controller: controller,
//                     padding: const EdgeInsets.symmetric(horizontal: 16),
//                     children: const [
//                       // // Section 1: Complaints
//                       // SectionHeader(title: "Complaints", count: 2),
//                       // NotificationCard(
//                       //   title: 'Complaint',
//                       //   subtitle: 'No water in washroom WB - 05',
//                       //   description: 'Click to view',
//                       // ),
//                       // NotificationCard(
//                       //   title: 'Complaint',
//                       //   subtitle: 'No water in washroom WB - 05',
//                       //   description: 'Click to view',
//                       // ),
//                       // Section 2: Mess
//                       SizedBox(height: 16),
//                       //SectionHeader(title: "Mess", count: 2),
//                       NotificationCard(
//                         title: 'Mess',
//                         subtitle: 'This month’s mess menu is live',
//                         description: 'Tap to view details',
//                       ),
//                       NotificationCard(
//                         title: 'Mess',
//                         subtitle: 'This month’s mess menu is live',
//                         description: 'Tap to view details',
//                       ),
//                       SizedBox(height: 20),
//                     ],
//                   ),
//                 ),
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }

// class SectionHeader extends StatelessWidget {
//   final String title;
//   final int count;

//   const SectionHeader({required this.title, required this.count});

//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.only(top: 12, bottom: 4),
//       child: Row(
//         children: [
//           Icon(Icons.folder_open, color: Colors.orange, size: 18),
//           SizedBox(width: 6),
//           Text(
//             "$title ",
//             style: TextStyle(fontWeight: FontWeight.bold),
//           ),
//           Text("($count)", style: TextStyle(color: Colors.grey[600])),
//         ],
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:frontend1/utilities/notification_card.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<String> storedNotifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    // 🔧 Only add if empty, so you don't duplicate on hot reload
    // List<String> stored = prefs.getStringList('notifications') ?? [];
    // if (stored.isEmpty) {
    //   stored.addAll([
    //     'Mess: August mess menu is live',
    //     'Update: New version of the app is available',
    //   ]);
    //   await prefs.setStringList('notifications', stored);
    // }

    setState(() {
      storedNotifications = prefs.getStringList('notifications') ?? [];
      //storedNotifications = stored;
    });
  }

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
                // Header
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: Colors.blue[50],
                        child: Icon(Icons.notifications_none,
                            color: Colors.blue, size: 27),
                      ),
                      SizedBox(width: 8),
                      Text(
                        "Notifications",
                        style: Theme.of(context)
                            .textTheme
                            .headlineMedium
                            ?.copyWith(color: Colors.black, fontSize: 20),
                      ),
                      Spacer(),
                      IconButton(
                        icon: Icon(Icons.close, size: 26),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),

                // List of notifications
                Expanded(
                  child: storedNotifications.isEmpty
                      ? Center(
                          child: Text(
                            'No notifications yet.',
                            style: TextStyle(color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          controller: controller,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: storedNotifications.length,
                          itemBuilder: (context, index) {
                            final notif = storedNotifications.reversed
                                .toList()[index]; // recent first
                            final parts = notif.split(':');
                            final title = parts.first.trim();
                            final subtitle = parts.length > 1
                                ? parts.sublist(1).join(':').trim()
                                : 'No details';

                            return Column(
                              children: [
                                NotificationCard(
                                  title: title,
                                  subtitle: subtitle,
                                  description: 'Tap to view details',
                                ),
                                SizedBox(height: 12),
                              ],
                            );
                          },
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
