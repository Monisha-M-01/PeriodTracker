import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:math';
import 'package:frontend/shared/widgets/glass_card.dart';

class HeroProgressRing extends StatelessWidget {
  final int currentDay;
  final int totalDays;
  final String phaseName;
  final int? daysUntilNext;

  const HeroProgressRing({
    super.key,
    required this.currentDay,
    required this.totalDays,
    required this.phaseName,
    this.daysUntilNext,
  });

  @override
  Widget build(BuildContext context) {
    final double progress = (currentDay / totalDays).clamp(0.0, 1.0);
    final theme = Theme.of(context);

    return Stack(
      alignment: Alignment.center,
      children: [
        // Background Ring and Animated Progress Ring
        SizedBox(
          width: 280,
          height: 280,
          child: CustomPaint(
            painter: RingPainter(
              progress: progress,
              color: theme.colorScheme.primary,
              backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
            ),
          ).animate().fadeIn(duration: 800.ms, delay: 200.ms),
        ),
        
        // Glass Card Overlay with Data
        SizedBox(
          width: 280,
          height: 280,
          child: GlassCard(
            blur: 15,
            opacity: 0.1,
            borderRadius: BorderRadius.circular(140),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  phaseName.toUpperCase(),
                  style: theme.textTheme.labelMedium?.copyWith(
                    letterSpacing: 2.0,
                    color: Colors.black54,
                    fontWeight: FontWeight.w600,
                  ),
                ).animate().slideY(begin: 0.5, end: 0, duration: 600.ms, curve: Curves.easeOutBack),
                
                const SizedBox(height: 12),
                
                if (daysUntilNext != null) ...[
                  Text(
                    daysUntilNext! > 0 ? "Period in" : daysUntilNext! == 0 ? "Period expected" : "Period is",
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontFamily: 'Playfair Display',
                      color: Colors.black87,
                    ),
                  ),
                  Text(
                    daysUntilNext! == 0 ? "Today" : "${daysUntilNext!.abs()}",
                    style: TextStyle(
                      fontSize: 72,
                      height: 1.1,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Playfair Display',
                      color: theme.colorScheme.primary,
                    ),
                  ).animate().scale(begin: const Offset(0.8, 0.8), curve: Curves.elasticOut, duration: 1200.ms),
                  if (daysUntilNext! != 0)
                    Text(
                      daysUntilNext! < 0 ? "days late" : "days",
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontFamily: 'Playfair Display',
                        color: Colors.black87,
                      ),
                    ),
                ] else ...[
                  Text(
                    "No predictions yet",
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontFamily: 'Playfair Display',
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Log your period\nto get insights",
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.black54,
                    ),
                  ),
                ],
              ],
            ),
          ).animate(onPlay: (controller) => controller.repeat(reverse: true))
           .scale(begin: const Offset(1.0, 1.0), end: const Offset(1.02, 1.02), duration: 4.seconds, curve: Curves.easeInOutSine),
        ),
      ],
    );
  }
}

class RingPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color backgroundColor;

  RingPainter({
    required this.progress,
    required this.color,
    required this.backgroundColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width / 2, size.height / 2) - 10;
    
    final bgPaint = Paint()
      ..color = backgroundColor
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke;
      
    final progressPaint = Paint()
      ..color = color
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawCircle(center, radius, bgPaint);
    
    // Start from top (-pi / 2)
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * progress,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(RingPainter oldDelegate) {
    return oldDelegate.progress != progress ||
           oldDelegate.color != color ||
           oldDelegate.backgroundColor != backgroundColor;
  }
}
