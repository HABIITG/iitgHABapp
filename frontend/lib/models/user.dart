import 'dart:convert';



User userFromJson(String str) => User.fromJson(json.decode(str));

String userToJson(User data) => json.encode(data.toJson());

class User {
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.rollNumber,
    required this.degree,
    required this.course,
    required this.department,
    required this.v,
  });

  String id;
  String name;
  String email;
  int rollNumber;
  String degree;
  String course;
  String department;
  int v;

  factory User.fromJson(Map<dynamic, dynamic> json) => User(
    id: json["_id"],
    name: json["name"],
    email: json["email"],
    rollNumber: json["rollNumber"],
    degree: json["degree"],
    department: json["department"],
    v: json["__v"],
    course: json["course"],
  );

  Map<dynamic, dynamic> toJson() => {
    "_id": id,
    "name": name,
    "email": email,
    "rollNumber": rollNumber,
    "degree": degree,
    "department": department,
    "__v": v,
  };
}