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
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text("What’s in Menu",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const Spacer(),
              HostelDrop(onChanged: (value) {
                final hostelMap = Provider.of<MessInfoProvider>(context, listen: false).hostelMap;
                final MessID = hostelMap[value]?.messid ?? '6826dfda8493bb0870b10cbf';
                copyMessID = MessID;
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
//
// class _MenuCard extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return IntrinsicHeight(
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Consumer<MessInfoProvider>(
//             builder: (context, messProvider, child) {
//               return FutureBuilder<String?>(
//                 future: _getUserMessId(),
//                 builder: (context, snapshot) {
//                   return HorizontalMenuBuilder(
//                     // Changed from MenuFutureBuilder
//                     messId: copyMessID,
//                     day: selectedDay,
//                     userMessId: snapshot.data,
//                   );
//                 },
//               );
//             },
//           ),
//         ],
//       ),
//     );
//   }
//
//   Future<String?> _getUserMessId() async {
//     final prefs = await SharedPreferences.getInstance();
//     String messId = prefs.getString('messID') ?? '6826dfda8493bb0870b10cbf';
//     return messId;
//   }
// }


// class _MenuCardState extends State<_MenuCard> {
//   int? _openDropdownIndex;
//
//   @override
//   void initState() {
//     super.initState();
//     _openDropdownIndex = 0; // Open first dropdown by default
//   }
//
//   void _toggleDropdown(int index) {
//     setState(() {
//       _openDropdownIndex = _openDropdownIndex == index ? null : index;
//     });
//   }
//
//   Widget _buildDropdown(int index, String title) {
//     final bool isOpen = _openDropdownIndex == index;
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.stretch,
//       children: [
//         // ElevatedButton(
//         //   onPressed: () => _toggleDropdown(index),
//         //   style: ElevatedButton.styleFrom(
//         //     backgroundColor: const Color(0xFFFFFFFF),
//         //     elevation: 0,
//         //     shape: RoundedRectangleBorder(
//         //       borderRadius: BorderRadius.circular(10),
//         //       side: BorderSide(
//         //         color: const Color(0xFFB8B8B8),
//         //         width: 1
//         //       ),
//         //     ),
//         //   ),
//         // child: Row(
//         //         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//         //         children: [
//         //           Text(title, style: TextStyle(color: const Color(0xFF2C2C2C))),
//         //           Icon(
//         //             isOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
//         //             color: const Color(0xFF2C2C2C),
//         //           ),
//         //         ],
//         //       ),
//         //     ),
//       Container(
//         decoration: BoxDecoration(
//           borderRadius: BorderRadius.circular(10),
//           border: Border(
//             top: BorderSide(color: Color(0xFFB8B8B8), width: 1),
//             left: BorderSide(color: Color(0xFFB8B8B8), width: 1),
//             right: BorderSide(color: Color(0xFFB8B8B8), width: 1),
//             bottom: _openDropdownIndex == index
//                 ? BorderSide.none
//                 : BorderSide(color: Color(0xFFB8B8B8), width: 1),
//           ),
//         ),
//         child: ElevatedButton(
//           onPressed: () => _toggleDropdown(index),
//           style: ElevatedButton.styleFrom(
//             backgroundColor: Color(0xFFFFFFFF),
//             elevation: 0,
//             shape: RoundedRectangleBorder(
//               borderRadius: BorderRadius.circular(10),
//               // Remove 'side' here to avoid conflict
//             ),
//           ),
//           child: Text("Dropdown Button"),
//         ),
//       ),
//         if (isOpen)
//           Container(
//             margin: EdgeInsets.only(bottom: 10),
//             padding: EdgeInsets.all(10),
//             decoration: BoxDecoration(
//               // color: Colors.grey[200],
//               borderRadius: BorderRadius.circular(10),
//               border: Border(
//                 bottom: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
//                 left: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
//                 right: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
//               ),
//             ),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: List.generate(5, (_) => Text('abc')),
//             ),
//           ),
//       ],
//     );
//   }






//
// class _MenuCard extends StatefulWidget {
//   @override
//   State<_MenuCard> createState() => _MenuCardState();
// }
//
// class _MenuCardState extends State<_MenuCard> {
//   int? _openDropdownIndex;
//
//   @override
//   void initState() {
//     super.initState();
//     _openDropdownIndex = 0; // Open first dropdown by default
//   }
//
//   void _toggleDropdown(int index) {
//     setState(() {
//       _openDropdownIndex = _openDropdownIndex == index ? null : index;
//     });
//   }
//
//   Widget _buildDropdown(int index, String title) {
//     final bool isOpen = _openDropdownIndex == index;
//
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.stretch,
//       children: [
//         Container(
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(10),
//             border: Border(
//               top: BorderSide(color: Color(0xFFB8B8B8), width: 1),
//               left: BorderSide(color: Color(0xFFB8B8B8), width: 1),
//               right: BorderSide(color: Color(0xFFB8B8B8), width: 1),
//               bottom: isOpen
//                   ? BorderSide.none
//                   : BorderSide(color: Color(0xFFB8B8B8), width: 1),
//             ),
//           ),
//           child: ElevatedButton(
//             onPressed: () => _toggleDropdown(index),
//             style: ElevatedButton.styleFrom(
//               backgroundColor: Color(0xFFFFFFFF),
//               elevation: 0,
//               shape: RoundedRectangleBorder(
//                 borderRadius: BorderRadius.circular(10),
//               ),
//             ),
//             child: Text("Dropdown Button $index"),
//           ),
//         ),
//
//         /// Animated Expanding Section
//         AnimatedContainer(
//           duration: Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//           height: isOpen ? 120 : 0,
//           padding: EdgeInsets.symmetric(horizontal: 10),
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.only(
//               bottomLeft: Radius.circular(10),
//               bottomRight: Radius.circular(10),
//             ),
//             border: Border(
//               bottom: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
//               left: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
//               right: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
//             ),
//           ),
//           child: Visibility(
//             visible: isOpen,
//             maintainState: true,
//             maintainAnimation: true,
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: List.generate(5, (_) => Text('abc')),
//             ),
//           ),
//         ),
//
//         SizedBox(height: 10),
//       ],
//     );
//   }
//
//   Future<String?> _getUserMessId() async {
//     final prefs = await SharedPreferences.getInstance();
//     return prefs.getString('messID') ?? 'xyz';
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return IntrinsicHeight(
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           _buildDropdown(0, 'Breakfast'),
//           SizedBox(height: 8),
//           _buildDropdown(1, 'Lunch'),
//           SizedBox(height: 8),
//           _buildDropdown(2, 'Dinner'),
//           SizedBox(height: 16),
//           Consumer<MessInfoProvider>(
//             builder: (context, messProvider, child) {
//               return FutureBuilder<String?>(
//                 future: _getUserMessId(),
//                 builder: (context, snapshot) {
//                   return HorizontalMenuBuilder(
//                     messId: copyMessID,
//                     day: selectedDay,
//                     userMessId: snapshot.data,
//                   );
//                 },
//               );
//             },
//           ),
//         ],
//       ),
//     );
//   }
// }




class _MenuCard extends StatefulWidget {
  @override
  State<_MenuCard> createState() => _MenuCardState();
}

class _MenuCardState extends State<_MenuCard> {
  int? _openDropdownIndex;

  @override
  void initState() {
    super.initState();
    _openDropdownIndex = 0;
  }

  void _toggleDropdown(int index) {
    setState(() {
      _openDropdownIndex = _openDropdownIndex == index ? null : index;
    });
  }

  Future<String?> _getUserMessId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('messID') ?? 'xyz';
  }

  Widget _buildExpandableSection(int index, String title) {
    final bool isOpen = _openDropdownIndex == index;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        GestureDetector(
          onTap: () => _toggleDropdown(index),
          child: Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: isOpen ? BorderRadius.vertical(top: Radius.circular(10)) : BorderRadius.circular(10),
              border: Border(
                top: BorderSide(color: Color(0xFFB8B8B8), width: 1),
                left: BorderSide(color: Color(0xFFB8B8B8), width: 1),
                right: BorderSide(color: Color(0xFFB8B8B8), width: 1),
                bottom: isOpen
                    ? BorderSide.none
                    : BorderSide(color: Color(0xFFB8B8B8), width: 1),
              ),
            ),
            child: Text(
              title,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ),
        ),
        AnimatedContainer(
          duration: Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          height: isOpen ? 200 : 0,
          padding: EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(10)),
            border: Border(
              bottom: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
              left: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
              right: BorderSide(color: const Color(0xFFB8B8B8), width: 1),
            ),
          ),
          child: Visibility(
            visible: isOpen,
            maintainState: true,
            maintainAnimation: true,
            child: FutureBuilder<String?>(
              future: _getUserMessId(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator(strokeWidth: 2));
                } else if (snapshot.hasError) {
                  return Text("Error: ${snapshot.error}");
                } else {
                  return Consumer<MessInfoProvider>(
                    builder: (context, messProvider, child) {
                      return HorizontalMenuBuilder(
                        messId: copyMessID,
                        day: selectedDay,
                        userMessId: snapshot.data,
                      );
                    },
                  );
                }
              },
            ),
          ),
        ),

        SizedBox(height: 10),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildExpandableSection(0, 'Breakfast'),
          _buildExpandableSection(1, 'Lunch'),
          _buildExpandableSection(2, 'Dinner'),
          SizedBox(height: 16),
          // Consumer<MessInfoProvider>(
          //   builder: (context, messProvider, child) {
          //     return FutureBuilder<String?>(
          //       future: _getUserMessId(),
          //       builder: (context, snapshot) {
          //         return HorizontalMenuBuilder(
          //           messId: copyMessID,
          //           day: selectedDay,
          //           userMessId: snapshot.data,
          //         );
          //       },
          //     );
          //   },
          // ),
        ],
      ),
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