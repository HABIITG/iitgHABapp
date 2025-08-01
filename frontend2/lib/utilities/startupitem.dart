import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../constants/endpoint.dart';
import '../models/mess_info_model.dart';


class MessInfoProvider with ChangeNotifier {
  List<MessInfoModel> _messList = [];
  Map<String, HostelData> _hostelMap = {};
  bool isLoading = true;


  //List<MessInfoModel> get hostels => _messList;
  Map<String, HostelData> get hostelMap => _hostelMap;//getter for accessing pvt variables



  Future<void> fetchMessID() async {
    try {
      print('api calling');
      final dio = Dio();
      final response = await dio.post(messInfo.getMessInfo);
      if(response.statusCode ==200){
        final data = response.data as List;
        print('data is $data');
        _messList = data.map((e) => MessInfoModel.fromJson(e)).toList();
        _hostelMap = mapHostelsByName(_messList);
      }
    } catch (e) {
      print('API Error: $e');
      _messList = [];
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
