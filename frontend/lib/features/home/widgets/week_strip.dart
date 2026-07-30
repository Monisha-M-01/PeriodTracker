import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';

class WeekDayInfo {
  final DateTime date;
  final bool isToday;
  final bool hasLog;
  final bool checkedIn;

  WeekDayInfo({
    required this.date,
    required this.isToday,
    this.hasLog = false,
    this.checkedIn = false,
  });
}

class WeekStrip extends StatelessWidget {
  final List<WeekDayInfo> weekDays;

  const WeekStrip({
    super.key,
    required this.weekDays,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: weekDays.map((dayInfo) {
        final dayName = DateFormat('EEEEE').format(dayInfo.date); // single letter
        final dayNumber = dayInfo.date.day.toString();
        
        return Column(
          children: [
            Text(
              dayName,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: dayInfo.isToday ? theme.colorScheme.primary : Colors.white,
                border: Border.all(
                  color: dayInfo.isToday ? theme.colorScheme.primary : Colors.black12,
                ),
                boxShadow: dayInfo.isToday
                    ? [
                        BoxShadow(
                          color: theme.colorScheme.primary.withOpacity(0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        )
                      ]
                    : [],
              ),
              alignment: Alignment.center,
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  Text(
                    dayNumber,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: dayInfo.isToday ? Colors.white : Colors.black87,
                    ),
                  ),
                  if (dayInfo.hasLog)
                    Positioned(
                      bottom: -4,
                      child: Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: dayInfo.isToday ? Colors.white : theme.colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            if (dayInfo.checkedIn)
              const Padding(
                padding: EdgeInsets.only(top: 4.0),
                child: Text('✨', style: TextStyle(fontSize: 10)),
              )
            else
              const SizedBox(height: 14), // placeholder for alignment
          ],
        ).animate().scale(delay: 200.ms, duration: 400.ms, curve: Curves.easeOutBack);
      }).toList(),
    );
  }
}
