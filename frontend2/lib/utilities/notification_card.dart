import 'package:flutter/material.dart';

class NotificationCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String description;

  const NotificationCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Expanded(
                child: Text(title,
                    style: Theme.of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(color: Colors.grey[600], fontSize: 14)),
              ),
              Icon(Icons.close, size: 16, color: Colors.grey),
            ]),
            Divider(color: Colors.grey[300], height: 16),
            SizedBox(height: 4),
            Text(subtitle, style: TextStyle(color: Colors.grey[700])),
            SizedBox(height: 12),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Notification tapped')),
                );
              },
              child: Row(
                children: [
                  Text("View  ",
                      style: TextStyle(color: Colors.blue, fontSize: 14)),
                  Icon(Icons.arrow_forward, size: 14, color: Colors.blue),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
