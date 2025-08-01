import 'package:flutter/material.dart';
import 'package:pretty_qr_code/pretty_qr_code.dart';

class QRCodeScannerWithFrame extends StatelessWidget {
  final String qrData;

  QRCodeScannerWithFrame({required this.qrData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        alignment: Alignment.center,
        children: [
          // QR Code Scanner Background
          // Center Frame for Trapping Area
          Positioned(
            width: 200,
            height: 200,
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.greenAccent,
                  width: 4.0,
                ),
                borderRadius: BorderRadius.circular(0.0), // Set to 0 for a square shape
              ),
            ),
          ),
        ],
      ),
    );
  }
}
