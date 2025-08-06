import 'package:flutter/material.dart';
import '../../apis/mess/menu_like.dart';
import '../../apis/mess/mess_menu.dart';
import '../../models/mess_menu_model.dart';

class HorizontalMenuBuilder extends StatefulWidget {
  final String messId;
  final String day;
  final String? userMessId;
  final String mealType;

  const HorizontalMenuBuilder({
    super.key,
    required this.messId,
    required this.day,
    required this.mealType,
    this.userMessId,
  });

  @override
  State<HorizontalMenuBuilder> createState() => _HorizontalMenuBuilderState();
}

class _HorizontalMenuBuilderState extends State<HorizontalMenuBuilder> {
  late Future<List<MenuModel>> _menuFuture;

  @override
  void initState() {
    super.initState();
    _menuFuture = fetchMenu(widget.messId, widget.day);
  }

  @override
  void didUpdateWidget(covariant HorizontalMenuBuilder oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.messId != widget.messId || oldWidget.day != widget.day) {
      setState(() {
        _menuFuture = fetchMenu(widget.messId, widget.day);
      });
    }
  }

  DateTime _parseTime(String timeStr) {
    final now = DateTime.now();
    final parts = timeStr.split(':');
    return DateTime(
      now.year,
      now.month,
      now.day,
      int.parse(parts[0]),
      int.parse(parts[1]),
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<MenuModel>>(
      future: _menuFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Padding(
            padding: EdgeInsets.all(12),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        if (snapshot.hasError) {
          return Text("Error: ${snapshot.error}");
        }
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Padding(
            padding: EdgeInsets.all(12),
            child: Text("No menu available"),
          );
        }

        final menus = snapshot.data!;
        final selectedMeal = menus.firstWhere(
          (m) => m.type.toLowerCase() == widget.mealType.toLowerCase(),
          orElse: () => MenuModel(
            messID: widget.messId,
            day: widget.day,
            id: '',
            type: widget.mealType,
            startTime: '',
            endTime: '',
            items: [],
          ),
        );

        return IndividualMealCard(
          menu: selectedMeal,
          isSubscribed: widget.userMessId == widget.messId,
          parseTime: _parseTime,
        );
      },
    );
  }
}

class IndividualMealCard extends StatefulWidget {
  final MenuModel menu;
  final bool isSubscribed;
  final DateTime Function(String) parseTime;
  final VoidCallback? onExpandedChanged;

  const IndividualMealCard({
    super.key,
    required this.menu,
    required this.isSubscribed,
    required this.parseTime,
    this.onExpandedChanged,
  });

  @override
  State<IndividualMealCard> createState() => _IndividualMealCardState();
}

class _IndividualMealCardState extends State<IndividualMealCard>
    with SingleTickerProviderStateMixin {
  late MenuModel _menu;
  bool _expanded = false;

  @override
  void initState() {
    super.initState();
    _menu = widget.menu;
    print("🥳🥳 is mess subscribes??: ${widget.isSubscribed}");
  }

  /// Calculates total likes for the meal
  int getTotalLikes() {
    return _menu.items.where((item) => item.isLiked).length;
  }

  String _statusText() {
    if (_menu.startTime.isEmpty || _menu.endTime.isEmpty) return "";
    final now = DateTime.now();
    final start = widget.parseTime(_menu.startTime);
    final end = widget.parseTime(_menu.endTime);

    if (now.isBefore(start)) {
      final diff = start.difference(now);
      return "In ${diff.inHours > 0 ? '${diff.inHours}h ' : ''}${diff.inMinutes % 60}m";
    } else if (now.isAfter(start) && now.isBefore(end)) {
      return "Ongoing";
    } else {
      return "is over";
    }
  }

  Color _statusColor(String s) {
    if (s.startsWith("In") || s == "Ongoing") {
      return Colors.green;
    }
    return Colors.grey;
  }

  Future<void> _toggleLike(String itemId, int index) async {
    if (!widget.isSubscribed) return;
    setState(() {
      _menu.items[index].isLiked = !_menu.items[index].isLiked;
    });
    final success = await MenuLikeAPI.toggleLike(itemId);
    if (!success) {
      setState(() {
        _menu.items[index].isLiked = !_menu.items[index].isLiked;
      });
    }
  }

  Widget _buildItem(MenuItemModel item, int index) {
    return GestureDetector(
      onTap: widget.isSubscribed ? () => _toggleLike(item.id, index) : null,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: item.isLiked ? Color.fromARGB(180, 250, 150, 150) : Color(0xFFF5F5F5),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.isSubscribed)
                GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => _toggleLike(item.id, index),
                  child: Icon(
                    item.isLiked ? Icons.favorite : Icons.favorite_border,
                    color: item.isLiked ? Colors.red : Colors.grey,
                    size: 18, // slightly larger than before
                  ),
                ),
              SizedBox(width: 4,),
              Flexible(child: Text(item.name)),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final status = _statusText();
    final dishSection = _menu.items.where((i) => i.type == "Dish").toList();
    final breads = _menu.items.where((i) => i.type == "Breads and Rice").toList();
    final others = _menu.items.where((i) => i.type == "Others").toList();

    return AnimatedSize(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeInOut,
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            setState(() => _expanded = !_expanded);
            widget.onExpandedChanged?.call();
          },
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header row with likes count
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Text(
                            _menu.type,
                            style: const TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          if (widget.isSubscribed) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(20),
                                color: Color.fromARGB(180, 250, 150, 150),
                              ),
                              child: Row(
                                children: [
                                  Icon(Icons.favorite, size: 18, color: Colors.red),
                                  const SizedBox(width: 2),
                                  Text(
                                    getTotalLikes().toString(),
                                    style: const TextStyle(
                                        fontSize: 14, color: Colors.red),
                                  ),
                                ],
                              ),
                            ),
                          ]
                        ],
                      ),
                    ),
                    Text(
                      status,
                      style: TextStyle(
                        color: _statusColor(status),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text("${_menu.startTime} - ${_menu.endTime}",
                        style: const TextStyle(color: Colors.grey)),
                    const SizedBox(width: 6),
                    Icon(
                      _expanded ? Icons.expand_less : Icons.expand_more,
                      size: 20,
                      color: Colors.grey,
                    ),
                  ],
                ),
                // Expanded details
                if (_expanded) ...[
                  const SizedBox(height: 12),
                  const Text("DISH", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey)),
                  ...dishSection.map((item) => _buildItem(item, _menu.items.indexOf(item))),
                  const Divider(),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("BREADS & RICE", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey)),
                            ...breads.map((item) => _buildItem(item, _menu.items.indexOf(item))),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("OTHERS", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey)),
                            ...others.map((item) => _buildItem(item, _menu.items.indexOf(item))),
                          ],
                        ),
                      ),
                    ],
                  ),
                  if (widget.isSubscribed)
                    const Padding(
                      padding: EdgeInsets.only(top: 8.0),
                      child: Text(
                        "Tap on a food item to mark as favourite",
                        style: TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ),
                ]
              ],
            ),
          ),
        ),
      ),
    );
  }
}
