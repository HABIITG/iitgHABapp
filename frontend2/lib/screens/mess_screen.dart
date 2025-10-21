import 'package:flutter/material.dart';
import 'package:frontend2/providers/hostels.dart';
import 'package:frontend2/widgets/common/popmenubutton.dart';
import 'package:frontend2/widgets/feedback/FeedBackCard.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utilities/startupitem.dart';
import '../widgets/mess_widgets/horizontal_menu_builder.dart';
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
  bool _isLoading = true;

  String caterername = '';
  int? rating;
  int? rank;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await fetchCurrSubscrMess();
    await fetchMessInfo();
    setState(() {
      _isLoading = false; // Only now we render
    });

    print("Mess name: $caterername");
    print("Rating: $rating");
    print("Rank: $rank");
  }

  Future<void> fetchCurrSubscrMess() async {
    final prefs = await SharedPreferences.getInstance();
    currSubscribedMess = prefs.getString('curr_subscribed_mess') ?? '';
  }

  Future<void> fetchMessInfo() async {
    final prefs = await SharedPreferences.getInstance();
    caterername = prefs.getString('messName') ?? '';
    rating = prefs.getInt('rating') ?? 0;
    rank = prefs.getInt('ranking') ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Colors.white, // Force correct bg
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white, // Avoid blue flicker
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: SingleChildScrollView(
                // constraints: BoxConstraints(
                //   minHeight: constraints.maxHeight,
                // ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Mess",
                          style: TextStyle(
                            fontFamily: 'OpenSans_regular',
                            fontSize: 32,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF2E2F31),
                          ),
                        ),
                        const SizedBox(height: 18),
                        _MenuSection(),
                        // const SizedBox(height: 24),
                      ],
                    ),
                    // Column(
                    //   children: [
                    //     _MessInfo(
                    //       catererName: caterername,
                    //       rating: rating,
                    //       rank: rank,
                    //     ),
                    //     const SizedBox(height: 30),
                    //   ],
                    // ),
                  ],
                ),
              ),
            );
          },
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

  late final hostelMap;

  String selectedHostel = HostelsNotifier.userHostel.isNotEmpty?HostelsNotifier.userHostel:(HostelsNotifier.hostels.isNotEmpty?HostelsNotifier.hostels[0]:"");

  @override
  void initState() {
    hostelMap = Provider.of<MessInfoProvider>(context, listen: false).hostelMap;
    print("Selected Hostel rn: $selectedHostel");
    // HostelsNotifier.init();
    HostelsNotifier.addOnChange(
      () {
        setState(() {
          selectedHostel = HostelsNotifier.userHostel;
          messId = hostelMap[selectedHostel]?.messid ?? '6826dfda8493bb0870b10cbf';
        });
      },
    );
    super.initState();
    selectedDay = DateFormat('EEEE').format(DateTime.now()); // default to today
    // default messId from provider
    messId = hostelMap.values.isNotEmpty
        ? hostelMap.values.first.messid
        : '68552b70491f1303d2c4dbcc';
  }

  void _updateMessId(String hostelName) {
    // print(hostelName);
    final id = hostelMap[hostelName]?.messid ?? '6826dfda8493bb0870b10cbf';
    setState(() {
      selectedHostel = hostelName;
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
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (DateTime.now().day >= 27)
            FeedbackCard(),
          const SizedBox(height: 24),
          Row(
            children: [
              const Text(
                "What's in Menu",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500, color: Color(0xFF676767)),
              ),
              const Spacer(),
              // MessDropdown(selectedOption: "Barak", onChanged: (s) {print(s);},),
              HostelDrop(selectedHostel: selectedHostel, onChanged: _updateMessId),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 36,
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
          SingleChildScrollView(
            child: SizedBox(
              child: Column(
                children: [
                  const SizedBox(height: 12),
                  // _MenuCard(
                  //   messId: messId,
                  //   day: selectedDay,
                  // ),
                  
                  _MealWrapper(meal: 'Breakfast', messId: messId, day: selectedDay),
                  _MealWrapper(meal: 'Lunch', messId: messId, day: selectedDay),
                  _MealWrapper(meal: 'Dinner', messId: messId, day: selectedDay),
              
                  const SizedBox(height: 24),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.info_outline, size: 16, color: Color(0xFF676767),),
                      SizedBox(width: 2,),
                      Text("Tap on a food item to mark as favourite", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF676767)),),
                    ],
                  ),
                ],
              ),
            ),
          )
        ],
      ),
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
      child: InkWell(
        onTap: onTap,
        focusColor: Colors.transparent,
        splashColor: Colors.transparent,
        hoverColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            color: selected ? const Color(0xFFEDEDFB) : const Color(0xFFF5F5F5),
          ),
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
          child: Text(label, style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            fontFamily: 'OpenSans_regular',
            color: selected ? const Color(0xFF4C4EDB) : const Color(0xFF676767),
          ),),
        ),
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