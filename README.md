# electron-quick-start-typescript

**Clone and run for a quick way to see Electron in action.**

This is a [TypeScript](https://www.typescriptlang.org) port of the [Electron Quick Start repo](https://github.com/electron/electron-quick-start) -- a minimal Electron application based on the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](http://electron.atom.io/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.ts` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start-typescript
# Go into the repository
cd electron-quick-start-typescript
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Re-compile automatically

To recompile automatically and to allow using [electron-reload](https://github.com/yan-foto/electron-reload), run this in a separate terminal:

```bash
npm run watch
```

## Build ans publish for autoupdate

changer le numero de version version dasn le fichier package.json,  une fois la release créer et les fichiers importé dans le dépot git modifier les noms du fichier .exe et exe.blockmap pour qu'il correspond au nom mentionner dans latest.yml sinon la mise à jour pourrai déclencher une erreur 404 (not found). Ensuit lancer la commande

npm run electron:window

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
