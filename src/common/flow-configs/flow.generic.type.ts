export type IFlowConfig<
  StatusEnum extends String,
  ActionEnum extends String,
> = {
  [S in StatusEnum & string]: {
    actions: Partial<{
      [A in ActionEnum & string]: {
        next: () => StatusEnum;
      };
    }>;
  };
};
