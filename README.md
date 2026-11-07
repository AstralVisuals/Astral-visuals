# Astral Visuals website

A static, responsive site for the Minecraft 1.21.11 Fabric client. No npm, build tool, backend, account service, or external font is needed.

## Upload to GitHub and enable Pages

1. Create a repository on GitHub, for example `astral-visuals`.
2. Extract the website ZIP. Upload **the contents of this folder**, so `index.html` is at the repository root. Include `assets`, `downloads`, `app.js`, `modules.js`, `styles.css` and `.nojekyll`. Do not upload the ZIP itself as the website.
3. Open repository **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose your default branch (usually `main`) and **/ (root)**, then Save.
4. GitHub displays the website address in Pages settings after deployment. It normally looks like `https://YOUR-USERNAME.github.io/astral-visuals/`.

These instructions follow [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Repository access and plan determine Pages availability. All site paths are relative, so project repositories work without editing a base URL.

## Local preview

Open `index.html`, or run `python -m http.server 4173` from this folder and visit `http://localhost:4173`. Clipboard copy may fall back to showing the path when the browser does not allow clipboard access.

## Update the client download

The `downloads` folder contains the current **compact JAR**, without your personal config or test worlds. When publishing a new build:

1. Replace that JAR with the new file.
2. Update the download link, version, compatibility and file-size text in `index.html`.
3. Replace `downloads/changelog.txt`.
4. Update `modules.js` if the collection changes.

Alternatively, upload the JAR as a GitHub Release asset and replace the button's `href` with that asset's download URL. The website works with either approach.

## Edit the design and content

- `index.html`: sections, copy, installation, FAQ and download links.
- `styles.css`: responsive styling and colors. Default is monochrome. No purple gradients or pill buttons.
- `modules.js`: the 55 visible modules and their categories/descriptions.
- `app.js`: category filters, search, four website accent previews, path copy and the orbital canvas animation.
- `assets/mark.svg`: code-native Astral mark.

The canvas and feature art are explicitly labeled **browser illustrations**, not gameplay screenshots. The preview theme selector only changes the website. No fake Discord links or invented public repository URLs are included. You can add your Discord invite or GitHub repository link to the footer once you have the real URLs.

Animation pauses off-screen, when the tab is hidden, or when Pause is selected. Reduced-motion preferences are respected. The site uses semantic controls, visible keyboard focus, native FAQ disclosures and responsive navigation.

## Included binary

The JAR is provided by the project owner. The website does not change its licensing or the attribution of reused mod code/assets. The download requires Minecraft Java Edition 1.21.11, Fabric Loader and a matching Fabric API. Sodium is optional. Java 21 was used for this build.
