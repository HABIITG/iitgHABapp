import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:frontend1/utilities/permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend1/apis/protected.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:vibration/vibration.dart';
import 'package:frontend1/widgets/common/cornerQR.dart';
import 'package:frontend1/constants/endpoint.dart';
import 'package:dio/dio.dart';

import '../../screen1/QrDetail.dart';


class QrScanMess extends StatefulWidget {
  const QrScanMess({super.key});

  @override
  State<QrScanMess> createState() => _QrScanState();
}

class _QrScanState extends State<QrScanMess> {
  late MobileScannerController controller;
  bool _hasScanned = false; // Flag to track if a scan has been processed VERY IMP CONCEPT like this happens it scans twice maybe idk

  @override
  void initState() {
    super.initState();
    controller = MobileScannerController();

    // Request permission and start the camera if granted
    PermissionHandler().requestCameraPermission(() {
      controller.start();
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<Map<String, dynamic>?> fetchItemBySerialNumber(String qrCode) async {
    final header = await getAccessToken();
    final dio = Dio();

    try {
      final response = await dio.get(
        "https://iitgcomplaintapp.onrender.com/api/users/roll/$qrCode",
        options: Options(
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer $header",
          },
        ),
      );

      if (response.statusCode == 200) {
        return response.data;
      } else if (response.statusCode == 404) {
        print('Item not found');
      } else {
        print('Failed to load item. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }


  // Handle QR code detection
  void onBarcodeDetected(BarcodeCapture capture) async {
    if (_hasScanned) return; // Prevent further processing if already scanned
    _hasScanned = true; // Set the flag to indicate processing has started

    try {
      final List<Barcode> barcodes = capture.barcodes;
      for (final barcode in barcodes) {
        final result = barcode.rawValue;
        if (result != null) {
          print('Barcode found: $result');
          controller.stop();

          // Fetch the item data using the serial number (barcode result)
          var itemData = await fetchItemBySerialNumber(result);
          if (itemData != null) {
            if (await Vibration.hasVibrator() ?? false) {
              Vibration.vibrate(duration: 100);
            }
            print(itemData);
            // Navigate to the details page with the fetched item data
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => QrDetail(itemData: itemData),
              ),
            );
          } else {
            print('Failed to fetch item data.');
          }
        } else {
          print('No QR code found.');
        }
      }
    } catch (e, stackTrace) {
      print('Error: $e');
      print(stackTrace);
    }

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('QR Scanner')),
      body: Stack(
        children: [
          MobileScanner(
            controller: controller,
            onDetect: onBarcodeDetected,
          ),
          Center(
            child: CustomPaint(
              size: const Size(250, 250),
              painter: CornerPainter(),
            ),
          ),
        ],
      ),
    );
  }
}

