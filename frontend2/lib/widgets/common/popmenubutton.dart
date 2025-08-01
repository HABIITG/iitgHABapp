import 'package:flutter/material.dart';

class HostelDrop extends StatefulWidget {
  final Function(String) onChanged;

  const HostelDrop({Key? key, required this.onChanged}) : super(key: key);

  @override
  _HostelDropState createState() => _HostelDropState();
}

class _HostelDropState extends State<HostelDrop> {
  String selectedHostel = 'Brahmaputra';

  final List<String> hostels = [
    'Brahmaputra',
    'Disang',
    'Dihing',
    'Dhansiri',
    'Subansiri',
    'Siang',
    'Lohit',
    'Manas',
    'Umiam',
    'Barak',
    'Kapili',
    'Gaurang',
    'Kameng',
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
                        color: hostel == selectedHostel ? Color(0xFF3754DB) : Colors.black,
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
            style: TextStyle(
              color: Color(0xFF3754DB),
              fontWeight: FontWeight.w500,
            ),
          ),
          Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF3754DB)),
        ],
      ),
    );
  }
}
