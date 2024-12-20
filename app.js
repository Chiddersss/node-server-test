const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Image Upload Test</title>
        </head>
        <body>
            <h1>Upload Image</h1>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="image" accept="image/*" required>
                <button type="submit">Upload</button>
            </form>
            <div id="imageContainer"></div>
            </body>
            </html>
            `);
        });

app.post('/upload', upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).send('No image uploaded.');
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.send(`
        <h2>Upload Successful!</h2>
        <img src="${imageUrl}" alt="Uploaded Image" style="max-width: 500px;">
        <br>
        <a href="/">Upload Another</a>
        `);
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is listeing on port ${PORT}`);
});