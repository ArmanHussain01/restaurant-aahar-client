export function toApiError(error) {
  console.error("[delivery api error]", error); // shows the real cause

  const status = error?.response?.status ?? null;
  const server = error?.response?.data?.message || error?.response?.data?.error;
  let message;

  if (error?.response) {
    if (status === 401) message = "Your session has expired. Log in again to continue.";
    else if (status === 403) message = "You don't have permission to do this.";
    else if (status === 404) message = server || "We couldn't find what you asked for.";
    else if (status === 409) message = server || "This delivery was changed elsewhere. Showing the latest status.";
    else message = server || `Request failed (${status}).`;
  } else if (error?.isAxiosError) {
    message = "Can't reach the server. Check your connection, the API URL and CORS.";
  } else {
    message = `App error: ${error?.message ?? "unknown"}`; // a bug in code, not the network
  }
  return { status, message };
}