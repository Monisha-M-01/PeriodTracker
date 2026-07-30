import 'package:flutter/foundation.dart';

class PeriodLog {
  final String id;
  final DateTime startDate;
  final DateTime? endDate;

  PeriodLog({
    required this.id,
    required this.startDate,
    this.endDate,
  });
}

class Prediction {
  final DateTime nextPeriodStart;
  final DateTime lastPeriodStartDate;
  final int avgCycleLength;

  Prediction({
    required this.nextPeriodStart,
    required this.lastPeriodStartDate,
    required this.avgCycleLength,
  });
}

class CheckIn {
  final String id;
  final DateTime date;
  final List<String> moods;
  final List<String> symptoms;

  CheckIn({
    required this.id,
    required this.date,
    required this.moods,
    required this.symptoms,
  });
}
