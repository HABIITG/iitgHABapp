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
import 'package:shared_preferences/shared_preferences.dart';
import 'package:frontend1/utilities/notification_card.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

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
    SharedPreferences.getInstance().then((prefs) => {setState(() {
      storedNotifications = prefs.getStringList('notifications') ?? [];
      // Firebase Messaging setup
      FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
          print('📩 Foreground Notification');
          String? title = message.notification?.title ?? 'No Title';
          String? body = message.notification?.body ?? 'No Body';

          List<String> storedNotifications =
              prefs.getStringList('notifications') ?? [];

          storedNotifications.add('$title: $body');
          await prefs.setStringList('notifications', storedNotifications);
          setState(() {
            storedNotifications = prefs.getStringList('notifications') ?? [];
            //storedNotifications = stored;
          });
        });
      }
    )});
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
