
import 'package:flutter/material.dart';

String calculateHostel(String objectID) {

  switch (objectID) {
    case "6783b8b16e40ef5a28b80f13":
      return "Lohit";
    case "6783b8ee6e40ef5a28b80f15":
      return "Manas";
    case "6783b9066e40ef5a28b80f17":
      return "Umiam";
    case "67864633a827df8cd5d316b6":
      return "Kapili";
    case "67864679a827df8cd5d316b8":
      return "Gaurang";
    case "6826de5181420e896eaf7025":// changed acc to new schema
      return "Brahmaputra";
    case "67864697a827df8cd5d316bc":
      return "Dihing";
    case "678646e3a827df8cd5d316be":
      return "MSH";
    case "67864711a827df8cd5d316c0":
      return "Siang";
    case "67864726a827df8cd5d316c2":
      return "Dhansiri";
    case "67864733a827df8cd5d316c4":
      return "Subansiri";
    case "6786475ba827df8cd5d316c6":
      return "Kameng";
    case "67864898c4df4e222b429fe7":
      return "Disang";
    default:
      return "Unknown Hostel";
  }
}