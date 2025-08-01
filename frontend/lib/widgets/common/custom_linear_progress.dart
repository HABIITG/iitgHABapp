import 'package:flutter/material.dart';

import '../../constants/themes.dart';

class CustomLinearProgress extends StatelessWidget {
  final String text;
  const CustomLinearProgress({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color.fromRGBO(255, 255, 255, 0.9),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children:  [
          const Center(
            child: SizedBox(
              width: 100,
              child: LinearProgressIndicator(
                color: Themes.kYellow,
                backgroundColor: Colors.black,
              ),
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          SizedBox(
            width: 300,
            child: Text(
              text,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black),
            ),
          )
        ],
      ),
    );
  }
}
