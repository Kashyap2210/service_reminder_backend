import { EntityList, OrderByDirection } from 'service_reminder_common';

export const EntitySearchRequestExample = {
  name: EntityList.RECURRING_ITEM,
  filter: {
    userId: [3],
    columnKeys: ['id', 'name', 'type', 'servicePeriod', 'servicePeriodUnit'],
    orderBy: { createdOn: OrderByDirection.DESC },
    limit: 10,
    relations: [
      {
        name: EntityList.USER,
        include: {
          id: [3],
        },
        columnKeys: ['id', 'name', 'email'],
      },
    ],
  },
};

export const EntitySearchResponseExample: Record<string, any[]> = {
  [EntityList.RECURRING_ITEM]: [
    {
      id: 1,
      name: 'Oil Change',
      type: 'oil_change',
      servicePeriod: 3,
      servicePeriodUnit: 'month',
      userId: 3,
      createdOn: '2024-01-01T00:00:00.000Z',
      updatedOn: '2024-01-01T00:00:00.000Z',
    },
  ],
  [EntityList.USER]: [
    {
      id: 3,
      name: 'John Doe',
      email: 'john@example.com',
    },
  ],
};
