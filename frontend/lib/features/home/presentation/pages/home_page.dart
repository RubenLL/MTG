import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/config/dependency_injection.dart';
import '../../../../core/routes/route_names.dart';
import '../../../../core/widgets/error_widget.dart' as error_widget;
import '../../../../core/widgets/loading_widget.dart';
import '../bloc/home_bloc.dart';
import '../bloc/home_event.dart';
import '../bloc/home_state.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<HomeBloc>()..add(const HomeEvent.getHomeData()),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('MTG Deck Analyzer'),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                context.read<HomeBloc>().add(const HomeEvent.refreshHomeData());
              },
            ),
          ],
        ),
        body: BlocBuilder<HomeBloc, HomeState>(
          builder: (context, state) {
            return state.maybeWhen(
              initial: () => const LoadingWidget(),
              loading: () => const LoadingWidget(message: 'Loading...'),
              loaded: (homeEntity) => _HomeContent(homeEntity: homeEntity),
              error: (message) => error_widget.ErrorWidget(
                failure: ValidationFailure(message),
                onRetry: () {
                  context.read<HomeBloc>().add(const HomeEvent.getHomeData());
                },
              ),
              orElse: () => const SizedBox(),
            );
          },
        ),
      ),
    );
  }
}

class _HomeContent extends StatelessWidget {
  final dynamic homeEntity;

  const _HomeContent({required this.homeEntity});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome to MTG Deck Analyzer',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Analyze and validate your Magic: The Gathering decks with ease.',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Features',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          _FeatureCard(
            title: 'Deck Validation',
            description: 'Validate your deck against format rules and restrictions',
            icon: Icons.verified,
            onTap: () {
              Navigator.pushNamed(context, RouteNames.deckValidation);
            },
          ),
          const SizedBox(height: 12),
          _FeatureCard(
            title: 'Card Lookup',
            description: 'Search and get detailed information about MTG cards',
            icon: Icons.search,
            onTap: () {
              // TODO: Navigate to card lookup
            },
          ),
          const SizedBox(height: 12),
          _FeatureCard(
            title: 'Format Selection',
            description: 'Choose from various MTG formats for validation',
            icon: Icons.format_list_bulleted,
            onTap: () {
              // TODO: Navigate to format selection
            },
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final VoidCallback onTap;

  const _FeatureCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor,
          child: Icon(
            icon,
            color: Colors.white,
          ),
        ),
        title: Text(title),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
