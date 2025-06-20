import 'package:flutter/material.dart';
import 'package:frontend1/constants/themes.dart';
import 'package:frontend1/screens/scan_status.dart';
import 'package:frontend1/widgets/common/snack_bar.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:frontend1/utilities/permission_handler/permission_handler.dart';
import 'package:dio/dio.dart';
import 'package:vibration/vibration.dart';
import 'package:frontend1/widgets/common/cornerQR.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend1/constants/endpoint.dart';

final dio = Dio();

class QrScan extends StatefulWidget {
  const QrScan({super.key});

  @override
  State<QrScan> createState() => _QrScanState();
}

class _QrScanState extends State<QrScan> {
  late MobileScannerController controller;
  bool _hasScanned = false;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    controller = MobileScannerController();

    // Request permission and start camera
    PermissionHandler().requestCameraPermission(() {
      controller.start();
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> scanMess(String messID) async {
    if (_isProcessing) return;

    setState(() {
      _isProcessing = true;
    });

    try {
      // Get user ID from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');
      final accessToken = prefs.getString('access_token');

      if (userId == null) {
        showSnackBar('User not logged in', Colors.red, context);
        return;
      }

      // Hardcoded mess ID for now
      //const messId = "6826dfda8493bb0870b10cbf";

      final url = "$baseUrl/mess/scan/$messID";

      final response = await dio.post(
        url,
        data: {
          // 'qr_string': qrCode,
          'userId': userId,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer $accessToken',
            'Content-Type': 'application/json',
          },
        ),
      );

      if (await Vibration.hasVibrator() ?? false) {
        Vibration.vibrate(duration: 100);
      }
      // Navigate to status page based on response
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => ScanStatusPage(
            response: response,
          ),
        ),
      ).then((_) {
        // Reset when coming back from status page
        setState(() {
          _hasScanned = false;
          _isProcessing = false;
        });
        controller.start();
      });

    } catch (e) {
      print('Error scanning: $e');
      String errorMessage = 'Unknown error';

      if (e is DioException) {
        if (e.response != null && e.response?.data != null) {
          // Extract backend message
          final data = e.response?.data;
          errorMessage = data['message'] ?? 'Server error';
          print("Backend error: ${e.response?.data}");
        } else {
          errorMessage = e.message ?? 'Network error';
          print("Network error: ${e.message}");
        }
      } else {
        errorMessage = e.toString();
      }

      // Navigate to error status page
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => ScanStatusPage(
            response: Response(
              requestOptions: RequestOptions(path: ''),
              statusCode: 500,
              data: {'message':  errorMessage},
            ),
          ),
        ),
      ).then((_) {
        setState(() {
          _hasScanned = false;
          _isProcessing = false;
        });
        controller.start();
      });
    }
  }

  void onBarcodeDetected(BarcodeCapture capture) {
    if (_hasScanned || _isProcessing) return;

    setState(() {
      _hasScanned = true;
    });

    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final result = barcode.rawValue;
      if (result != null) {
        print('Barcode found: $result');
        controller.stop(); // Stop scanning while processing
        scanMess(result);
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('Mess Scanner'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          // Camera view
          MobileScanner(
            controller: controller,
            onDetect: onBarcodeDetected,
          ),

          // Overlay content
          Column(
            children: [
              const SizedBox(height: 80),

              // "Ready to Eat? Scan to Enter" text with updated styling
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Row(
                        children: [
                          Text(
                            'Ready to Eat?',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 24,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const Text(
                            ' Scan',
                            style: TextStyle(
                              color: Color(0xFF4C4EDB),
                              fontSize: 24,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Text(
                      'to Enter',
                      style: TextStyle(
                        color: Color(0xFF4C4EDB),
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // QR Code frame
              Center(
                child: Container(
                  width: 250,
                  height: 250,
                  child: CustomPaint(
                    size: const Size(250, 250),
                    painter: CornerPainter(),
                  ),
                ),
              ),

              const SizedBox(height: 40),

              // Instruction text
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 40),
                child: Text(
                  'Hold your QR code steady within the frame',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),

          // Processing indicator
          if (_isProcessing)
            Container(
              color: Colors.black54,
              child: const Center(
                child: CircularProgressIndicator(
                  color: Color(0xFF4C4EDB),
                ),
              ),
            ),
        ],
      ),
    );
  }
}