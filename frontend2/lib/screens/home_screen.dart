import 'dart:convert';
import 'package:flutter/material.dart';

import 'package:frontend1/constants/endpoint.dart';
import 'package:frontend1/screens/profile_screen.dart';
import 'package:frontend1/screens/qr_scanner.dart';
import 'package:frontend1/utilities/ComingSoon.dart';
import 'package:frontend1/widgets/mess_widgets/MessMenuBuilder.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:frontend1/widgets/common/name_trimmer.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http/http.dart' as http;
import 'package:frontend1/models/mess_menu_model.dart';
import 'package:frontend1/widgets/mess_widgets/messmenu.dart';
import 'package:provider/provider.dart';

import '../utilities/startupitem.dart';
import '../widgets/complaint_dropdown.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String name = '';
  int _selectedIndex = 0;
  bool feedbackform = true;
  String currSubscribedMess = '';
  String? token;

  @override
  void initState() {
    super.initState();
    fetchUserData();
    fetchMessIdAndToken();
  }

  Future<void> fetchUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final name1 = prefs.getString('name');
    if (name1 != null) {
      setState(() {
        name = (capitalizeWords(name1) ?? '').split(' ').first;
      });
    }
  }

  String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return "Good morning, ";
    } else if (hour < 18) {
      return "Good afternoon, ";
    } else {
      return "Good evening, ";
    }
  }


  Future<void> fetchMessIdAndToken() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      currSubscribedMess = prefs.getString('curr_subscribed_mess') ?? '';
      token = prefs.getString('access_token');
    });
  }

  void _onNavTap(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  // Add the missing getTodayDay method
  String getTodayDay() {
    final now = DateTime.now();
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    return days[now.weekday - 1];
  }

  Widget buildQuickActions() {
    const usernameBlue = Color(0xFF3754DB);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 18.0),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ComingSoonScreen(),
                  ),
                );
              },
              child: Container(
                height: 90,
                decoration: BoxDecoration(
                  color: const Color(0xFFF6F6F6),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SvgPicture.asset(
                      'assets/icon/complaint.svg',
                      width: 32,
                      height: 32,
                      color: const Color(0xFF3754DB),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "New Complaint",
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w500,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const QrScan()),
                );
              },
              child: Container(
                height: 90,
                decoration: BoxDecoration(
                  color: const Color(0xFFF6F6F6),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SvgPicture.asset(
                      'assets/icon/qrscan.svg',
                      width: 32,
                      height: 32,
                      color: const Color(0xFF3754DB),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Scan Mess QR",
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w500,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildMessTodayCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 2),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                "In Mess Today",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              Text(
                "Go to Mess",
                style: TextStyle(
                  color: Color(0xFF3754DB),
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Consumer<MessInfoProvider>(
          builder: (context, messProvider, child) {
            // Fixed null safety issues
            if (messProvider.isLoading) {
              return const Card(
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(24)),
                  side: BorderSide(color: Color(0xC5C5D1), width: 1),
                ),
                elevation: 0.5,
                child: Padding(
                  padding: EdgeInsets.all(18.0),
                  child: Center(child: CircularProgressIndicator()),
                ),
              );
            }

            final hostelData = messProvider.hostelMap[currSubscribedMess];
            final messId = hostelData?.messid ?? '6826dfda8493bb0870b10cbf';

            return MenuFutureBuilder(
              messId: messId,
              day: getTodayDay(),
            );
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    const usernameBlue = Color(0xFF3754DB);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: Padding(
          padding: const EdgeInsets.only(left: 15.0),
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ProfileScreen()),
              );
            },
            child: const CircleAvatar(
              backgroundColor: Color(0xFFEFEFEF),
              radius: 18,
            ),
          ),
        ),
        title: const SizedBox.shrink(),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16, top: 10),
            child: Image.asset(
              "assets/images/Handlogo.png",
              width: 36,
              height: 36,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0,),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 13.5),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: getGreeting(),
                      style: const TextStyle(
                        fontFamily: 'OpenSans_regular',
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    TextSpan(
                      text: name.isNotEmpty ? name : 'User',
                      style: const TextStyle(
                        fontFamily: 'OpenSans_bold',
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                        color: usernameBlue,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "No notifications need your attention",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 24),
              ComplaintsCard(feedbackform: feedbackform,),
              buildQuickActions(),
              buildMessTodayCard(),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
