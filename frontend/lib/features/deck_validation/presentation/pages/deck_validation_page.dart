import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/config/dependency_injection.dart';
import '../../../../core/widgets/error_widget.dart' as error_widget;
import '../../../../core/widgets/loading_widget.dart';
import '../bloc/deck_validation_bloc.dart';
import '../bloc/deck_validation_event.dart';
import '../bloc/deck_validation_state.dart';

class DeckValidationPage extends StatefulWidget {
  const DeckValidationPage({super.key});

  @override
  State<DeckValidationPage> createState() => _DeckValidationPageState();
}

class _DeckValidationPageState extends State<DeckValidationPage> {
  final _deckListController = TextEditingController();
  String _selectedFormat = 'Standard';

  final List<String> _formats = [
    'Standard',
    'Modern',
    'Pioneer',
    'Legacy',
    'Vintage',
    'Pauper',
    'Commander',
    'Draft',
    'Sealed',
  ];

  @override
  void dispose() {
    _deckListController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<DeckValidationBloc>(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Deck Validation'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Enter your deck list',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Format: 4x Lightning Bolt (DMU) 123 or 4 Lightning Bolt',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 16),
              _buildFormatSelector(),
              const SizedBox(height: 16),
              _buildDeckListInput(),
              const SizedBox(height: 16),
              _buildValidateButton(),
              const SizedBox(height: 24),
              Expanded(
                child: _buildValidationResults(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFormatSelector() {
    return DropdownButtonFormField<String>(
      value: _selectedFormat,
      decoration: const InputDecoration(
        labelText: 'Format',
        border: OutlineInputBorder(),
      ),
      items: _formats.map((format) {
        return DropdownMenuItem(
          value: format,
          child: Text(format),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedFormat = value!;
        });
      },
    );
  }

  Widget _buildDeckListInput() {
    return TextField(
      controller: _deckListController,
      decoration: const InputDecoration(
        labelText: 'Deck List',
        hintText: '4x Lightning Bolt (DMU) 123\n4x Mountain\n\nSideboard:\n2x Rest in Peace',
        border: OutlineInputBorder(),
        alignLabelWithHint: true,
      ),
      maxLines: 15,
      textAlignVertical: TextAlignVertical.top,
    );
  }

  Widget _buildValidateButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _validateDeck,
        child: const Text('Validate Deck'),
      ),
    );
  }

  Widget _buildValidationResults() {
    return BlocBuilder<DeckValidationBloc, DeckValidationState>(
      builder: (context, state) {
        return state.maybeWhen(
          initial: () => const _InitialResults(),
          loading: () => const LoadingWidget(message: 'Validating deck...'),
          loaded: (validationResult) => _ValidationResultsWidget(
            validationResult: validationResult,
          ),
          error: (message) => error_widget.ErrorWidget(
            failure: ValidationFailure(message),
            onRetry: () => _validateDeck(),
          ),
          orElse: () => const SizedBox(),
        );
      },
    );
  }

  void _validateDeck() {
    final deckList = _deckListController.text
        .split('\n')
        .where((line) => line.trim().isNotEmpty)
        .toList();

    if (deckList.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a deck list'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    context.read<DeckValidationBloc>().add(
      DeckValidationEvent.validateDeck(
        deckList: deckList,
        format: _selectedFormat,
      ),
    );
  }
}

class _InitialResults extends StatelessWidget {
  const _InitialResults();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.deck,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'Enter your deck list and select a format to validate',
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _ValidationResultsWidget extends StatelessWidget {
  final dynamic validationResult;

  const _ValidationResultsWidget({required this.validationResult});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  validationResult.isValid ? Icons.check_circle : Icons.error,
                  color: validationResult.isValid ? Colors.green : Colors.red,
                ),
                const SizedBox(width: 8),
                Text(
                  validationResult.isValid ? 'Valid Deck' : 'Invalid Deck',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: validationResult.isValid ? Colors.green : Colors.red,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text('Format: ${validationResult.format}'),
            Text('Main Deck: ${validationResult.mainDeckCount} cards'),
            Text('Sideboard: ${validationResult.sideboardCount} cards'),
            if (validationResult.warnings.isNotEmpty) ...[
              const SizedBox(height: 16),
              Text(
                'Warnings:',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              ...validationResult.warnings.map((warning) => Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.warning, size: 16, color: Colors.orange.shade600),
                    const SizedBox(width: 8),
                    Expanded(child: Text(warning)),
                  ],
                ),
              )),
            ],
            if (validationResult.errors.isNotEmpty) ...[
              const SizedBox(height: 16),
              Text(
                'Errors:',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              ...validationResult.errors.map((error) => Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.error_outline, size: 16, color: Colors.red.shade600),
                    const SizedBox(width: 8),
                    Expanded(child: Text('${error.cardName}: ${error.message}')),
                  ],
                ),
              )),
            ],
          ],
        ),
      ),
    );
  }
}
