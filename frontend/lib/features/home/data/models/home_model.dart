import 'package:equatable/equatable.dart';

import '../../domain/entities/home_entity.dart';

class HomeModel extends Equatable {
  final String title;
  final String description;

  const HomeModel({
    required this.title,
    required this.description,
  });

  factory HomeModel.fromJson(Map<String, dynamic> json) {
    return HomeModel(
      title: json['title'] as String,
      description: json['description'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
    };
  }

  HomeEntity toEntity() {
    return HomeEntity(
      title: title,
      description: description,
    );
  }

  @override
  List<Object> get props => [title, description];
}
