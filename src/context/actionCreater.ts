export const actionCreator =
  (type: string) => (payload: Record<string, any>) => ({ type, payload });
