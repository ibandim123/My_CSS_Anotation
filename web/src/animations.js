/* Copyright (c) 2020, Roman Cinis.

Background GIF Image: Title "GALAXY OF TERROR_1981_E D FARINO_FOUNTAIN" (https://flic.kr/p/7M3Knv) by tonechootero (https://www.flickr.com/photos/tonechootero) is licensed under CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0).
*/
import 'dart:ui';

import 'package:flutter/material.dart' show Theme;
import 'package:flutter/widgets.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) => WidgetsApp(
      debugShowCheckedModeBanner: false,
      color: const Color(0xFF000000),
      builder: (context, child) => const HomeScreen());
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) => Container(
        color: const Color(0xFF000000),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Opacity(
              opacity: 0.5,
              child: Container(
                decoration: const BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage('https://farm3.static.flickr.com/2770/4447919051_3123442a01_o.gif'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
            Opacity(opacity: 0.75, child: const Text('glitch!\nclick☌', textAlign: TextAlign.center).glitchText)
          ],
        ),
      );
}

extension GlitchExtension on Text {
  _Glitch get glitchText => _Glitch(child: this);
}

class _Glitch extends StatefulWidget {
  const _Glitch({Key key, this.child}) : super(key: key);

  final Text child;

  @override
  _GlitchState createState() => _GlitchState();
}

class _GlitchState extends State<_Glitch> with SingleTickerProviderStateMixin {
  AnimationController _animationController;
  Animation<double> _glitchAnimation;
  bool _stoped = false;

  @override
  void dispose() {
    _animationController?.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200));
    _glitchAnimation = Tween(begin: 1.0, end: 3.0).animate(
        CurvedAnimation(curve: Curves.bounceInOut, reverseCurve: Curves.slowMiddle, parent: _animationController));

    _animationController.addStatusListener((AnimationStatus _status) {
      if (_status == AnimationStatus.completed && _stoped == false) {
        _animationController.reverse();
      } else if (_status == AnimationStatus.dismissed && _stoped == false) {
        _animationController.forward();
      }
    });
    _animationController.forward();
  }

  void _glitch() {
    _stoped = !_stoped;
    _stoped ? _animationController.reset() : _animationController.forward(from: 0.7);
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: _glitch,
        child: AnimatedBuilder(
          animation: _animationController,
          builder: (context, child) => Align(
            alignment: Alignment(_glitchAnimation.value / 250, _glitchAnimation.value / 200),
            child: Stack(
              children: [
                Positioned(
                    top: _glitchAnimation.value,
                    right: _glitchAnimation.value * 1.5,
                    child: _GlitchText(text: widget, color: const Color(0xFF00BCD4).withOpacity(0.85))),
                Positioned(
                    bottom: _glitchAnimation.value,
                    left: _glitchAnimation.value * 1.5,
                    child: _GlitchText(text: widget, color: const Color(0xFFe91e63).withOpacity(0.85))),
                Positioned(
                  bottom: _glitchAnimation.value,
                  left: _glitchAnimation.value,
                  child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: _glitchAnimation.value, sigmaY: _glitchAnimation.value),
                      child: _GlitchText(text: widget, color: const Color(0xFFffffff).withOpacity(0.1))),
                ),
                Opacity(
                    opacity: 1.7 - (0.7 + (_glitchAnimation.value) * 0.1).toDouble(),
                    child: _GlitchText(text: widget, color: const Color(0xFFdedede))),
              ],
            ),
          ),
        ),
      );
}

class _GlitchText extends StatelessWidget {
  const _GlitchText({Key key, @required this.text, this.color}) : super(key: key);

  final Color color;
  final _Glitch text;

  @override
  Widget build(BuildContext context) =>
      DefaultTextStyle(child: text.child, style: Theme.of(context).textTheme.headline1.copyWith(color: color, height: 0.8));
}
