# Advent Calendar — 5-Day Test Version

This is the **test version** of the advent calendar. It has 5 doors instead of 24, and **all 5 doors are unlocked**, so you can check that everything works before you fill in the real calendar.

## Test it locally

Open Terminal and run:

```bash
cd "/Users/rberzins/Desktop/Advent Calendar Test"
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

Click every door and check:

- the modal opens and closes
- the photo displays
- the audio player appears
- the link button opens a new tab
- the voucher card looks right
- the progress bar updates
- the page works on your phone

Do not double-click `index.html` directly. Use the local server, or GitHub Pages.

## Put the test on GitHub Pages

1. Create a new **public** repository on GitHub, for example `advent-test`.
2. Upload the **contents** of this folder so that `index.html` is at the top level of the repository.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Set the branch to `main` and the folder to `/ (root)`. Click **Save**.
6. Wait about a minute. Your URL will be:

```text
https://YOUR-USERNAME.github.io/advent-test/
```

If the repository is named exactly `YOUR-USERNAME.github.io`, the URL will be:

```text
https://YOUR-USERNAME.github.io/
```

## If you get a 404

Check these in order:

1. `index.html` is at the **top level** of the repository, not inside another folder.
2. The filename is exactly `index.html` — all lowercase, no trailing space, no extra `_`.
3. The URL includes the repository name, unless the repo is `username.github.io`.
4. You waited 1–2 minutes after enabling Pages.
5. You hard-refreshed with `Cmd + Shift + R`.

The most common macOS mistake is a trailing space in the filename, such as `index.html `. GitHub will upload it, but Pages will look for `index.html` and return a 404.

## After the test works

Open the real version in:

```text
/Users/rberzins/Desktop/Advent Calendar
```

Fill in the 24 days in `script.js`, replace the placeholder images and audio, and deploy that folder instead.

## What is different in this test version?

- `CONFIG.totalDays` is `5`.
- `CONFIG.unlockAll` is `true`, so all doors open immediately.
- `CONFIG.testMode` is `true`, which shows the "Test version — all doors unlocked" label.
- `CONFIG.showReset` is `true`, so you can reset the opened doors while testing.

The real version uses `totalDays: 24`, `unlockAll: false`, and `showReset: false`.

Made with love. ♥
