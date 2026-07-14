export function filterBySearch(items, searchTerm, fields = []) {
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return items;
  }

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value != null && String(value).toLowerCase().includes(query);
    })
  );
}

export function sortResultsByVotes(results = []) {
  return [...results].sort(
    (a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0)
  );
}
