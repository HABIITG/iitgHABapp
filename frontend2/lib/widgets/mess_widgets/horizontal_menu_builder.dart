import 'package:flutter/material.dart';

import '../../apis/mess/menu_like.dart';
import '../../apis/mess/mess_menu.dart';
import '../../models/mess_menu_model.dart';
import '../common/AutoHeightPageView.dart';

// API class for like/unlike functionality

class HorizontalMenuBuilder extends StatelessWidget {
  final String messId;
  final String day;
  final String? userMessId;

  const HorizontalMenuBuilder({
    super.key,
    required this.messId,
    required this.day,
    this.userMessId,
  });

  DateTime _parseTime(String timeStr) {
    final now = DateTime.now();
    final parts = timeStr.split(':');
    return DateTime(
      now.year,
      now.month,
      now.day,
      int.parse(parts[0]),
      int.parse(parts[1]),
      0,
      0,
    );
  }

  String _formatDuration(Duration d) {
    if (d.inSeconds <= 0) return "is over";
    final h = d.inHours;
    final m = d.inMinutes.remainder(60);
    if (h > 0) {
      return "${h}h ${m}m";
    } else {
      return "${m}m";
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<MenuModel>>(
      future: fetchMenu(messId, day),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
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
        } else if (snapshot.hasError) {
          return Card(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: Color(0xC5C5D1), width: 1),
            ),
            elevation: 0.5,
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: Text(
                'Error loading menu: ${snapshot.error}',
                style: const TextStyle(color: Colors.red),
              ),
            ),
          );
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 0.5,
            child: const Padding(
              padding: EdgeInsets.all(18.0),
              child: Text(
                'No menu available today.',
                style: TextStyle(fontSize: 15, color: Colors.black54),
              ),
            ),
          );
        }

        final menus = snapshot.data!;
        final order = ['Breakfast', 'Lunch', 'Dinner'];
        final sortedMenus = List<MenuModel>.from(menus);
        sortedMenus.sort(
            (a, b) => order.indexOf(a.type).compareTo(order.indexOf(b.type)));

        return Column(
          mainAxisSize:
              MainAxisSize.min, // Fixed: Remove unnecessary bottom space
          children: [
            // Meal type indicators at the top
            // Container(
            //   height: 40,
            //   margin: const EdgeInsets.only(bottom: 12),
            //   child: Row(
            //     mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            //     children: sortedMenus.map((menu) {
            //       return Expanded(
            //         child: Container(
            //           margin: const EdgeInsets.symmetric(horizontal: 4),
            //           decoration: BoxDecoration(
            //             color: Colors.grey[100],
            //             borderRadius: BorderRadius.circular(20),
            //           ),
            //           child: Center(
            //             child: Text(
            //               menu.type,
            //               style: const TextStyle(
            //                 fontWeight: FontWeight.w600,
            //                 fontSize: 15,
            //                 color: Color(0xFF3754DB),
            //               ),
            //             ),
            //           ),
            //         ),
            //       );
            //     }).toList(),
            //   ),
            // ),
            // MenuPager here we r using the concept of premeasuring the size of IndividualMealCard widget and accordingly changing the ui by smooth scrolling downwards
            MenuPager(
              sortedMenus: sortedMenus,
              messId: messId,
              userMessId: userMessId!,
            ),
          ],
        );
      },
    );
  }
}

// Individual meal card with correct time logic and API functionality
class IndividualMealCard extends StatefulWidget {
  final MenuModel menu;
  final String currentMessId;
  final String? userMessId;
  final DateTime Function(String) parseTime;
  final String Function(Duration) formatDuration;

  const IndividualMealCard({
    Key? key,
    required this.menu,
    required this.currentMessId,
    this.userMessId,
    required this.parseTime,
    required this.formatDuration,
  }) : super(key: key);

  @override
  State<IndividualMealCard> createState() => _IndividualMealCardState();
}

class _IndividualMealCardState extends State<IndividualMealCard> {
  late MenuModel _menu;
  bool _isLikeEnabled = false;

  @override
  void initState() {
    super.initState();
    _menu = widget.menu;
    _checkLikeEnabled();
  }

