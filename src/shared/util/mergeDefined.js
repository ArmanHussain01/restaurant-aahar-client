const isEmpty = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

export const mergeDefined = (base = {}, incoming = {}) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(incoming)) if (!isEmpty(v)) out[k] = v;
  return out;
};

export const fillMissing = (base = {}, fallback = {}) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(fallback)) if (isEmpty(out[k]) && !isEmpty(v)) out[k] = v;
  return out;
};