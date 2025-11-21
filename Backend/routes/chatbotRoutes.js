const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize Gemini with correct model names
let genAI;
let model;

console.log("🚀 Initializing Gemini AI...");

if (process.env.GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Use the correct model names from the documentation
        // Try Gemini 2.0 Flash first (fast and efficient)
        model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",  // Correct model name for speed
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            }
        });
        
        console.log("✅ Gemini AI initialized successfully with model: gemini-2.0-flash");
        
        // Test the connection
        async function testConnection() {
            try {
                const testResult = await model.generateContent("Hello, are you working?");
                const testResponse = await testResult.response;
                console.log("🤖 Gemini AI test successful!");
                console.log("Test response:", testResponse.text().substring(0, 50) + "...");
            } catch (testError) {
                console.log("❌ Gemini test failed:", testError.message);
                
                // Try alternative model
                console.log("🔄 Trying alternative model: gemini-1.5-flash");
                try {
                    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const altResult = await model.generateContent("Hello");
                    await altResult.response;
                    console.log("✅ Alternative model gemini-1.5-flash works!");
                } catch (altError) {
                    console.log("❌ Alternative model also failed:", altError.message);
                }
            }
        }
        
        testConnection();
        
    } catch (error) {
        console.error("❌ Failed to initialize Gemini:", error.message);
        genAI = null;
        model = null;
    }
} else {
    console.log("❌ GEMINI_API_KEY not found in .env file");
    console.log("💡 Please add: GEMINI_API_KEY=AIzaYourActualKeyHere");
    genAI = null;
    model = null;
}

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        console.log("💬 User asked:", message);

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is required" });
        }

        // Use Gemini AI
        if (model) {
            try {
                console.log("🧠 Generating AI response with Gemini...");
                
                const result = await model.generateContent(message);
                const response = await result.response;
                const reply = response.text();
                
                console.log("✅ Gemini response successful!");
                console.log("📝 Response preview:", reply.substring(0, 100) + "...");
                
                return res.json({ reply });
                
            } catch (geminiError) {
                console.log("❌ Gemini Error:", geminiError.message);
                
                // Try to provide helpful response based on error
                if (geminiError.message.includes('404') || geminiError.message.includes('not found')) {
                    return res.json({ 
                        reply: `I'm having trouble finding the right AI model. 

The model names might have changed. Please check the latest Gemini documentation for current model names.

In the meantime, you can:
1. Check https://ai.google.dev/gemini-api/docs/models for current models
2. Or switch to OpenAI by adding OPENAI_API_KEY to your .env file` 
                    });
                } else {
                    return res.json({ 
                        reply: `I'm experiencing technical difficulties: ${geminiError.message}

Please check your GEMINI_API_KEY and try again.` 
                    });
                }
            }
        } else {
            console.log("❌ Gemini not configured");
            return res.json({ 
                reply: `I'm not properly configured yet. 😔

To get me working with Gemini:

1. Get a FREE API key from: https://aistudio.google.com/
2. Add to your backend .env file:
   GEMINI_API_KEY=AIzaYourActualKeyHere

3. Restart your backend server

Once configured, I'll be able to answer any question like a real AI assistant! 🚀` 
            });
        }

    } catch (error) {
        console.error("❌ Server error:", error.message);
        return res.status(500).json({ 
            reply: "Sorry, I encountered a server error. Please try again later." 
        });
    }
});

module.exports = router;