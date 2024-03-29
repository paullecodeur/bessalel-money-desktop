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

const express = require('express');

const appExpress = express();
const port = 5555; // le port sur lequel notre API HTTP ecoutera. il est recommander d'utiliser 

const args = process.argv.slice(1);
const serve: boolean = args.some(val => val === '--serve');

const bodyParser = require('body-parser');
const cors = require('cors');
const { autoUpdater, AppUpdater } = require("electron-updater");

const { dialog } = require("electron");


//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


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


// Middleware cors pour autoriser les requêtes cross-origin
appExpress.use(cors());

// Middleware body-parser pour analyser le corps des requêtes POST
appExpress.use(bodyParser.urlencoded({
  extended: false
}));
appExpress.use(bodyParser.json());


// Route POST pour recuperer les données
appExpress.post('/bessalelmoney/update', async (req: any, res: any) => {


  /* // const fileURL = 'http://127.0.0.1:8000/mediatheque/1386700454_71199_1200x667x0.jpg';
  // const fileURL = 'https://legiafrica.com/uploads/documents/THESE-JOELLE-REUNIE-soutenue.pdf';
  // const fileURL = 'http://127.0.0.1:8000/mediatheque/anniv.mp4';

  console.log('recuperation paramètre post:', req.body);

  const fileURL = req.body.link;
  
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
      
          app.quit();

      }, 3000);


  });

  const id = await getHWID();
  const data = {data: 'bessale money 2.3.4'};
  res.json(data); */

  autoUpdater.checkForUpdates();


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


function autoUdpaterdownload(configuration: any) {

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

      
      // Get progress if callback exists
      if (configuration.hasOwnProperty('onProgress')) {

        autoUpdater.on("download-progress", (progressObj: any) => {

          /* let log_message = 'Download speed: ' + progressObj.bytesPerSecond
          log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
          log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')' */
          
          configuration.onProgress(progressObj.percent, progressObj.transferred, progressObj.total, progressBar);

        });

          
      } else {
          
      }

      /*Download Completion Message*/
      autoUpdater.on("update-downloaded", (info: any) => {

        //console.log(info);
        dialog.showMessageBox(null, {
          type: 'info',
          title:'Mise à jour disponible',
          message:'Une nouvelle version de l\'application est disponible. voulez-vous l\'installer maintenant ?',
          buttons: ['Installer maintenant', 'Plus tard'],
          defaultId:0
        }).then((response)=> {

            progressBar.close();

            if(response.response === 0) {
              
              autoUpdater.autoInstallOnAppQuit();
              app.quit();

            }

        });

        //curWindow.showMessage(`Update downloaded. Current version ${app.getVersion()}`);

      });

      /* req.on('end', function() {
          progressBar.setCompleted();
          resolve('');
      }); */
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 740,
    show: false,
    icon: path.join(__dirname, '../src/angularbuild/assets/favicon/android-chrome-512x512.png'),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  //mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../src/angularbuild/index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  
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

  // autoUpdater.checkForUpdates();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


/*New Update Available*/
autoUpdater.on("update-available", (info: any) => {

  //curWindow.showMessage(`Update available. Current version ${app.getVersion()}`);
  let pth = autoUpdater.downloadUpdate();
  //console.log(pth);
  /* dialog.showMessageBox(null, {
    type: 'info',
    title:'Bessalel Money',
    message:'update-available',
    buttons: ['ok']
  }); */


  autoUdpaterdownload({
      onProgress: function (percent:any, received:any, total:any, progressWin:any) {
          // tslint:disable-next-line:no-bitwise
          const percentage = (Math.round(percent * 100) / 100) | 0 ;
          // progressWin.detail = percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.';
          if(percentage < 100) { // pour ne pas fermer le progressBar avant l'evenement 'update-downloaded' de autoUpdater qui  ferme le progressBar  car lorsque progressBar.value = 100 il se ferme seule
            progressWin.value = percentage;
            progressWin.detail = 'Téléchargement mise jour en cours (' + percentage + ' %)...';
          }
          // console.log(percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.');
      }
  }).then(function() {

      // contents.send('about', []);
      //  app.quit();
      // autoUpdater.autoInstallOnAppQuit();

  });


});

autoUpdater.on("update-not-available", (info: any) => {
  // console.log(info);
  dialog.showMessageBox(null, {
    type: 'info',
    title:'Mise à jour',
    message:'Aucune mise à jour disponible pour l\'instant',
    buttons: ['ok']
  });
  //curWindow.showMessage(`No update available. Current version ${app.getVersion()}`);
});



autoUpdater.on("error", (error: any) => {
  // console.log(info);
  dialog.showMessageBox(null, {
    type: 'error',
    title:'Mise à jour',
    message:error.message,
    buttons: ['ok']
  });
  //curWindow.showMessage(info);
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
