import { app, BrowserWindow } from "electron";
import * as path from "path";
import { getHWID } from 'hwid';
// const Store = require('electron-store');

const express = require('express');
const appExpress = express();
const port = 3000; // le port sur lequel notre API HTTP ecoutera

// configuration de notre api
appExpress.get('/', async (req: any, res: any) => {
   // res.send('bienvenue sur notre L\'api BEWALEL');
   const id = await getHWID();
   const data = {data: id};
  res.json(data);
  // res.send(id);
});

appExpress.get('/hwid', async (req: any, res: any) => {

  const id = await getHWID();
  const data = {data: id};
  res.json(data);

  /* const id = await getHWID();
  res.send(id); */

});


// demarrage de l'api HTTP
appExpress.listen(port, ()=> {

  console.log(`Serveur API HTTP BEWALLET ecoutant sur le port ${port}`);
})

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../bewallet/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  getHWID().then(id => {
    // use ID however you want
    //this.hwid = id;
    console.log(id); 
    /* const store = new Store();
    store.set('id_token', id); */
    //alert(id);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
