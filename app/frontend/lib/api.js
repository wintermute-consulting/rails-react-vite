function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content;
}

async function request(url, { method = "GET", body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      data?.errors?.join(", ") ||
      data?.error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: "POST", body }),
  put: (url, body) => request(url, { method: "PUT", body }),
  delete: (url) => request(url, { method: "DELETE" }),
};
