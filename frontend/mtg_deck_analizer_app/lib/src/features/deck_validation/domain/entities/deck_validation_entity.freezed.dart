// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_validation_entity.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

/// @nodoc
mixin _$DeckValidationEntity {
  String get deckList => throw _privateConstructorUsedError;
  String get format => throw _privateConstructorUsedError;
  bool get isValid => throw _privateConstructorUsedError;
  int get mainDeckCount => throw _privateConstructorUsedError;
  int get sideboardCount => throw _privateConstructorUsedError;
  List<String> get issues => throw _privateConstructorUsedError;
  DateTime get lastValidated => throw _privateConstructorUsedError;

  /// Create a copy of DeckValidationEntity
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DeckValidationEntityCopyWith<DeckValidationEntity> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeckValidationEntityCopyWith<$Res> {
  factory $DeckValidationEntityCopyWith(
    DeckValidationEntity value,
    $Res Function(DeckValidationEntity) then,
  ) = _$DeckValidationEntityCopyWithImpl<$Res, DeckValidationEntity>;
  @useResult
  $Res call({
    String deckList,
    String format,
    bool isValid,
    int mainDeckCount,
    int sideboardCount,
    List<String> issues,
    DateTime lastValidated,
  });
}

/// @nodoc
class _$DeckValidationEntityCopyWithImpl<
  $Res,
  $Val extends DeckValidationEntity
>
    implements $DeckValidationEntityCopyWith<$Res> {
  _$DeckValidationEntityCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DeckValidationEntity
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? deckList = null,
    Object? format = null,
    Object? isValid = null,
    Object? mainDeckCount = null,
    Object? sideboardCount = null,
    Object? issues = null,
    Object? lastValidated = null,
  }) {
    return _then(
      _value.copyWith(
            deckList: null == deckList
                ? _value.deckList
                : deckList // ignore: cast_nullable_to_non_nullable
                      as String,
            format: null == format
                ? _value.format
                : format // ignore: cast_nullable_to_non_nullable
                      as String,
            isValid: null == isValid
                ? _value.isValid
                : isValid // ignore: cast_nullable_to_non_nullable
                      as bool,
            mainDeckCount: null == mainDeckCount
                ? _value.mainDeckCount
                : mainDeckCount // ignore: cast_nullable_to_non_nullable
                      as int,
            sideboardCount: null == sideboardCount
                ? _value.sideboardCount
                : sideboardCount // ignore: cast_nullable_to_non_nullable
                      as int,
            issues: null == issues
                ? _value.issues
                : issues // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            lastValidated: null == lastValidated
                ? _value.lastValidated
                : lastValidated // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DeckValidationEntityImplCopyWith<$Res>
    implements $DeckValidationEntityCopyWith<$Res> {
  factory _$$DeckValidationEntityImplCopyWith(
    _$DeckValidationEntityImpl value,
    $Res Function(_$DeckValidationEntityImpl) then,
  ) = __$$DeckValidationEntityImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String deckList,
    String format,
    bool isValid,
    int mainDeckCount,
    int sideboardCount,
    List<String> issues,
    DateTime lastValidated,
  });
}

/// @nodoc
class __$$DeckValidationEntityImplCopyWithImpl<$Res>
    extends _$DeckValidationEntityCopyWithImpl<$Res, _$DeckValidationEntityImpl>
    implements _$$DeckValidationEntityImplCopyWith<$Res> {
  __$$DeckValidationEntityImplCopyWithImpl(
    _$DeckValidationEntityImpl _value,
    $Res Function(_$DeckValidationEntityImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DeckValidationEntity
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? deckList = null,
    Object? format = null,
    Object? isValid = null,
    Object? mainDeckCount = null,
    Object? sideboardCount = null,
    Object? issues = null,
    Object? lastValidated = null,
  }) {
    return _then(
      _$DeckValidationEntityImpl(
        deckList: null == deckList
            ? _value.deckList
            : deckList // ignore: cast_nullable_to_non_nullable
                  as String,
        format: null == format
            ? _value.format
            : format // ignore: cast_nullable_to_non_nullable
                  as String,
        isValid: null == isValid
            ? _value.isValid
            : isValid // ignore: cast_nullable_to_non_nullable
                  as bool,
        mainDeckCount: null == mainDeckCount
            ? _value.mainDeckCount
            : mainDeckCount // ignore: cast_nullable_to_non_nullable
                  as int,
        sideboardCount: null == sideboardCount
            ? _value.sideboardCount
            : sideboardCount // ignore: cast_nullable_to_non_nullable
                  as int,
        issues: null == issues
            ? _value._issues
            : issues // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        lastValidated: null == lastValidated
            ? _value.lastValidated
            : lastValidated // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc

class _$DeckValidationEntityImpl extends _DeckValidationEntity {
  const _$DeckValidationEntityImpl({
    required this.deckList,
    required this.format,
    required this.isValid,
    required this.mainDeckCount,
    required this.sideboardCount,
    required final List<String> issues,
    required this.lastValidated,
  }) : _issues = issues,
       super._();

  @override
  final String deckList;
  @override
  final String format;
  @override
  final bool isValid;
  @override
  final int mainDeckCount;
  @override
  final int sideboardCount;
  final List<String> _issues;
  @override
  List<String> get issues {
    if (_issues is EqualUnmodifiableListView) return _issues;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_issues);
  }

  @override
  final DateTime lastValidated;

  @override
  String toString() {
    return 'DeckValidationEntity(deckList: $deckList, format: $format, isValid: $isValid, mainDeckCount: $mainDeckCount, sideboardCount: $sideboardCount, issues: $issues, lastValidated: $lastValidated)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeckValidationEntityImpl &&
            (identical(other.deckList, deckList) ||
                other.deckList == deckList) &&
            (identical(other.format, format) || other.format == format) &&
            (identical(other.isValid, isValid) || other.isValid == isValid) &&
            (identical(other.mainDeckCount, mainDeckCount) ||
                other.mainDeckCount == mainDeckCount) &&
            (identical(other.sideboardCount, sideboardCount) ||
                other.sideboardCount == sideboardCount) &&
            const DeepCollectionEquality().equals(other._issues, _issues) &&
            (identical(other.lastValidated, lastValidated) ||
                other.lastValidated == lastValidated));
  }

  @override
  int get hashCode => Object.hash(
    runtimeType,
    deckList,
    format,
    isValid,
    mainDeckCount,
    sideboardCount,
    const DeepCollectionEquality().hash(_issues),
    lastValidated,
  );

  /// Create a copy of DeckValidationEntity
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DeckValidationEntityImplCopyWith<_$DeckValidationEntityImpl>
  get copyWith =>
      __$$DeckValidationEntityImplCopyWithImpl<_$DeckValidationEntityImpl>(
        this,
        _$identity,
      );
}

abstract class _DeckValidationEntity extends DeckValidationEntity {
  const factory _DeckValidationEntity({
    required final String deckList,
    required final String format,
    required final bool isValid,
    required final int mainDeckCount,
    required final int sideboardCount,
    required final List<String> issues,
    required final DateTime lastValidated,
  }) = _$DeckValidationEntityImpl;
  const _DeckValidationEntity._() : super._();

  @override
  String get deckList;
  @override
  String get format;
  @override
  bool get isValid;
  @override
  int get mainDeckCount;
  @override
  int get sideboardCount;
  @override
  List<String> get issues;
  @override
  DateTime get lastValidated;

  /// Create a copy of DeckValidationEntity
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DeckValidationEntityImplCopyWith<_$DeckValidationEntityImpl>
  get copyWith => throw _privateConstructorUsedError;
}
