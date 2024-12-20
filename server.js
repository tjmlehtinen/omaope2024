import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import vision from '@google-cloud/vision';
import fs from 'fs';

dotenv.config();

const imageUpload = multer({ dest: 'uploads/' });

const imageClient = new vision.ImageAnnotatorClient({
    keyFilename: 'omaope-vision.json'
});

const app = express();
const port = 3000;

let textFromImages = '';
let questionContext = [];

let currentQuestion = '';
let correctAnswer = '';

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
    //console.log(files);
    try {
        const texts = await Promise.all(files.map(async file => {
            const imagePath = file.path;
            const [result] = await imageClient.textDetection(imagePath);
            const detections = result.textAnnotations;
            fs.unlinkSync(imagePath);
            return detections.length > 0 ? detections[0].description : '';
        }));
        textFromImages = texts.join(' ');
        questionContext = [
            {role: 'user', content: textFromImages},
            {role: 'user', content: "Anna ylläolevasta tekstistä kysymys ja sen vastaus."}
        ];
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: questionContext,
                max_tokens: 150
            })
        });
        const data = await response.json();
        const textResponse = data.choices[0].message.content;
        const [question, answer] = textResponse.split('Vastaus:');
        currentQuestion = question;
        correctAnswer = answer;
        res.json({ question: currentQuestion });
    } catch(error) {
        console.error('Virhe:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/check-answer', async (req, res) => {
    const userAnswer = req.body.message;
    console.log(userAnswer);
    try {
        const toChatGPT = [
            { role: 'system', content: 'Olet opettaja, joka arvioi oppilaiden vastauksia kysymyksiin'},
            { role: 'user', content: 'Kysymys: ' + currentQuestion },
            { role: 'user', content: 'Oikea vastaus: ' + correctAnswer },
            { role: 'user', content: 'Oppilaan vastaus: ' + userAnswer },
            { role: 'user', content: 'Arvioi oppilaan vastaus asteikolla 1-10. Anna myös sanallinen palaute.'}
        ];
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: toChatGPT,
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
