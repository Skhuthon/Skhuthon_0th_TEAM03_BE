import {
  Any,
  ArrayContains,
  ArrayContainedBy,
  ArrayOverlap,
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

/**
 * where__id__not을
 *
 * {
 *   where:{
 *     id: Not(value)
 *   }
 * }
 */
export const FILTER_MAPPER = {
  more_than: MoreThan,
  more_than_or_equal: MoreThanOrEqual,
  less_than: LessThan,
  less_than_or_equal: LessThanOrEqual,
  equal: Equal,
  like: Like,
  i_like: ILike,
  in: In,
  not: Not,
  is_null: IsNull,
  between: Between,
  array_contains: ArrayContains,
  array_contained_by: ArrayContainedBy,
  array_overlap: ArrayOverlap,
  any: Any,
};
