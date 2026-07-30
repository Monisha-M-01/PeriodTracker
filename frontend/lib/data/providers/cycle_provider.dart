import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/data/models/cycle_data.dart';

// -----------------------------------------
// Providers for mock state management
// -----------------------------------------

final periodsProvider = NotifierProvider<PeriodsNotifier, List<PeriodLog>>(() {
  return PeriodsNotifier();
});

class PeriodsNotifier extends Notifier<List<PeriodLog>> {
  @override
  List<PeriodLog> build() {
    return [
      PeriodLog(
        id: '1',
        startDate: DateTime.now().subtract(const Duration(days: 14)),
        endDate: DateTime.now().subtract(const Duration(days: 9)),
      ),
    ];
  }

  void logPeriod(DateTime date) {
    state = [...state, PeriodLog(id: DateTime.now().millisecondsSinceEpoch.toString(), startDate: date)];
  }

  void deletePeriod(String id) {
    state = state.where((log) => log.id != id).toList();
  }
}

final predictionProvider = Provider<Prediction?>((ref) {
  final periods = ref.watch(periodsProvider);
  if (periods.isEmpty) return null;

  // Simple mock prediction: 28 days from the last period
  final lastPeriod = periods.reduce((a, b) => a.startDate.isAfter(b.startDate) ? a : b);
  return Prediction(
    nextPeriodStart: lastPeriod.startDate.add(const Duration(days: 28)),
    lastPeriodStartDate: lastPeriod.startDate,
    avgCycleLength: 28,
  );
});

final checkInsProvider = NotifierProvider<CheckInNotifier, List<CheckIn>>(() {
  return CheckInNotifier();
});

class CheckInNotifier extends Notifier<List<CheckIn>> {
  @override
  List<CheckIn> build() {
    return [
      CheckIn(
        id: '1',
        date: DateTime.now(),
        moods: ['Happy', 'Energetic'],
        symptoms: [],
      )
    ];
  }
}
