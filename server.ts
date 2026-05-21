import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini API
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add it in your Secrets/Environment panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: AI Coach Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { coachName, messages, context } = req.body;
      const parsedMessages = messages || [];
      const coach = coachName || "Elite AI Coach";

      const systemInstruction = `You are "${coach}", an elite, high-performance, ruthless yet inspiring self-improvement coach.
Your absolute goal is to help the user become completely UNRECOGNIZABLE in ${context?.daysLeft ?? 90} days by building elite habits, mastering discipline, tracking expenses, and studying.
The user is striving to become "the best version of themselves". Speak with absolute conviction, clarity, high energy, and no-nonsense focus.
Provide direct, hyper-actionable, and deeply motivating advice. Keep your responses concise, highly structured, and clean. Always refer to yourself as the user's personal coach: "${coach}".
User Details for context:
- Goals: ${JSON.stringify(context?.goals || [])}
- Target days: ${context?.daysLeft ?? 90} days transformation focus.
- Currently tracking domains: ${JSON.stringify(context?.domains || [])}
- Focus Skills/AI topics: ${JSON.stringify(context?.aiSkills || [])}
- Academic curriculum: ${JSON.stringify(context?.subjects || [])}
- Upcoming Exam: ${context?.examSubject ?? "None"} on ${context?.examDate ?? "N/A"}`;

      const formattedContents = parsedMessages.map((msg: { sender: string; text: string }) => {
        return {
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        };
      });

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error("AI Coach Error:", err.message);
      // Clean fallback if API key is not configured or fails
      res.json({
        reply: `[Demo Mode / Offline Coach] I am locked and loaded. However, my server's Gemini neural engine needs a GEMINI_API_KEY set in settings to connect with total cosmic power on backends.

Let's maintain extreme discipline anyway:
Keep ticking off your daily goals, log your expenses, study your topics relentlessly, and update your ${req.body?.context?.daysLeft ?? 90}-day clock. Keep pushing to become the absolute best!`,
        isError: true,
        errorMessage: err.message,
      });
    }
  });

  // API Route: Study Schedule Generator
  app.post("/api/study-schedule", async (req, res) => {
    try {
      const { subject, examDate, daysLeft, currentComplexity, focusHours } = req.body;

      const ai = getAI();
      const prompt = `Formulate an elite, day-by-day high-performance study schedule for the subject: "${subject}".
The exam is set on ${examDate} (${daysLeft} days from now).
The user can dedicate ${focusHours || 2} hours of daily absolute deep focus.
The user's current understanding is: "${currentComplexity || "Beginner or average state"}".

Break this down into:
1. PHASED HIGH-LEVEL ATTACK (Divide the ${daysLeft} days into 3 distinct logical phases).
2. DAY-BY-DAY ACTION ROADMAP (Detailed bullet marks detailing what to conquer each day or mini-phase).
3. THE RUTHLESS DEEP WORK RULES (Actionable recommendations on how to retain info and study without distraction).

Make the formatting incredibly high contrast, clean list items, and fully parsed in Markdown with clear headers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an ultimate academic strategist who builds maximum efficiency learning protocols.",
          temperature: 0.7,
        },
      });

      res.json({ schedule: response.text });
    } catch (err: any) {
      console.error("Study Scheduler error:", err.message);
      res.json({
        schedule: `### Phased Attack Plan (Alternative Schedule)
- **Phase 1: Foundation (Days 1-${Math.max(1, Math.floor(req.body.daysLeft / 3))})**: Gather syllabus, outline core definitions, study the first half of chapters.
- **Phase 2: Consolidation (Days ${Math.max(2, Math.floor(req.body.daysLeft / 3) + 1)}-${Math.max(3, Math.floor(req.body.daysLeft * 2 / 3))})**: Work problems, make active-recall cards, write quick sum-ups.
- **Phase 3: Ultimate Blitz (Days ${Math.max(4, Math.floor(req.body.daysLeft * 2 / 3) + 1)}-${req.body.daysLeft || 10})**: Full sample examinations, clear weaknesses, maintain sleep & focus.

*Connect GEMINI_API_KEY to receive custom tailored study maps for "${req.body.subject || 'your subjects'}" automatically.*`,
        isError: true,
      });
    }
  });

  // API Route: Recommend Next AI Course / Skill
  app.post("/api/suggest-next-ai", async (req, res) => {
    try {
      const { currentSkills, interests } = req.body;

      const ai = getAI();
      const prompt = `The user wants to become an expert in AI.
They currently know / have studied: ${JSON.stringify(currentSkills || [])}.
Their focus interests are: "${interests || "General AI, engineering, prompt crafting, agent architecture, or LLMs"}".

Given this exact standing, what AI concepts, libraries, frameworks, or modern architectures should they master next to stay in the top 1%?
Recommend exactly 3 highly specific technologies (e.g., specific things like Vector Databases (Pinecone/Milvus), LangChain/LlamaIndex Agents, Claude/Gemini Function Calling, PyTorch Backprop, etc.).
For each, provide:
1. **Title**: Name of technology
2. **Why It Matters**: Technical edge
3. **Core Curriculum**: Exact items/concepts to learn in 1 week
4. **Practice Project**: A micro-build to prove mastery

Provide the response in structured JSON with the following exact format so we can render it natively:
{
  "suggestions": [
    {
      "techName": "Name",
      "tag": "e.g., Agentic AI / Deep Learning",
      "whyItMatters": "Reason",
      "curriculum": ["concept 1", "concept 2", "concept 3"],
      "projectDescription": "Build this specific item"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.75,
        },
      });

      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Suggest next AI error:", err.message);
      // Fallback with highly professional curated templates if offline
      res.json({
        suggestions: [
          {
            techName: "Agentic Engineering & LangGraph",
            tag: "Agentic Architectures",
            whyItMatters: "Standard prompt-response cycles are linear. Cyclic graphs with memory allow AI to plan, query APIs, critique itself, and run autonomous loops.",
            curriculum: [
              "Cyclic states & memory checkpointers in Python/TypeScript",
              "Human-in-the-loop interruption handlers",
              "Multi-agent supervisor routing algorithms"
            ],
            projectDescription: "Build a multi-agent coding system that writes, compiles, lints, and corrects its own code in a sandbox."
          },
          {
            techName: "RAG & Vector Retrieval with HyDE",
            tag: "Knowledge Retrieval",
            whyItMatters: "Hypothetical Document Embeddings (HyDE) boost retrieval accuracy by generating fake search answers first to search high-density vector indices.",
            curriculum: [
              "Hierarchical chunking and Markdown splitters",
              "HyDE generation via Gemini API parameters",
              "Sparse and dense metadata hybrid search fusing"
            ],
            projectDescription: "Create a localized custom codebase helper that indexes a target repo and answers structural workflow queries."
          },
          {
            techName: "LLM Fine-Tuning & Prompt Distillation",
            tag: "High-End LLM Optimization",
            whyItMatters: "Distilling ultra-smart model outputs (like Gemini 3 series) into small 8B localized models for custom, lightning-fast offline operations.",
            curriculum: [
              "Synthetic dataset generation with specific schemas",
              "LoRA / QLoRA hyperparameter tuning parameters",
              "Evaluation metrics (ROUGE, BLEU, human alignment)"
            ],
            projectDescription: "Distill the complex domain knowledge of an AI coach into a fast, customized local instruction format."
          }
        ]
      });
    }
  });

  // In-memory states registry with disk persistence fallback
  const STATES_FILE = path.join(process.cwd(), "user_states.json");
  let userStatesMemory: Record<string, any> = {};

  // Try to load state file on boot
  try {
    if (fs.existsSync(STATES_FILE)) {
      userStatesMemory = JSON.parse(fs.readFileSync(STATES_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Could not load states file", e);
  }

  function saveStatesToDisk() {
    try {
      fs.writeFileSync(STATES_FILE, JSON.stringify(userStatesMemory, null, 2), "utf8");
    } catch (e) {
      console.error("Could not save states to disk", e);
    }
  }

  // API Route: Save state with unique ID
  app.post("/api/save-state", (req, res) => {
    try {
      const { syncId, stateData } = req.body;
      if (!syncId || !stateData) {
        return res.status(400).json({ status: "error", message: "syncId and stateData are required." });
      }
      userStatesMemory[syncId.toLowerCase().trim()] = stateData;
      saveStatesToDisk();
      res.json({ status: "success", message: `State synced successfully to ID: ${syncId}` });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // API Route: Load state with unique ID
  app.get("/api/load-state/:syncId", (req, res) => {
    try {
      const syncId = req.params.syncId.toLowerCase().trim();
      const stateData = userStatesMemory[syncId];
      if (!stateData) {
        return res.status(404).json({ status: "error", message: "Custom ID not found. Enter a valid ID to restore data." });
      }
      res.json({ status: "success", stateData });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // API Route: Syllabus Scheduler
  app.post("/api/generate-from-syllabus", async (req, res) => {
    try {
      const { fileName, fileContent, subjectName, examDate, focusHours } = req.body;

      const ai = getAI();
      const prompt = `Formulate an elite, optimized, highly personalized study plan based on this uploaded Syllabus File.
Subject / Topic: "${subjectName || "Custom Course"}"
Syllabus source file: "${fileName || "Syllabus.pdf"}"
Exam set date: "${examDate || "Soon"}"
Daily dedication limit: "${focusHours || 3} hours of pure undisturbed block study"

Below is raw retrieved syllabus data / content keywords extracted from this syllabus:
----------------------------------
${fileContent || "General curriculum course topics"}
----------------------------------

Provide a pristine, motivating, and beautifully structured academic strategy in Markdown format.
Include:
1. **SYLLABUS BREAKDOWN**: Identify high-yield topics, low-importance concepts to bypass, and potential focus gaps.
2. **PHASED STUDY BLOCK CALENDAR**: Divide preparation time into 3 crucial segments (e.g., Deep Core Study, Speed Repetitions, Mock Testing).
3. **PRACTICAL REVISION RITUALS**: Define specific micro-testing patterns for maximum retention.

Make sure the tone is incredibly minimal, clean, soft, modern, and highly motivating. Use crisp headers and bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an ultimate academic strategist who builds maximum efficiency learning protocols.",
          temperature: 0.7,
        },
      });

      res.json({ schedule: response.text });
    } catch (err: any) {
      console.error("Syllabus scheduler error:", err.message);
      res.json({
        schedule: `### Multi-Phased Syllabus Roadmap
- **Topic Deconstruction**: Main modules extracted from ${req.body.fileName || "syllabus"}. Focus mainly on core concepts first.
- **Phase 1 (Concepts)**: Dedicate ${req.body.focusHours || 3} hours daily mapping out definitions and logical blocks.
- **Phase 2 (Practice)**: Build mock flashcards, solve prior tests, and verify active progress.
- **Phase 3 (Blitz)**: Mock exam execution, focus repair days, and confidence building.

*To unlock customized syllabus scheduling powered by Gemini, connect your GEMINI_API_KEY.*`
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on host 0.0.0.0:${PORT}`);
  });
}

startServer();
