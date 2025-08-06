const String baseUrl = "https://hab.codingclub.in/api";

class MessChange {
  static const String messChangeRequest = "$baseUrl/mess-change/reqchange";
}

class UserEndpoints {
  static const String currentUser = '$baseUrl/users/';
}

class itemEndpoint {
  static const String getitem = '$baseUrl/items/';
}

class hostelEndpoint {
  static const String getitem = '$baseUrl/hostel/';
}

class authendpoint {
  static const String Authendpoint =
      'https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/authorize';
}

class tokenendpoint {
  static const Tokenendpoint =
      'https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/token';
}

class AuthEndpoints {
  static const String getAccess =
      'https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/authorize?client_id=7326b1dd-5e6b-4f88-bd73-938e264c7f27&response_type=code&redirect_uri=https://hab.codingclub.in/api/auth/login/redirect/mobile&scope=offline_access%20user.read&state=12345&prompt=consent';
}

class Userendpoints {
  static const getdetails = 'https://graph.microsoft.com/v1.0/me';
}


class tokenlink {
  static const Tokenlink =
      'https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/token';
}

class redirecturi {
  static const Redirecturi =
      '${baseUrl}/auth/login/redirect/mobile';
}



class messFeedback {
  static const feedbackSubmit =
      "$baseUrl/feedback/submit";
}

class messInfo {
  static const getMessInfo = "$baseUrl/mess/all";
  static const getUserMessInfo ="$baseUrl/mess/get";
}


