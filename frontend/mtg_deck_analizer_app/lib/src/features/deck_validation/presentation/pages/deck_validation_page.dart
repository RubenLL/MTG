import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/deck_validation_bloc.dart';
import '../widgets/deck_input_field.dart';
import '../widgets/format_selector.dart';
import '../widgets/validation_results.dart';

class DeckValidationPage extends StatelessWidget {
  const DeckValidationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MTG Deck Validator'),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: () {
              // TODO: Show help dialog
            },
          ),
        ],
      ),
      body: BlocProvider(
        create: (context) => DeckValidationBloc(),
        child: const _DeckValidationView(),
      ),
    );
  }
}

class _DeckValidationView extends StatelessWidget {
  const _DeckValidationView();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: const [
          FormatSelector(),
          SizedBox(height: 16),
          DeckInputField(),
          SizedBox(height: 16),
          ValidationResults(),
        ],
      ),
    );
  }
}
