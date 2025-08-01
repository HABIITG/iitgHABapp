import 'package:permission_handler/permission_handler.dart';

class PermissionHandler {
  Future<void> requestCameraPermission(Function onGranted) async {
    var status = await Permission.camera.status;
    if (!status.isGranted) {

      status = await Permission.camera.request();

      if (status.isGranted) {
        onGranted();
      } else if (status.isDenied) {
        print("Camera permission denied");
      } else if (status.isPermanentlyDenied) {
        print("Camera permission permanently denied");
        openAppSettings();
      }
    } else {
      onGranted();
    }
  }
}
