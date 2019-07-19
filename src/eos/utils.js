import rpc from "./rpc";

const MAX_PAGINATION_FETCHES = 5;

const defaultOptions = {
  json: true,
  lower_bound: undefined,
  upper_bound: undefined,
  limit: 9999
};

export async function fetchRows(options) {
  const mergedOptions = {
    ...defaultOptions,
    ...options
  };

  let lowerBound = mergedOptions.lower_bound;

  const result = await rpc.get_table_rows({
    ...mergedOptions,
    lower_bound: lowerBound
  });

  return result.rows;
}

export async function fetchAllRows(options, indexName = `id`) {
  const mergedOptions = {
    ...defaultOptions,
    ...options
  };

  let rows = [];
  let lowerBound = mergedOptions.lower_bound;

  for (let i = 0; i < MAX_PAGINATION_FETCHES; i++) {
    const result = await rpc.get_table_rows({
      ...mergedOptions,
      lower_bound: lowerBound
    });
    rows = rows.concat(result.rows);

    if (!result.more || result.rows.length === 0) break;

    lowerBound = result.rows[result.rows.length - 1][indexName] + 1;
  }

  return rows;
}
