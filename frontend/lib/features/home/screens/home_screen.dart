import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:frontend/features/home/widgets/hero_progress_ring.dart';
import 'package:frontend/features/home/widgets/week_strip.dart';
import 'package:frontend/features/home/widgets/quick_action_button.dart';
import 'package:frontend/features/home/widgets/daily_insight_card.dart';
import 'package:frontend/data/providers/cycle_provider.dart';
import 'package:frontend/shared/widgets/animated_mesh_background.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Read state from Riverpod providers
    final prediction = ref.watch(predictionProvider);
    final periods = ref.watch(periodsProvider);
    final checkIns = ref.watch(checkInsProvider);
    
    final today = DateTime.now();
    
    // Cycle calculations
    int currentDay = 1;
    int totalDays = prediction?.avgCycleLength ?? 28;
    int? daysUntilNext;
    
    if (prediction != null) {
      currentDay = today.difference(prediction.lastPeriodStartDate).inDays + 1;
      daysUntilNext = prediction.nextPeriodStart.difference(today).inDays;
    }

    // Build week strip data
    final weekDays = List.generate(7, (i) {
      final date = today.subtract(const Duration(days: 3)).add(Duration(days: i));
      
      // Check if this date has a period logged
      final hasLog = periods.any((p) {
        if (p.endDate == null) return p.startDate.year == date.year && p.startDate.month == date.month && p.startDate.day == date.day;
        return date.isAfter(p.startDate.subtract(const Duration(days: 1))) && date.isBefore(p.endDate!.add(const Duration(days: 1)));
      });

      // Check if checked in today
      final checkedIn = checkIns.any((c) => c.date.year == date.year && c.date.month == date.month && c.date.day == date.day);

      return WeekDayInfo(
        date: date,
        isToday: i == 3,
        hasLog: hasLog,
        checkedIn: checkedIn,
      );
    });

    final isPeriodLoggedToday = weekDays[3].hasLog;

    return Scaffold(
      body: Stack(
        children: [
          // Animated Mesh Gradient Background
          const Positioned.fill(
            child: AnimatedMeshBackground(),
          ),
          
          SafeArea(
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildHeader(today),
                        const SizedBox(height: 32),
                        
                        WeekStrip(weekDays: weekDays),
                        const SizedBox(height: 48),
                        
                        Center(
                          child: HeroProgressRing(
                            currentDay: currentDay,
                            totalDays: totalDays,
                            phaseName: _getPhaseName(currentDay),
                            daysUntilNext: daysUntilNext,
                          ),
                        ),
                        
                        const SizedBox(height: 48),
                        
                        // Quick Actions
                        Row(
                          children: [
                            Expanded(
                              child: QuickActionButton(
                                icon: isPeriodLoggedToday ? Icons.water_drop : Icons.water_drop_outlined,
                                label: isPeriodLoggedToday ? 'Logged' : 'Log Period',
                                isPrimary: isPeriodLoggedToday,
                                onTap: () {
                                  if (isPeriodLoggedToday) {
                                    // Normally we'd delete the period log starting today, simplified for mock:
                                    ref.read(periodsProvider.notifier).deletePeriod(periods.last.id);
                                  } else {
                                    ref.read(periodsProvider.notifier).logPeriod(today);
                                  }
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: QuickActionButton(
                                icon: Icons.monitor_heart_outlined,
                                label: 'Log',
                                onTap: () {},
                                color: Colors.blueGrey,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: QuickActionButton(
                                icon: Icons.check_circle_outline,
                                label: 'Check-in',
                                onTap: () {},
                                color: Colors.teal,
                              ),
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 40),
                        
                        // Insights
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Daily Insights',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                                fontFamily: 'Playfair Display',
                              ),
                            ),
                            TextButton(
                              onPressed: () {},
                              child: Row(
                                children: const [
                                  Text('See all'),
                                  Icon(Icons.chevron_right, size: 16),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        
                        SizedBox(
                          height: 160,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            clipBehavior: Clip.none,
                            children: [
                              DailyInsightCard(
                                emoji: '✨',
                                title: 'Cycle Day $currentDay',
                                text: _getCycleTip(currentDay),
                              ),
                              const DailyInsightCard(
                                emoji: '🌙',
                                title: 'Sleep Hygiene',
                                text: 'Going to bed at the same time every day helps regulate your circadian rhythm.',
                              ),
                              const DailyInsightCard(
                                emoji: '💧',
                                title: 'Hydration',
                                text: 'Drinking enough water can help reduce bloating and fatigue, especially during your period.',
                              ),
                            ],
                          ),
                        ),
                        
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  String _getPhaseName(int day) {
    if (day <= 5) return "Menstrual Phase";
    if (day <= 13) return "Follicular Phase";
    if (day <= 15) return "Ovulation Phase";
    return "Luteal Phase";
  }

  String _getCycleTip(int day) {
    if (day <= 5) return "Your period is here. Keep hydrating and don't push yourself too hard.";
    if (day <= 13) return "Welcome to the follicular phase! Rising estrogen means rising energy.";
    if (day <= 15) return "Ovulation window. You are likely feeling your most sociable and energized.";
    return "Luteal phase. You might feel your energy shift inward. Honor your pace.";
  }

  Widget _buildHeader(DateTime date) {
    final months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    final dateStr = '${date.day} ${months[date.month - 1]}';
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Today, $dateStr',
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            fontFamily: 'Playfair Display',
            color: Color(0xFFC15F3C),
          ),
        ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.1),
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.calendar_month, color: Colors.black54),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.person_outline, color: Colors.black54),
              onPressed: () {},
            ),
          ],
        ).animate().fadeIn(duration: 400.ms, delay: 200.ms),
      ],
    );
  }

  Widget _buildBottomNav() {
    return NavigationBar(
      backgroundColor: Colors.white.withOpacity(0.9),
      elevation: 0,
      indicatorColor: const Color(0xFFC15F3C).withOpacity(0.2),
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Today'),
        NavigationDestination(icon: Icon(Icons.insights_outlined), selectedIcon: Icon(Icons.insights), label: 'Insights'),
        NavigationDestination(icon: Icon(Icons.favorite_outline), selectedIcon: Icon(Icons.favorite), label: 'Wellness'),
      ],
    );
  }
}
