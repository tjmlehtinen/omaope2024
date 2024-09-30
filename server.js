import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

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
        console.log(data);
        const botMessage = "täh";
        res.json({ message: botMessage });
    } catch(error) {
        console.error('Virhe:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});