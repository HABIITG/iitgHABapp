import 'package:flutter/material.dart';
import 'package:dropdown_button2/dropdown_button2.dart';

class MessChangePrefs extends StatelessWidget {
  final String? selectedOption;
  final ValueChanged<String?> onChanged;

  const MessChangePrefs(
      {super.key, required this.selectedOption, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final List<String> options = [
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
    return DropdownButtonHideUnderline(
      child: DropdownButton2<String>(
        isExpanded: true,
        hint: const Padding(
          padding: EdgeInsetsGeometry.all(8),
          child: Text(
            'Select',
            style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 16,
                color: Color(0xFF676767),
                fontFamily: 'General Sans Variable'),
          ),
        ),
        items: options
            .map((String item) => DropdownMenuItem(
          value: item,
          child: Container(
            decoration: BoxDecoration(
                border: (item == options.last
                    ? null
                    : Border(
                    bottom: BorderSide(
                        color: Colors.grey.shade300, width: 1.0)))),
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(item,
                style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                    height: 1.5,
                    color: Color(0xFF2E2F31))),
          ),
        ))
            .toList(),
        selectedItemBuilder: (context) {
          return options.map((String item) {
            return Padding(
                padding: const EdgeInsetsGeometry.symmetric(
                    horizontal: 8, vertical: 8),
                child: Text(item,
                    style: const TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                      color: Color(0xFF4C4EDB),
                      decoration: TextDecoration.none,
                    )));
          }).toList();
        },
        value: selectedOption,
        onChanged: onChanged,
        buttonStyleData: ButtonStyleData(
            height: 56,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
                color: selectedOption == null
                    ? const Color(0xFFF5F5F5)
                    : const Color(0xFFEDEDFB),
                borderRadius: BorderRadius.circular(16),
                border: selectedOption == null
                    ? Border.all(color: const Color(0xFFC5C5D1), width: 1)
                    : Border.all(color: const Color(0xFF4C4EDB), width: 2))),
        dropdownStyleData: DropdownStyleData(
            maxHeight: MediaQuery.of(context).size.height * 0.5,
            width: MediaQuery.of(context).size.width * 0.9,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300, width: 1.0)),
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 16)),
        menuItemStyleData: const MenuItemStyleData(
            height: 56, padding: EdgeInsets.symmetric(horizontal: 16)),
      ),
    );
  }
}

class SecondMessChangePrefs extends StatelessWidget {
  final String? selectedOption;
  final ValueChanged<String?> onChanged;
  final String? firstpref;

  const SecondMessChangePrefs({
    super.key,
    required this.selectedOption,
    required this.onChanged,
    required this.firstpref,
  });

  @override
  Widget build(BuildContext context) {
    final List<String> options = [
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

    // Determine if the dropdown should be enabled
    final bool isEnabled = firstpref != null;

    return DropdownButtonHideUnderline(
      child: DropdownButton2<String>(
        isExpanded: true,
        hint: Padding(
          padding: const EdgeInsetsGeometry.all(8),
          child: Text(
            'Select',
            style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 16,
                // Adjust hint color when disabled
                color: isEnabled ? const Color(0xFF676767) : Colors.grey.shade400,
                fontFamily: 'General Sans Variable'),
          ),
        ),
        items: options
            .map((String item) => DropdownMenuItem(
          // Keep item enabled logic as is, if you want
          // individual items to be interactable when the button is enabled
          // If you want items to be disabled even if button is enabled
          // (e.g. if the item is the same as firstpref), you'd add more logic here.
          // For simply disabling the whole dropdown, this is fine.
          enabled: isEnabled, // Ensures individual items are also not selectable if the whole dropdown is disabled
          value: item,
          child: Container(
            decoration: BoxDecoration(
                border: (item == options.last
                    ? null
                    : Border(
                    bottom: BorderSide(
                        color: Colors.grey.shade300, width: 1.0)))),
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(item,
                style: TextStyle( // Adjust item text color when disabled
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                    height: 1.5,
                    color: isEnabled ? const Color(0xFF2E2F31) : Colors.grey.shade400)),
          ),
        ))
            .toList(),
        selectedItemBuilder: (context) {
          return options.map((String item) {
            return Padding(
                padding: const EdgeInsetsGeometry.symmetric(
                    horizontal: 8, vertical: 8),
                child: Text(item,
                    style: TextStyle( // Adjust selected item color when disabled
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                      color: isEnabled ? const Color(0xFF4C4EDB) : Colors.grey.shade400,
                      decoration: TextDecoration.none,
                    )));
          }).toList();
        },
        value: selectedOption,
        // Set onChanged to null to disable the dropdown button
        onChanged: isEnabled ? onChanged : null,
        buttonStyleData: ButtonStyleData(
            height: 56,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
              // Adjust colors and border based on isEnabled
                color: isEnabled
                    ? (selectedOption == null
                    ? const Color(0xFFF5F5F5) // Enabled, no selection
                    : const Color(0xFFEDEDFB)) // Enabled, selected
                    : const Color(0xFFF5F5F5), // Disabled
                borderRadius: BorderRadius.circular(16),
                border: isEnabled
                    ? (selectedOption == null
                    ? Border.all(color: const Color(0xFFC5C5D1), width: 1) // Enabled, no selection
                    : Border.all(color: const Color(0xFF4C4EDB), width: 2)) // Enabled, selected
                    : Border.all(color: const Color(0xFFC5C5D1), width: 1))), // Disabled
        dropdownStyleData: DropdownStyleData(
            maxHeight: MediaQuery.of(context).size.height * 0.5,
            width: MediaQuery.of(context).size.width * 0.9,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300, width: 1.0)),
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 16)),
        menuItemStyleData: const MenuItemStyleData(
            height: 56, padding: EdgeInsets.symmetric(horizontal: 16)),
      ),
    );
  }
}