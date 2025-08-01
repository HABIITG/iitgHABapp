import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class messcard extends StatefulWidget {
  @override
  State<messcard> createState() => _messcardState();
}

class _messcardState extends State<messcard> {
  String rollNumber = '';

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getRoll();
  }


  Future<void> getRoll() async {
    final prefs = await SharedPreferences.getInstance();
    String storedRoll = prefs.getString('rollNumber') ?? "Not available";

    setState(() {
      rollNumber = storedRoll;
    });
  }

  @override
  Widget build(BuildContext context) {
    //here we are using roll Number as a QRcode for getting details in frontend
    String url = rollNumber;

    return Scaffold(
      appBar: AppBar(title: Text("QR Code")),
      body: Center(
        child: rollNumber.isEmpty
            ? CircularProgressIndicator() // Show loading indicator while fetching data
            : QrImageView(
          data: url, // QR Code contains the GET request URL
          version: QrVersions.auto,
          size: 400.0,
        ),
      ),
    );
  }
}
