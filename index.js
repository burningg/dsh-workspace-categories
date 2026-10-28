/**
 * Host half of @burningg/dsh-workspace-categories.
 *
 * The feature is entirely a browser-side panel: workspace categories are a
 * viewer preference stored in the page's localStorage, next to the shipped
 * browser-persisted grouping and expansion state. The Host row exists so the
 * Loader has an entry whose `dsh.client` bundle can be composed and served.
 */
export function apply(ctx) {
  // No host services: everything lives in the browser half.
  void ctx;
}
