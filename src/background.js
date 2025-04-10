import "./browser-polyfill.js";

browser.omnibox.onInputEntered.addListener(async (text) => {
  const storage = await browser.storage.sync.get("shortcuts");
  const redirect = storage.shortcuts[text.trim()];

  // Ignore undefined shortcuts
  if (!redirect) {
    return;
  }

  // Open shortcut in new tab to remove focus from omnibox
  const currentTab = await browser.tabs.query({
    active: true,
    windowId: browser.windows.WINDOW_ID_CURRENT,
  });
  const currentIndex = currentTab[0].index;

  // Opens one tab
  if (typeof redirect === "string") {
    browser.tabs.create({
      active: true,
      index: currentIndex,
      url: redirect,
    });
    browser.tabs.remove(currentTab[0].id);
  }
  // Opens multiple tabs
  else if (Array.isArray(redirect)) {
    let newIndex = currentIndex;
    redirect.forEach((item, index) => {
      browser.tabs.create({
        active: index === 0,
        index: newIndex++,
        url: item,
      });
    });
    browser.tabs.remove(currentTab[0].id);
  }
});
