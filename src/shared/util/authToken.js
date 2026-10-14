// Same header shape your other actions use.
export const authHeaders = (jwt) => {
  const token = typeof jwt === "string" && jwt ? jwt : localStorage.getItem("jwt");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Redux jwt is null after a page refresh, so fall back to the token saved by loginUser.
export const selectJwt = (s) => s.auth?.jwt || localStorage.getItem("jwt");
