// import 'package:flutter/material.dart';
// import 'package:frontend2/utilities/notification_card.dart';

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
import 'package:frontend1/utilities/Notifier.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: NotificationNotifier.notifier,
      builder: (context, storedNotifications, child) => Scaffold(
        backgroundColor: Colors.transparent,
        body: DraggableScrollableSheet(
          initialChildSize: 0.85,
          minChildSize: 0.6,
          maxChildSize: 0.95,
          builder: (context, controller) {
            return Container(
              decoration: const BoxDecoration(
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
                          child: const Icon(Icons.notifications_none,
                              color: Colors.blue, size: 27),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          "Notifications",
                          style: Theme.of(context)
                              .textTheme
                              .headlineMedium
                              ?.copyWith(color: Colors.black, fontSize: 20),
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.close, size: 26),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),

                  // List of notifications
                  Expanded(
                    child: storedNotifications.isEmpty
                        ? const Center(
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
                                  const SizedBox(height: 12),
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
      ),
    );
  }
}
