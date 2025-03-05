## Charon

[Canoe icons created by amonrat rungreangfangsai - Flaticon](https://www.flaticon.com/free-icons/canoe)

## Installation:

- For Firefox, install the extension using [Charon's Firefox XPI link](https://addons.mozilla.org/firefox/downloads/file/4448897/c509ba01a68a42e68392-0.3.0.xpi).

- For Chrome, go to [Charon's Chrome Web Store page](https://chromewebstore.google.com/detail/charon/immickcjonbehjmmeddiljnnoigdcfkl).

## How to use:

1. **Set Up Shortcuts**

- Click the extension icon.

- Enter your shortcuts in JSON format using the following schema:

  ```json
  {
    "pattern": "example.com",
    "pattern2": [
      "example.com",
      "google.com"
    ],
    "fb": "facebook.com",
    "w": "wikipedia.org",
    "yt": "youtube.com/@HappyConsoleGamer"
  }
  ```

  *Shortcut Rules:* 
  - **Single Shortcut Mapping**: `"pattern"` opens a single web page.
  - **Multiple Web Pages**: `"pattern2"` opens multiple web pages at once.

  The shortcut saves automatically after typing. If there are errors, the
  extension will notify you at the bottom of the text area. 

2.  **Activate Omnibox**

- After setting up your shortcuts, you can use the search bar to trigger them.

- In the search bar, type `c` followed by `tab` or `space` to activate the
  extension.

- Then, type your shortcut (e.g., `fb` for Facebook) and press Enter to
  navigate to the site.

