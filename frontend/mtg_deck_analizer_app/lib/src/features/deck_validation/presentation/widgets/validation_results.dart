import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/entities/deck_validation_entity.dart';
import '../bloc/deck_validation_bloc.dart';
import '../bloc/deck_validation_state.dart';

class ValidationResults extends StatelessWidget {
  const ValidationResults({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DeckValidationBloc, DeckValidationState>(
      builder: (context, state) {
        if (state is DeckValidationInitial) {
          return const SizedBox.shrink();
        }

        if (state is DeckValidationLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is DeckValidationFailure) {
          return Card(
            color: Theme.of(context).colorScheme.errorContainer,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                state.errorMessage ?? 'An unknown error occurred',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onErrorContainer,
                ),
              ),
            ),
          );
        }

        if (state is! DeckValidationSuccess) {
          return const SizedBox.shrink();
        }

        final result = state.validationResult;
        if (result == null) {
          return const SizedBox.shrink();
        }

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  result.isValid ? '✅ Valid Deck' : '❌ Invalid Deck',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 8),
                Text('Format: ${result.format}'),
                Text('Main Deck: ${result.mainDeckCount} cards'),
                if (result.sideboardCount > 0)
                  Text('Sideboard: ${result.sideboardCount} cards'),
                if (result.issues.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  const Text(
                    'Issues:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...result.issues.map((issue) => Text('• $issue')).toList(),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
