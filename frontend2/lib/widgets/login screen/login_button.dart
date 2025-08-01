import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class LoginButton extends StatelessWidget {
  const LoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    return  Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset('assets/fonts/microsoft.svg', height: 30),
          const SizedBox(
            width: 0,
          ),
          const Text(
            'Sign in with Microsoft',
            style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.w500, fontSize: 14,fontFamily: 'GeneralSans'
            ),
          ),
        ],
    );
  }
}