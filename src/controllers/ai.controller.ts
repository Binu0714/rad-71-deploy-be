import axios from "axios"
import { Request, Response } from "express"
import { appendFile } from "fs"

export const generateContext = async (req: Request, res: Response) => {


    try {
        const { text, maxToken } = req.body

        // check text null send 404

        const aiResponse = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
                contents: [
                    {
                        parts: [{ text }]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: maxToken || 150
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": "AIzaSyAsXGN74SUT_XIrMXkIv5DRO7UkcEvWqRg"
                }
            }
        )

        const genratedText =
            aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
            aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No data"

        res.status(200).json({ message: "AI genration success...", data: genratedText })



    } catch (error) {
        res.status(500).json({ message: "AI genration failed..." })
    }
}
