# 🎓 OpenSolve NG

**OpenSolve NG** is an open-source, multimodal AI tool designed to solve a massive problem in Nigerian universities: scattered, blurry, handwritten past questions (PQs). Powered by **Gemma 4**, it instantly transcribes images of past questions and generates step-by-step solutions.

### 🏆 Hackathon Tracks Targeted (Hacktoberfest 2026)
* **Best Use of Gemma 4:** Leverages Gemma 4's multimodal capabilities (`gemma-4-26b-a4b-it` via the Gemini API) to process images of handwritten text and generate academic solutions.
* **Best Open-Source AI Project:** Built as a foundational open-source tool where student developers across Nigeria can contribute custom prompt templates tuned to their specific university's grading rubrics.

---

### 🚨 The Problem
During exam weeks at Nigerian universities (like FUOYE), students rely heavily on past questions. These are typically shared in department WhatsApp groups as blurry, handwritten photos. Typing these out to search for explanations is tedious and time-consuming.

### 💡 The Solution
OpenSolve NG allows students to simply upload a photo of a handwritten question. Using the Google Gen AI SDK, the app passes the image directly to **Gemma 4**, which accurately reads the handwriting and breaks down the math, logic, or theory step-by-step. 

### 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), React, HTML/CSS
* **AI Backend:** Google Gen AI SDK
* **Model:** Gemma 4 (`gemma-4-26b-a4b-it`)
* **Deployment:** Vercel

---

### 🤝 Contributing (The Open-Source Vision)
This project is open-source under the MIT License. We want to build a centralized `prompts.json` library where developers from different universities can submit Pull Requests to add specific system prompts. 

For example, a contributor from FUOYE Computing could add a specific prompt template that tells Gemma 4 exactly how a specific lecturer expects answers to be formatted. 

**How to contribute:**
1. Fork the repository.
2. Clone locally and add your university's custom prompt template.
3. Submit a Pull Request!

### 🚀 Running Locally
1. Clone the repo: `git clone https://github.com/yourusername/opensolve-ng.git`
2. Install dependencies: `npm install`
3. Add your Gemma API key to `.env.local`: `GEMINI_API_KEY=your_key_here`
4. Run the server: `npm run dev`

---
*Built for the MLH Hacktoberfest Hack Day Ikole-Ekiti x Oye-Ekiti*
