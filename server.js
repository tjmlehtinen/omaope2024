import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import vision from '@google-cloud/vision';

dotenv.config();

const imageUpload = multer({ dest: 'uploads/' });

const imageClient = new vision.ImageAnnotatorClient({
    keyFilename: 'omaope-vision.json'
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Server in http://localhost:${port}`);
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log(userMessage);
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 150
            })
        });
        const data = await response.json();
        console.log(data.choices[0].message);
        const botMessage = data.choices[0].message.content;
        res.json({ message: botMessage });
    } catch(error) {
        console.error('Virhe:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/upload-images', imageUpload.array('images', 10), async (req, res) => {
    const files = req.files;
    console.log(files);
    try {
        res.json({ testi: "upload-images" });
    } catch(error) {
        console.error('Virhe:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});