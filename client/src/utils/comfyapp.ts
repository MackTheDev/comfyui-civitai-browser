export let app: never | null = null;
const api_base = location.pathname.split("/").slice(0, -1).join("/");

export let api: never | null = null;

export async function waitForApp() {
  await Promise.all([
    import(api_base + "/scripts/api.js").then((apiJs) => {
      api = apiJs?.api;
    }),

    import(api_base + "/scripts/app.js").then((appJs) => {
      app = appJs?.app;
    }),
  ]);
}
