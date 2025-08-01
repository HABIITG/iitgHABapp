import 'package:flutter/material.dart';
import 'package:frontend1/apis/scan/qrscan_mess.dart';
import 'package:frontend1/screen1/qr_scanner.dart';

class homescreen1 extends StatelessWidget {
  const homescreen1({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0), // Add padding for spacing
            child: Align(
              alignment: Alignment.topLeft,
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const QrScanner(),
                    ),
                  );
                },
                child: const SizedBox(
                  width: 150, // Set square width
                  height: 150, // Set square height
                  child: Text("GALA DINNER")
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0), // Add padding for spacing
            child: Align(
              alignment: Alignment.topLeft,
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const QrScanMess(),
                    ),
                  );
                },
                child: const SizedBox(
                  width: 150, // Set square width
                  height: 150, // Set square height
                  child: Text("MESS VERIFICATION")
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
