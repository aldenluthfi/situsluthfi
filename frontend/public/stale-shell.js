// Served by nginx in place of a missing /assets/* file. That only happens when
// the browser is running an HTML shell cached from an older deploy, so reload
// once to pick up the current one.
try {
  if (!sessionStorage.getItem("stale-shell-reloaded")) {
    sessionStorage.setItem("stale-shell-reloaded", "1")
    location.reload()
  }
} catch {
  // storage blocked: do nothing rather than risk a reload loop
}
