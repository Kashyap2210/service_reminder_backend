import { ISearchV2Response } from '../types/generic.dto.types';
import { EntityList, EntityType } from '../utils/entity.utils';

/**
 * Helper class for extracting typed entities from a `searchV2` response.
 *
 * @example new EntityFilterDataHelper(searchV2Response)
 *
 * @methods
 * - `getEntityFromList(name)` — returns typed entity array for the given `EntityList` key. e.g. `helper.getEntityFromList(EntityList.USER) // IUserEntity[]`
 */
export class EntityFilterDataHelper {
  constructor(private readonly searchResponse: ISearchV2Response) {}

  getEntityFromList<T extends EntityList>(name: T): EntityType<T>[] {
    return this.searchResponse[name] ?? [];
  }
}
