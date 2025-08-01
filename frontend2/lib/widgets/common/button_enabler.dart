import 'package:flutter/material.dart';

class EnableButtonExample extends StatelessWidget {
  const EnableButtonExample({super.key});

  @override
  Widget build(BuildContext context) {
    final DateTime now = DateTime.now();
    final bool isButtonEnabled = now.weekday >= DateTime.monday && now.weekday <= DateTime.wednesday;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton(
          onPressed: isButtonEnabled
              ? () {
            // Action when the button is pressed
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Button Pressed!')),
            );
          }
              : null, // Button is disabled if null
          child: const Text('Press Me'),
        ),
        const SizedBox(height: 20),
        Text(
          isButtonEnabled
              ? 'The button is enabled today!'
              : 'The button is disabled today!',
          style: const TextStyle(fontSize: 16),
        ),
      ],
    );
  }
}
