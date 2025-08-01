class MessInfoModel {
  final String id;
  final String name;
  final String hostelId;
  final List<dynamic> complaints;
  final int rating;
  final int ranking;
  final String hostelName;

  MessInfoModel({
    required this.id,
    required this.name,
    required this.hostelId,
    required this.complaints,
    required this.rating,
    required this.ranking,
    required this.hostelName,
  });

  factory MessInfoModel.fromJson(Map<String, dynamic> json) {
    return MessInfoModel(
      id: json['_id'],
      name: json['name'],
      hostelId: json['hostelId'],
      complaints: json['complaints'] ?? [],
      rating: json['rating'] ?? 0,
      ranking: json['ranking'] ?? 0,
      hostelName: json['hostelName'],
    );
  }
}


//mapping hostelname with messid,messname,rating,ranking

class HostelData {
  final String messid;
  final String messname;
  final int rating;
  final int ranking;

  HostelData({
    required this.messid,
    required this.messname,
    required this.rating,
    required this.ranking,
  });
}

// Function to map hostels by name
Map<String, HostelData> mapHostelsByName(List<MessInfoModel> hostels) {
  Map<String, HostelData> hostelMap = {};

  for (MessInfoModel hostel in hostels) {
    hostelMap[hostel.hostelName] = HostelData(
      messid: hostel.id,
      messname: hostel.name,
      rating: hostel.rating,
      ranking: hostel.ranking,
    );
  }

  return hostelMap;
}
