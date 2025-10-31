import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/deck_validation_bloc.dart';
import '../bloc/deck_validation_event.dart';
import '../bloc/deck_validation_state.dart';

class DeckInputField extends StatelessWidget {
  const DeckInputField({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DeckValidationBloc, DeckValidationState>(
      builder: (context, state) {
        return TextField(
          maxLines: 10,
          decoration: InputDecoration(
            labelText: 'Enter your deck list (one card per line)',
            hintText: '4x Lightning Bolt\n4x Counterspell\n...',
            border: const OutlineInputBorder(),
            errorText: state?.errorMessage,
          ),
          onChanged: (value) {
            context.read<DeckValidationBloc>().add(DeckListChanged(value));
          },
        );
      },
    );
  }
}
