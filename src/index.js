const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.webContents.openDevTools();
}
function runCommandOnCMD(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar o comando: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro no comando: ${stderr}`);
            return;
        }
        console.log(`Saída do comando: ${stdout}`);
    });
}


app.on('ready', () => {
    createWindow();
    // Inicie o servidor
    runCommandOnCMD('npm run start-server');
    const serverProcess = spawn('node', [path.join(__dirname,'..','server', 'index.js')]);


    serverProcess.stdout.on('data', (data) => {
        console.log(`Servidor: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Erro do servidor: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`Servidor encerrado com código ${code}`);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
