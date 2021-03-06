import { Router } from 'express'
import * as archivoCtrl from '../controllers/archivo.controller'
const router = Router();
const { checkToken } = require('../auth/token_validation');
const multer = require("multer");
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const CLIENT_ID = '238294881843-22dpks11mfm1vl2kh7tdpscjqo22m8q5.apps.googleusercontent.com';
const CLIENT_SECRET = '9xQBcZ8vqe2ucoiWikRDRLvt';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkdXN1YXJpbyI6MiwidXNlcm5hbWUiOiJlbGlhc21oIiwibm9tYnJlcyI6IkVsaWFzIiwiYXBlbGxpZG9zIjoiTWFtYW5pIEh1YXl0YSIsImlkcGVyc29uYSI6MX0sImlhdCI6MTYyNjgzMjE2N30.wPli102Bu6_E8EXlx-Bob86fp0jJSE0WAvWYAt8sYQ4';
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});
var filePath;
var archivo;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/archivos/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage });
router.post("/upload", checkToken, upload.single("document"), async (req, res, next) => {
    filePath = path.join("src/archivos/", req.file.originalname);
    console.log(filePath);
    const file = req.file;
    archivo = file.originalname;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    } else {
        const tipo = req.file.mimetype;
        const link = await uploadFile(tipo);
        res.send(link);
    }
});

async function generatePublicUrl(id) {
    try {
        const fileId = id;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink,webContentLink'
        });
        console.log("generatePublicUrl() va a retornar: " + result.data.webViewLink);
        return result.data.webViewLink;
    } catch (error) {
        console.log(error.message);
    }
}

async function uploadFile(tipo) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: archivo,
                mimeType: tipo
            },
            media: {
                body: fs.createReadStream(filePath)
            }
        })
        fs.unlinkSync(filePath);
        console.log(response.data);
        const link = await generatePublicUrl(response.data.id);
        console.log("uploadFile() va a retornar: " + link)
        return link;
    } catch (error) {
        console.log(error.message);
    }
}

router.get("/:id", checkToken,archivoCtrl.readAllArchivo);
router.post("/",  checkToken,archivoCtrl.createArchivo);
router.delete("/:id", checkToken,archivoCtrl.delArchivo);
export default router;