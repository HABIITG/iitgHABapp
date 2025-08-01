import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:frontend/utilities/permissionhandle/handler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/apis/protected.dart';
import 'package:flutter_vibrate/flutter_vibrate.dart';
import 'package:frontend/widgets/common/cornerQR.dart';
import 'package:frontend/constants/endpoints.dart';
import '../../screens/qr_detail.dart';

class QrScan extends StatefulWidget {
  const QrScan({super.key});

  @override
  State<QrScan> createState() => _QrScanState();
}

class _QrScanState extends State<QrScan> {
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
    final url = Uri.parse('${itemEndpoint.getitem}$qrCode');

    try {
      final response = await http.get(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $header",
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        return data;
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

    final List<Barcode> barcodes = capture.barcodes;

    for (final barcode in barcodes) {
      final result = barcode.rawValue;
      if (result != null) {
        print('Barcode found: $result');
        controller.stop();

        // Fetch the item data using the serial number (barcode result)
        var itemData = await fetchItemBySerialNumber(result);
        if (itemData != null) {
          if (await Vibrate.canVibrate) {
            Vibrate.feedback(FeedbackType.success);
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
              size: Size(250, 250),
              painter: CornerPainter(),
            ),
          ),
        ],
      ),
    );
  }
}


