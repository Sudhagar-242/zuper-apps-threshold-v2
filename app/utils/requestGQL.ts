


export const requestQuery = async <T>(admin: any, query: string): Promise<T> => {
  const response = await admin.graphql(query);
  const data = (await response.json());
  return data?.data;
};

export const requestMutation = async <T>(
  admin: any,
  query: string,
  variables: Record<string, any>,
): Promise<T> => {
  const response = await admin.graphql(query, variables);
  const data = (await response.json());
  return data?.data;
};
