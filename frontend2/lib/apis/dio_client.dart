import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:frontend2/utilities/version_checker.dart';

class DioClient {
  // Singleton pattern: Ensures we only have one Dio instance across the app
  static final DioClient _instance = DioClient._internal();
  late final Dio _dio;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    _dio = Dio(BaseOptions(
      // Increased timeouts for slow connections
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
    ));

    // ADD THE INTERCEPTOR (Crucial Step)
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // Inject the version header dynamically
        // Only add headers that don't conflict with FormData (which sets Content-Type automatically)
        final apiHeaders = VersionChecker.getApiHeaders();
        apiHeaders.forEach((key, value) {
          // Don't override Content-Type if it's already set (FormData will set it with boundary)
          if (key.toLowerCase() != 'content-type' || !options.headers.containsKey('content-type')) {
            options.headers[key] = value;
          }
        });
        
        // Helpful Debug Log
        if (kDebugMode) debugPrint("Request: ${options.uri} | Headers: ${options.headers}");
        
        return handler.next(options);
      },
    ));
  }

  // Getter to access the configured Dio instance
  Dio get dio => _dio;
}
