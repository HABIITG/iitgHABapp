import 'package:flutter/material.dart';


class NewWidget extends StatelessWidget {
  final Color? color;
  final VoidCallback? onPressed;
  final Text? text;//put ? if u want to want to assign null values also

  NewWidget({ required this.color, this.onPressed,  this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 16.0),
      child: Material(
        color: color,
        borderRadius: BorderRadius.circular(30.0),
        elevation: 5.0,
        child: MaterialButton(
          onPressed: onPressed,
          minWidth: 200.0,
          height: 42.0,
          child: text,
        ),
      ),
    );
  }
}