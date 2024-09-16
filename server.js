import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Server in http://localhost:${port}`);
});

app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    console.log(userMessage);
    const botMessage = 'just joo';
    res.json({ message: botMessage });
});