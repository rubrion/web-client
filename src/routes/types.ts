export type RouteObject = {
  path: string;
  label: string;
  description?: string;
};

export type DynamicRoute<T extends Record<string, string | number>> = (
  params: T
) => string;
