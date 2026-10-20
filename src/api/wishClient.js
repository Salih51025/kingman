const API_URL = import.meta.env.VITE_API_URL || "";

async function api(path, options = {}) {
  if (!API_URL) {
    return { ok: false, errorCode: "noApi" };
  }
  try {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "wish-battle",
        ...(options.headers || {}),
      },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    return { status: response.status, ...data };
  } catch {
    return { ok: false, errorCode: "unreachable" };
  }
}

export function recordWish(payload) {
  return api("/api/wishes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function developerLogin(password) {
  return api("/api/developer/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function developerLogout() {
  return api("/api/developer/logout", { method: "POST" });
}

export function developerSession() {
  return api("/api/developer/session");
}

export function listDeveloperWishes({ offset = 0, limit = 20 } = {}) {
  return api(`/api/developer/wishes?offset=${offset}&limit=${limit}`);
}

export function deleteDeveloperWish(id) {
  return api(`/api/developer/wishes/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function hasWishApi() {
  return Boolean(API_URL);
}
