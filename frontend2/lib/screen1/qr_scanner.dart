import 'package:flutter/material.dart';
import 'package:frontend1/widgets/login screen/googlesignin.dart';
import 'package:frontend1/apis/scan/qrscan_gala.dart';
import 'package:shared_preferences/shared_preferences.dart';



class QrScanner extends StatefulWidget {
  const QrScanner({Key? key}) : super(key: key);

  @override
  State<QrScanner> createState() => _MyAppState();
}

class _MyAppState extends State<QrScanner> {
  String name = '';

  @override
  void initState() {
    super.initState();
    getName();
  }

  Future<void> getName() async {
    final prefs = await SharedPreferences.getInstance();
    final name1 = prefs.getString('googleUsername') ?? 'Guest'; // Default to 'Guest' if no name is found
    setState(() {
      name = name1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Welcome Page',
      home: WelcomePage(name: name),
    );
  }
}

class WelcomePage extends StatelessWidget {
  final String name;

  const WelcomePage({Key? key, required this.name}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome'),
      ),
      body: Column(
        children: [
          Center(
            child: Text(
              'Welcome $name',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          IconButton(
              onPressed: () async {
                await signOut(context);
              },
              icon: Icon(Icons.close))
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const QrScangala(),
            ),
          );
        },
        backgroundColor: Colors.deepPurple,
        child: Icon(Icons.add),
      ),
    );
  }
}