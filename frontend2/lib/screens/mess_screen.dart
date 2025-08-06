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
import '../widgets/mess_widgets/horizontal_menu_builder.dart';
import '../widgets/mess_widgets/messmenu.dart';
import 'package:intl/intl.dart';

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

  @override
  void initState() {
    super.initState();
    fetchCurrSubscrMess();
    fetchMessInfo();

  }

  Future<void> fetchCurrSubscrMess() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      currSubscribedMess = prefs.getString('curr_subscribed_mess') ?? '';
    });
  }



  String caterername = '';
  int? rating;
  int? rank;

  Future<void> fetchMessInfo() async {
    final prefs = await SharedPreferences.getInstance();

    setState(() {
      caterername = prefs.getString('messName') ?? '';
      rating = prefs.getInt('rating') ?? 0;
      rank = prefs.getInt('ranking') ?? 0;
    });

    print("Mess name: $caterername");
    print("Rating: $rating");
    print("Rank: $rank");
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
                const SizedBox(height: 16),
                _MenuSection(),
                const SizedBox(height: 20),
                _MessInfo(
                  catererName: caterername,
                  rating: rating,
                  rank: rank,
                ),
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

  late String messId;
  late String selectedDay;

  @override
  void initState() {
    super.initState();
    selectedDay = DateFormat('EEEE').format(DateTime.now()); // default to today
    // default messId from provider
    final hostelMap = Provider.of<MessInfoProvider>(context, listen: false).hostelMap;
    messId = hostelMap.values.isNotEmpty
        ? hostelMap.values.first.messid
        : '6826dfda8493bb0870b10cbf';
  }

  void _updateMessId(String hostelName) {
    final hostelMap = Provider.of<MessInfoProvider>(context, listen: false).hostelMap;
    final id = hostelMap[hostelName]?.messid ?? '6826dfda8493bb0870b10cbf';
    setState(() {
      messId = id;
    });
  }

  void _updateDay(String day) {
    setState(() {
      selectedDay = day;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text(
              "What’s in Menu",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            HostelDrop(onChanged: _updateMessId),
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
                onTap: () => _updateDay(day),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 16),
        _MenuCard(
          messId: messId,
          day: selectedDay,
        ),
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
        label: Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            fontFamily: 'OpenSans_regular',
          ),
        ),
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
  final String messId;
  final String day;

  const _MenuCard({required this.messId, required this.day});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _MealWrapper(meal: 'Breakfast', messId: messId, day: day),
        _MealWrapper(meal: 'Lunch', messId: messId, day: day),
        _MealWrapper(meal: 'Dinner', messId: messId, day: day),
      ],
    );
  }
}

class _MealWrapper extends StatelessWidget {
  final String meal;
  final String messId;
  final String day;

  const _MealWrapper({
    required this.meal,
    required this.messId,
    required this.day,
  });

  Future<String?> _getUserMessId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('messID') ?? '';
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: _getUserMessId(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Padding(
            padding: EdgeInsets.all(12),
            child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
          );
        }
        final userMessId = snapshot.data ?? '';
        return HorizontalMenuBuilder(
          messId: messId,
          day: day,
          userMessId: userMessId,
          mealType: meal,
        );
      },
    );
  }
}







class _MessInfo extends StatelessWidget {
  final String catererName;
  final int? rating;
  final int? rank;

  const _MessInfo({
    required this.catererName,
    required this.rating,
    required this.rank,
  });

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
            catererName,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const Divider(height: 32),
          Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    Text(
                      rating?.toString() ?? "N/A",
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
                      rank?.toString() ?? "N/A",
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