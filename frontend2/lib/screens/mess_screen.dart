import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend1/apis/scan/qrscan_old.dart';
import 'package:frontend1/screens/qr_scanner.dart';
import 'package:frontend1/widgets/common/DateTimeParser.dart';
import 'package:frontend1/widgets/common/popmenubutton.dart';
import 'package:frontend1/screens/mess_feedback/mess_feedback_page.dart';
import 'package:frontend1/widgets/mess_widgets/MessMenuBuilder.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../apis/mess/mess_menu.dart';
import '../models/mess_menu_model.dart';
import '../utilities/ComingSoon.dart';
import '../utilities/startupitem.dart';
import '../widgets/feedback/FeedBackCard.dart';
import '../widgets/mess_widgets/messmenu.dart';

class MessApp extends StatefulWidget {
  const MessApp({super.key});

  @override
  State<MessApp> createState() => _MessAppState();
}

class _MessAppState extends State<MessApp> {
  @override
  Widget build(BuildContext context) {
    return const MessScreen();
  }
}





class MessScreen extends StatefulWidget {
  const MessScreen({super.key});

  @override
  State<MessScreen> createState() => _MessScreenState();
}

String currSubscribedMess = '';




class _MessScreenState extends State<MessScreen> {
  Widget xbuildQuickActions() {
    const usernameBlue = Color(0xFF3754DB);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 18.0),
      child: Row(
        children: [
          // New Complaint Button
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
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Mess complaint",
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
          const SizedBox(width: 18),
          // Mess QR Button
          Expanded(
            child: InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: () {
                setState(() {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const QrScan(),
                    ),
                  );
                });

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
                      "Scan mess QR",
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


  @override
  void initState() {
    super.initState();
    fetchCurrSubscrMess();
  }

  Future<void> fetchCurrSubscrMess() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      currSubscribedMess = prefs.getString('curr_subscribed_mess') ?? '';
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context)
        .size; //To make sure everything fits as per device size
    return Scaffold(
      body: Container(
        color: Colors.white,// big bug
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: const TextSpan(
                    text: "MESS",
                    style: TextStyle(
                      fontFamily: 'OpenSans_regular',
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                      color: Colors.black,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                FeedbackCard(),
                const SizedBox(height: 20),
                xbuildQuickActions(),
                const SizedBox(height: 16),
                _MenuSection(),
                 const SizedBox(height: 20),
                _MessInfo(),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
}




class _MenuSection extends StatefulWidget {
  @override
  State<_MenuSection> createState() => _MenuSectionState();
}

 String copyMessID = '';

String selectedDay = 'Monday';//also default this to todayday

class _MenuSectionState extends State<_MenuSection> {


  final List<String> daysOnly = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  String messidcopy = '';

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text("What’s in Menu",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const Spacer(),
            HostelDrop(onChanged: (value){
              final hostelMap = Provider.of<MessInfoProvider>(context,listen: false).hostelMap;
               final MessID = hostelMap[value]?.messid ?? '6826dfda8493bb0870b10cbf';
                copyMessID =MessID;
              print("Mess ID for $value : $MessID");
            }),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 40,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: daysOnly.map((day) {
              return _DayChip(
                label: day,
                selected: selectedDay == day,
                onTap: () {
                  setState(() {
                    selectedDay = day;
                  });
                },
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 16),
        _MenuCard(),
        const SizedBox(height: 10),
      ],
    );
  }
}

class _DayChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _DayChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label,style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          fontFamily: 'OpenSans_regular',
        ),),
        selected: selected,
        onSelected: (_) => onTap(),
        selectedColor: Colors.deepPurple.shade100,
        labelStyle:
            TextStyle(color: selected ? Color(0xFF3754DB) : Colors.black),
      ),
    );
  }
}

class _MenuCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Consumer<MessInfoProvider>(
          builder: (context, messProvider, child) {
            // Get user's mess ID from SharedPreferences or provider
            return FutureBuilder<String?>(
              future: _getUserMessId(),
              builder: (context, snapshot) {
                return MenuFutureBuilder(
                  messId: copyMessID,
                  day: selectedDay,
                  userMessId: snapshot.data,
                );
              },
            );
          },
        ),
      ],
    );
  }

  Future<String?> _getUserMessId() async {
    final prefs = await SharedPreferences.getInstance();
    String messId = prefs.getString('messID') ?? '6826dfda8493bb0870b10cbf';
    return messId;
  }
}



class _MessInfo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Mess Info",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          const Text(
            "Caterer Name",
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
          const SizedBox(height: 4),
          Text(
            "fill below from shared prefs",
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const Divider(height: 32),
          Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    Text(
                      "rating",
                      style: const TextStyle(
                        fontSize: 24,
                        color: Color(0xFF3754DB),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text("Rating", style: TextStyle(fontSize: 12)),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  children: [
                    Text(
                      "rank",
                      style: const TextStyle(
                        fontSize: 24,
                        color: Color(0xFF3754DB),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text("Rank", style: TextStyle(fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
