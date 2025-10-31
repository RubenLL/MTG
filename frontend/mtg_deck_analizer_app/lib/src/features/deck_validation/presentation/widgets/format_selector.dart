import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:mtg_deck_analizer_app/src/features/deck_validation/presentation/bloc/deck_validation_bloc.dart';
import 'package:mtg_deck_analizer_app/src/features/deck_validation/presentation/bloc/deck_validation_state.dart';
import 'package:mtg_deck_analizer_app/src/features/deck_validation/presentation/bloc/deck_validation_event.dart';

class FormatSelector extends StatelessWidget {
  final List<String> formats = const [
    'Standard',
    'Modern',
    'Pioneer',
    'Commander',
    'Pauper',
    'Legacy',
    'Vintage',
  ];

  const FormatSelector({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DeckValidationBloc, DeckValidationState>(
      builder: (context, state) {
        return DropdownButtonFormField<String>(
          value: state.format,
          decoration: const InputDecoration(
            labelText: 'Select Format',
            border: OutlineInputBorder(),
          ),
          items: formats
              .map((format) => DropdownMenuItem(
                    value: format.toLowerCase(),
                    child: Text(format),
                  ))
              .toList(),
          onChanged: (value) {
            if (value != null) {
              context.read<DeckValidationBloc>().add(FormatChanged(value));
            }
          },
        );
      },
    );
  }
}
