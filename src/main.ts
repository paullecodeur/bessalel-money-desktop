import { app, BrowserWindow } from "electron";
import * as path from "path";
import { getHWID } from 'hwid';
// const Store = require('electron-store');
const electron = require('electron');
const request = require('request');
const ProgressBar = require('electron-progressbar');
let win: BrowserWindow = null;
const fs = require('fs');
const shell = require('electron').shell;

const exec = require('child_process');


const express = require('express');

const appExpress = express();
const port = 5555; // le port sur lequel notre API HTTP ecoutera. il est recommander d'utiliser 

const args = process.argv.slice(1);
const serve: boolean = args.some(val => val === '--serve');

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

appExpress.get('/bessalelmoney/update', async (req: any, res: any) => {


  // const fileURL = 'http://127.0.0.1:8000/mediatheque/1386700454_71199_1200x667x0.jpg';
  // const fileURL = 'https://legiafrica.com/uploads/documents/THESE-JOELLE-REUNIE-soutenue.pdf';
  const fileURL = 'http://127.0.0.1:8000/mediatheque/anniv.mp4';
  
  
  // const fileURL = link;

  // butterfly-wallpaper.jpeg
  const filename = getFilenameFromUrl(fileURL);
  


  let downloadsFolder = '';
  if (serve) {
      // this.dataSubFolder = '/';
      downloadsFolder = electron.app.getPath('userData');
  } else {
      // downloadsFolder = remote.app.getAppPath();
      downloadsFolder = electron.app.getPath('userData');
  }

  console.log('downloadsFolder: ', downloadsFolder);

  const finalPath = downloadsFolder + '/' + filename;

  downloadFile({
      remoteFile: fileURL,
      localFile: finalPath,
      onProgress: function (received:any, total:any, progressWin:any) {
          // tslint:disable-next-line:no-bitwise
          const percentage = ((received * 100) / total) | 0 ;
          // progressWin.detail = percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.';
          progressWin.detail = 'Téléchargement mise jour en cours (' + percentage + ' %)...';
          // console.log(percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.');
      }
  }).then(function() {

      // contents.send('about', []);
      //  app.quit();

      // on laisse le temps que le processsus principale libère la ressource
      setTimeout(() => {

          shell.openPath(finalPath);
          /* exec(finalPath, (err: any, stdout: any, stderr: any) => {

            if(err) {
              console.error ('Erreur lors du lancement de l\'exécutable: ', err);
            }

          }); */
          app.quit();

      }, 3000);

      // shell.openItem('\\putty.exe');

      /* child(finalPath, parameters, function(err, data) {
          console.log(err);
          console.log(data.toString());
      }); */


  });

  const id = await getHWID();
  const data = {data: 'bessale money 2.3.4'};
  res.json(data);

  /* const id = await getHWID();
  res.send(id); */

});


// demarrage de l'api HTTP
appExpress.listen(port, ()=> {

  console.log(`Serveur API HTTP BEWALLET ecoutant sur le port ${port}`);
});

function getFilenameFromUrl(lien: string) {
  return lien.substring(lien.lastIndexOf('/') + 1);
}

function downloadFile(configuration: any) {

  return new Promise(function(resolve, reject) {

      /* const progressBar = new ProgressBar({
          // indeterminate: false,
          text: 'Veuillez patienter, la mise jour est en cours de téléchargement...',
          detail: 'Mise à jour',
      }); */

      const progressBar = new ProgressBar({
              indeterminate: false,
              title: 'Mise à jour',
              text: 'Veuillez patienter !',
              detail: 'Mise à jour en cours de téléchargement...',
              browserWindow: {
                  parent: win,
                  webPreferences: {
                      nodeIntegration: true,
                  },
              },
      });

      /* progressBar.on('download-progress', function(progressObj) {
          // console.info(`completed...`);
          progressBar.detail = 'Task completed. Exiting...';
      }); */

      // Save variable to know progress
      let received_bytes = 0;
      let total_bytes = 0;

      const req = request({
          method: 'GET',
          uri: configuration.remoteFile
      });

      const out = fs.createWriteStream(configuration.localFile);
      req.pipe(out);

      req.on('response', function ( data:any ) {
          // Change the total bytes value to get progress later.
          // tslint:disable-next-line:radix
          total_bytes = parseInt(data.headers['content-length' ]);
      });

      // Get progress if callback exists
      if (configuration.hasOwnProperty('onProgress')) {
          req.on('data', function(chunk:any) {
              // Update the received bytes
              received_bytes += chunk.length;

              configuration.onProgress(received_bytes, total_bytes, progressBar);
          });
      } else {
          req.on('data', function(chunk:any) {
              // Update the received bytes
              received_bytes += chunk.length;
          });
      }

      req.on('end', function() {
          progressBar.setCompleted();
          resolve('');
      });
  });
}

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