const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();
    

const app = express();
const PORT = 5000;
console.log(PORT);
app.use(express.json());
app.use(cors())

console.log("API Key:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.get("/getMessage", async (req, res) => {
    console.log("Hello");

    try {

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            messages: [{ "role": "user", "content": "Give me a short and beautiful motivational sentence in English" }],
            temperature: 1.0,
            max_tokens: 50
        });
        console.log(response.choices[0].message.content);

        res.json({ sentence: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error generating random sentence" });
    }
})

app.listen(PORT, () => console.log(`Server is running on port${PORT}`));
