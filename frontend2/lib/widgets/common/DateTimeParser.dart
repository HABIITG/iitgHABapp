

DateTime parseTime(String timeStr) {
  final now = DateTime.now();
  final parts = timeStr.split(':');
  return DateTime(
    now.year,
    now.month,
    now.day,
    int.parse(parts[0]),
    int.parse(parts[1]),
  );
}


String formatDuration(Duration d) {
  if (d.inSeconds <= 0) return "Ended";
  final h = d.inHours;
  final m = d.inMinutes.remainder(60);
  if (h > 0) {
    return "${h}h ${m}m";
  } else {
    return "${m}m";
  }
}