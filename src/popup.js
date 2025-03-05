import "./browser-polyfill.js";

document.addEventListener("DOMContentLoaded", async () => {
  const textarea = document.getElementById("textarea");

  // Display shortcuts
  const storage = await browser.storage.sync.get("shortcuts");
  if (storage.shortcuts) {
    textarea.value = JSON.stringify(storage.shortcuts, null, 2);
  }

  // Save shortcuts 0.8 secs after user stops typing
  let typingTimer;
  const typingDelay = 800;
  textarea.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      setShortcuts(textarea.value);
    }, typingDelay);
  });
  textarea.addEventListener("keydown", () => {
    clearTimeout(typingTimer);
  });
});

document.addEventListener("visibilitychange", function () {
  // Try to save shortcut when popup window closes
  if (document.visibilityState === "hidden") {
    const textarea = document.getElementById("textarea");
    setShortcuts(textarea.value);
  }
});

/** Validate and then save shortcuts to browser.storage.sync */
function setShortcuts(shortcutsJson) {
  let shortcuts;
  try {
    shortcuts = JSON.parse(shortcutsJson);
  } catch {
    showToast("Shortcuts must be a valid JSON!");
    return;
  }

  isValidShortcut(shortcuts);
  ensureHttps(shortcuts);

  try {
    browser.storage.sync.set({
      shortcuts: shortcuts,
    });
    showToast("Shortcuts saved!", true);
  } catch (err) {
    console.error(err);
    showToast("Error saving shortcuts to browser.storage.sync!");
  }
}

/** Make sure shortcuts follows the schema for Charon */
function isValidShortcut(shortcuts) {
  const MAX_SHORTCUTS = 100;
  const MAX_NESTED_SHORTCUTS = 10;

  if (Object.keys(shortcuts).length > MAX_SHORTCUTS) {
    const err = `Too many shortcuts! Limit is ${MAX_SHORTCUTS}.`;
    showToast(err);
    throw new Error(err);
  }

  function isValidUrl(item) {
    try {
      const url = new URL(item.includes("://") ? item : `https://${item}`);
      return !!url.hostname;
    } catch {
      return false;
    }
  }

  // O(n x m) at worst case
  for (const key in shortcuts) {
    const shortcut = shortcuts[key];

    // Validate string item
    if (typeof shortcut === "string") {
      if (!isValidUrl(shortcut)) {
        const err = `Invalid URL: ${shortcut}`;
        showToast(err);
        throw new Error(err);
      }

      continue;
    }

    // Validate array item
    if (Array.isArray(shortcut)) {
      if (shortcut.length > MAX_NESTED_SHORTCUTS) {
        const err = `Too many nested shortcuts! Limit is ${MAX_NESTED_SHORTCUTS}.`;
        showToast(err);
        throw new Error(err);
      }

      shortcut.forEach((item) => {
        if (typeof item !== "string" || !isValidUrl(shortcut)) {
          const err = `Invalid URL in array: ${item}`;
          showToast(err);
          throw new Error(err);
        }
      });

      continue;
    }

    // Item is neither string or array
    const err = `${key} is invalid! Shortcuts should only contain a string URL or an array of string URLs!`;
    showToast(err);
    throw new Error(err);
  }
}

/** If url does not start with https, add it */
function ensureHttps(shortcuts) {
  function addHttps(item) {
    if (typeof item === "string") {
      if (item.startsWith("http://")) {
        return "https://" + item.slice(7);
      } else if (!item.startsWith("https://")) {
        return "https://" + item;
      }
    }
    return item;
  }

  for (let key in shortcuts) {
    if (Array.isArray(shortcuts[key])) {
      shortcuts[key] = shortcuts[key].map(addHttps);
    } else {
      shortcuts[key] = addHttps(shortcuts[key]);
    }
  }
}

function showToast(message, autohide = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.classList.remove("hidden");

  if (autohide) {
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }
}
