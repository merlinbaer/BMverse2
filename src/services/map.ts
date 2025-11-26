export function dictToSortedArray(dict: Record<string, any>) {
  return Object.values(dict).sort((a: any, b: any) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
