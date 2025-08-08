import 'package:flutter/material.dart';

class HostelDrop extends StatefulWidget {
  final Function(String) onChanged;

  const HostelDrop({super.key, required this.onChanged});

  @override
  _HostelDropState createState() => _HostelDropState();
}

class _HostelDropState extends State<HostelDrop> {
  String selectedHostel = 'Barak';

  final List<String> hostels = [
    'Barak',
    'Brahmaputra',
    'Dhansiri',
    'Dihing',
    'Disang',
    'Gaurang',
    'Kameng',
    'Kapili',
    'Lohit',
    'Manas',
    'Siang',
    'Subansiri',
    'Umiam',
  ];

  final GlobalKey _key = GlobalKey();

  void _showDropdownMenu() async {
    final RenderBox renderBox = _key.currentContext!.findRenderObject() as RenderBox;
    final Offset offset = renderBox.localToGlobal(Offset.zero);

    final selected = await showMenu<String>(
      context: context,
      position: RelativeRect.fromLTRB(
        offset.dx,
        offset.dy + renderBox.size.height,
        offset.dx + 100,
        offset.dy,
      ),
      items: [
        PopupMenuItem(
          enabled: false,
          child: SizedBox(
            height: 200, // fixed height for scroll
            width: 100,
            child: Scrollbar(
              child: ListView.builder(
                itemCount: hostels.length,
                itemBuilder: (context, index) {
                  final hostel = hostels[index];
                  return ListTile(
                    title: Text(
                      hostel,
                      style: TextStyle(
                        color: hostel == selectedHostel ? const Color(0xFF3754DB) : Colors.black,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    onTap: () {
                      Navigator.pop(context, hostel);
                    },
                  );
                },
              ),
            ),
          ),
        ),
      ],
    );

    if (selected != null) {
      setState(() {
        selectedHostel = selected;
      });
      widget.onChanged(selected);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      key: _key,
      onTap: _showDropdownMenu,
      child: Row(
        children: [
          Text(
            selectedHostel,
            style: const TextStyle(
              color: Color(0xFF3754DB),
              fontWeight: FontWeight.w500,
            ),
          ),
          const Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF3754DB)),
        ],
      ),
    );
  }
}