  void _checkLikeEnabled() {
    setState(() {
      _isLikeEnabled = widget.userMessId != null &&
          widget.userMessId == widget.currentMessId;
    });
  }

  // Calculate correct time status for this individual meal
  String _getIndividualMealStatus() {
    final now = DateTime.now();
    final start = widget.parseTime(_menu.startTime);
    final end = widget.parseTime(_menu.endTime);

    if (now.isBefore(start)) {
      // Not started yet
      final diff = start.difference(now);
      final h = diff.inHours;
      final m = diff.inMinutes.remainder(60);
      return "In ${h > 0 ? '${h}h ' : ''}${m}m";
    } else if (now.isAfter(start) && now.isBefore(end)) {
      // Ongoing
      return "Ongoing";
    } else {
      // Ended
      return "is over";
    }
  }

  Color _getStatusColor(String status) {
    if (status == "Ongoing" || status.startsWith("In")) {
      return const Color(0xFF1DB954);
    } else {
      return Colors.grey;
    }
  }

  // API call for like/unlike - exactly from your InteractiveMessMenuCard
  Future<void> _toggleLike(String menuItemId, int itemIndex) async {
    if (!_isLikeEnabled) return;

    // Optimistic update
    setState(() {
      _menu.items[itemIndex].isLiked = !_menu.items[itemIndex].isLiked;
    });

    // Make API call
    final success = await MenuLikeAPI.toggleLike(menuItemId);

    if (!success) {
      // Revert if API call failed
      setState(() {
        _menu.items[itemIndex].isLiked = !_menu.items[itemIndex].isLiked;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update favorite')),
      );
    }
  }

  Widget buildMenuItem(MenuItemModel item) {
    final itemIndex = _menu.items.indexOf(item);
    return GestureDetector(
      onTap: _isLikeEnabled ? () => _toggleLike(item.id, itemIndex) : null,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 2.0),
        child: Row(
          children: [
            Expanded(
              child: Text(
                item.name,
                style: const TextStyle(fontSize: 15),
              ),
            ),
            if (item.isLiked == true)
              const Padding(
                padding: EdgeInsets.only(left: 6.0),
                child: Icon(Icons.favorite, color: Colors.red, size: 16),
              ),
            if (_isLikeEnabled && item.isLiked != true)
              const Padding(
                padding: EdgeInsets.only(left: 6.0),
                child:
                    Icon(Icons.favorite_border, color: Colors.grey, size: 16),
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dishSection =
        _menu.items.where((item) => item.type == "Dish").toList();
    final breadsRice =
        _menu.items.where((item) => item.type == "Breads and Rice").toList();
    final others = _menu.items.where((item) => item.type == "Others").toList();

    final status = _getIndividualMealStatus();
    final statusColor = _getStatusColor(status);

    return Column(
      mainAxisSize: MainAxisSize.min, // Fixed: Dynamic height
      children: [
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(width: 1, color: Color(0xFFC5C5D1)),
          ),
          elevation: 0.5,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min, // Fixed: Dynamic height
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      "${_menu.type} ",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    Text(
                      status, // Fixed: Shows correct individual time
                      style: TextStyle(
                        color: statusColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      "${_menu.startTime} - ${_menu.endTime}",
                      style: const TextStyle(
                        color: Colors.black54,
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  "DISH",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    letterSpacing: 0.5,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 4),
                ...dishSection.map((item) => buildMenuItem(item)).toList(),
                const SizedBox(height: 10),
                const Divider(thickness: 1, height: 24),
                IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "BREADS & RICE",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            ...breadsRice
                                .map((item) => buildMenuItem(item))
                                .toList(),
                          ],
                        ),
                      ),
                      VerticalDivider(
                        thickness: 1,
                        width: 32,
                        color: Colors.grey.shade300,
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "OTHERS",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            ...others
                                .map((item) => buildMenuItem(item))
                                .toList(),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        if (_isLikeEnabled)
          const Padding(
            padding: EdgeInsets.only(top: 8.0),
            child: Text(
              "Tap on a food item to mark as favourite",
              style: TextStyle(fontSize: 12, color: Colors.black54),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }
}
