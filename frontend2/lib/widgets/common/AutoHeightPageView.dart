import 'package:flutter/material.dart';
import 'package:frontend1/models/mess_menu_model.dart';
import 'package:frontend1/widgets/mess_widgets/menusizeMeasure.dart';

import '../mess_widgets/horizontal_menu_builder.dart'; // import the file you just created

class MenuPager extends StatefulWidget {
  final List<MenuModel> sortedMenus;
  final String messId;
  final String userMessId;

  const MenuPager({
    Key? key,
    required this.sortedMenus,
    required this.messId,
    required this.userMessId,
  }) : super(key: key);

  @override
  State<MenuPager> createState() => _MenuPagerState();
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

class _MenuPagerState extends State<MenuPager> {
  final PageController _pageController = PageController(viewportFraction: 0.95);
  final Map<int, double> _menuHeights = {};
  double _currentHeight = 250;

  void _updateHeight(int index, double height) {
    if (_menuHeights[index] != height) {
      setState(() {
        _menuHeights[index] = height;
        if (_pageController.page?.round() == index || _menuHeights.length == 1) {
          _currentHeight = height;
        }
      });
    }
  }

  @override
  void initState() {
    super.initState();

    _pageController.addListener(() {
      final page = _pageController.page ?? 0.0;
      final int left = page.floor();
      final int right = page.ceil();

      if (_menuHeights.containsKey(left) && _menuHeights.containsKey(right)) {
        final double lHeight = _menuHeights[left]!;
        final double rHeight = _menuHeights[right]!;
        final double frac = page - left;

        setState(() {
          _currentHeight = lHeight + (rHeight - lHeight) * frac;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeInOut,
      height: _currentHeight,
      child: PageView.builder(
        controller: _pageController,
        itemCount: widget.sortedMenus.length,
        itemBuilder: (context, index) {
          final menu = widget.sortedMenus[index];

          return Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: MeasureSize(
              onChange: (size) => _updateHeight(index, size.height),
              child: IndividualMealCard(
                menu: menu,
                currentMessId: widget.messId,
                userMessId: widget.userMessId,
                parseTime: _parseTime,
                formatDuration: _formatDuration,
              ),
            ),
          );
        },
      ),
    );
  }
}
