// UNVERIFIED: assumes the auth reducer is mounted at state.auth with { user, jwt }.
export const selectAuth = (s) => s.auth ?? {};
export const selectAuthUser = (s) => s.auth?.user ?? null;
export const selectIsAuthenticated = (s) => Boolean(s.auth?.jwt || s.auth?.user);
