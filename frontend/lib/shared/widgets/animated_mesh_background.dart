import 'package:flutter/material.dart';
import 'package:mesh_gradient/mesh_gradient.dart';

class AnimatedMeshBackground extends StatelessWidget {
  const AnimatedMeshBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedMeshGradient(
      colors: const [
        Color(0xFFFFF0E6), // Peach
        Color(0xFFFBE7E1), // Rose
        Color(0xFFFFFDFB), // White
        Color(0xFFF9D5C5), // Deeper peach
      ],
      options: AnimatedMeshGradientOptions(
        speed: 2,
        amplitude: 30,
        frequency: 5,
        grain: 0.1, // Slight grain for premium feel
      ),
    );
  }
}
