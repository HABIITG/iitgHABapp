import 'package:flutter/material.dart';
import 'package:frontend1/constants/themes.dart';
import 'package:frontend1/screens/scan_status.dart';
import 'package:frontend1/widgets/common/snack_bar.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:permission_handler/permission_handler.dart';
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
  bool _cameraPermissionGranted = false;

  @override
  void initState() {
    super.initState();
    controller = MobileScannerController();
    _checkPermission();
  }

  Future<void> _checkPermission() async {
    var status = await Permission.camera.status;
    if (status.isGranted) {
      setState(() => _cameraPermissionGranted = true);
      controller.start();
    } else {
      var result = await Permission.camera.request();
      if (result.isGranted) {
        setState(() => _cameraPermissionGranted = true);
        controller.start();
      } else {
        setState(() => _cameraPermissionGranted = false);
      }
    }
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
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');
      final accessToken = prefs.getString('access_token');

      if (userId == null) {
        showSnackBar('User not logged in', Colors.red, context);
        return;
      }

      final url = "$baseUrl/mess/scan/$messID";

      final response = await dio.post(
        url,
        data: {
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

      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => ScanStatusPage(response: response),
        ),
      ).then((_) {
        setState(() {
          _hasScanned = false;
          _isProcessing = false;
        });
        controller.start();
      });

    } catch (e) {
      String errorMessage = 'Unknown error';
      if (e is DioException) {
        if (e.response != null && e.response?.data != null) {
          final data = e.response?.data;
          errorMessage = data['message'] ?? 'Server error';
        } else {
          errorMessage = e.message ?? 'Network error';
        }
      } else {
        errorMessage = e.toString();
      }

      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => ScanStatusPage(
            response: Response(
              requestOptions: RequestOptions(path: ''),
              statusCode: 500,
              data: {'message': errorMessage},
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

    for (final barcode in capture.barcodes) {
      final result = barcode.rawValue;
      if (result != null) {
        controller.stop();
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
      body: !_cameraPermissionGranted
          ? _buildPermissionOverlay()
          : Stack(
              children: [
                MobileScanner(
                  controller: controller,
                  onDetect: onBarcodeDetected,
                ),
                _buildScannerUI(),
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

  Widget _buildPermissionOverlay() {
    return Container(
      color: Colors.black,
      child: Center(
        child: ElevatedButton(
          onPressed: _checkPermission,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF4C4EDB),
            foregroundColor: Colors.white,
          ),
          child: const Text('Grant Camera Access'),
        ),
      ),
    );
  }

  Widget _buildScannerUI() {
    return Column(
      children: [
        const SizedBox(height: 80),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
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
        Center(
          child: SizedBox(
            width: 250,
            height: 250,
            child: CustomPaint(
              size: const Size(250, 250),
              painter: CornerPainter(),
            ),
          ),
        ),
        const SizedBox(height: 40),
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
    );
  }
}
