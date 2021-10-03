export function queryExists(queryName: string, query: any): boolean {
  return Object.keys(query).includes(queryName);
}
