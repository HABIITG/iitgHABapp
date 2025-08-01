import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:frontend1/utilities/permission_handler/permission_handler.dart';
import 'package:frontend1/widgets/common/cornerQR.dart';
import 'package:frontend1/widgets/common/snack_bar.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:vibration/vibration.dart';

final dio = Dio();

class QrScanOld extends StatefulWidget {
  const QrScanOld({super.key});

  @override
  State<QrScanOld> createState() => _QrScanOldState();
}

class _QrScanOldState extends State<QrScanOld> {
  late MobileScannerController controller;
  bool _hasScanned = false;
  Map<String, dynamic>? displayData;

  @override
  void initState() {
    super.initState();
    controller = MobileScannerController();

    PermissionHandler().requestCameraPermission(() {
      controller.start();
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> fetchItemBySerialNumber(String qrCode) async {
    final url = "https://hab.codingclubiitg.in/api/qr/check";

    try {
      final response = await dio.put(
        url,
        data: {'qr_string': qrCode},
        options: Options(headers: {"Content-Type": "application/json"}),
      );

      if (response.statusCode == 200) {
        setState(() {
          displayData = response.data;
        });

        if (await Vibration.hasVibrator() ?? false) {
          Vibration.vibrate(duration: 100);
        }

        print("User details: $displayData");

        Future.delayed(Duration(seconds: 1), () {
          setState(() {
            displayData = null;
            _hasScanned = false;
          });
          controller.start();
        });
      } else if (response.statusCode == 400) {
        showSnackBar('QR has been used once', Colors.red, context);
      } else {
        showSnackBar('Failed to load item. Status code: ${response.statusCode}',
            Colors.red, context);
      }
    } catch (e) {
      showSnackBar('Something went wrong!', Colors.red, context);
    } finally {
      Future.delayed(Duration(seconds: 1), () {
        setState(() {
          _hasScanned = false;
        });
        controller.start();
      });
    }
  }

  void onBarcodeDetected(BarcodeCapture capture) {
    if (_hasScanned) return;
    _hasScanned = true;

    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final result = barcode.rawValue;
      if (result != null) {
        print('Barcode found: $result');
        fetchItemBySerialNumber(result);
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('QR Scanner')),
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
          if (displayData != null)
            Positioned(
              bottom: 50,
              left: 20,
              right: 20,
              child: Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  displayData.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 5,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// import 'package:flutter/material.dart';
// import 'package:frontend1/constants/themes.dart';
// import 'package:frontend1/screen1/qrdetails_gala.dart';
// import 'package:frontend1/widgets/common/snack_bar.dart';
// import 'package:mobile_scanner/mobile_scanner.dart';
// import 'package:frontend1/utilities/permission_handler/permission_handler.dart';
// import 'package:dio/dio.dart';
// import 'package:flutter_vibrate/flutter_vibrate.dart';
// import 'package:frontend1/widgets/common/cornerQR.dart';
//
// final dio = Dio();
//
// class QrScan extends StatefulWidget {
//   const QrScan({super.key});
//
//   @override
//   State<QrScan> createState() => _QrScanState();
// }
//
// class _QrScanState extends State<QrScan> {
//   late MobileScannerController controller;
//   bool _hasScanned = false;
//   Map<String, dynamic>? displayData; // Make it nullable and part of state
//
//   @override
//   void initState() {
//     super.initState();
//     controller = MobileScannerController();
//
//     // Request permission and start camera
//     PermissionHandler().requestCameraPermission(() {
//       controller.start();
//     });
//   }
//
//   @override
//   void dispose() {
//     controller.dispose();
//     super.dispose();
//   }
//
//   Future<void> fetchItemBySerialNumber(String qrCode) async {
//     final url = "https://hab.codingclubiitg.in/api/qr/check";
//
//     try {
//       final response = await dio.put(
//         url,
//         data: {'qr_string': qrCode}, // No need for jsonEncode
//         options: Options(headers: {"Content-Type": "application/json"}),
//       );
//
//       if (response.statusCode == 200) {
//         setState(() {
//           displayData = response.data; // Update state
//         });
//
//         if (await Vibrate.canVibrate) {
//           Vibrate.feedback(FeedbackType.success);
//         }
//
//         print("User details: $displayData");
//
//         // Reset scan flag for future scans
//         Future.delayed(Duration(seconds: 1), () {
//           setState(() {
//             displayData = null;
//             _hasScanned = false;
//           });
//           controller.start();
//         });
//
//       } else if (response.statusCode == 400) {
//         showSnackBar('QR has been used once',Colors.red, context);
//       } else {
//         showSnackBar('Failed to load item. Status code: ${response.statusCode}',Colors.red, context);
//       }
//     } catch (e) {
//       showSnackBar('somethink went wrong!',Colors.red, context);
//     }
//     finally {
//       Future.delayed(Duration(seconds: 1), () {
//         setState(() {
//           _hasScanned = false; // Reset flag
//         });
//         controller.start();
//       });
//     }
//   }
//
//   void onBarcodeDetected(BarcodeCapture capture) {
//     if (_hasScanned) return;
//     _hasScanned = true;
//
//     final List<Barcode> barcodes = capture.barcodes;
//     for (final barcode in barcodes) {
//       final result = barcode.rawValue;
//       if (result != null) {
//         print('Barcode found: $result');
//         fetchItemBySerialNumber(result);
//         break;
//       }
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('QR Scanner')),
//       body: Stack(
//         children: [
//           MobileScanner(
//             controller: controller,
//             onDetect: onBarcodeDetected,
//           ),
//           Center(
//             child: CustomPaint(
//               size: const Size(250, 250),
//               painter: CornerPainter(),
//             ),
//           ),
//           if (displayData != null)
//             Positioned(
//               bottom: 50,
//               left: 20,
//               right: 20,
//               child: Container(
//                 padding: EdgeInsets.all(16),
//                 decoration: BoxDecoration(
//                   color: Colors.green,
//                   borderRadius: BorderRadius.circular(10),
//                 ),
//                 child: Text(
//                   displayData.toString(),
//                   style: const TextStyle(
//                     color: Colors.white,
//                     fontSize: 16,
//                     fontWeight: FontWeight.bold,
//                   ),
//                   overflow: TextOverflow.ellipsis,
//                   maxLines: 5, // Prevents overflow
//                 ),
//               ),
//             ),
//         ],
//       ),
//     );
//   }
// }
