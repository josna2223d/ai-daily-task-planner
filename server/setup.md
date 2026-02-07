# DayPilot AI Setup Guide

## Architecture Overview
- **Frontend**: React + Vite + TailwindCSS. Employs \`dnd-kit\` for drag-and-drop and \`recharts\` for statistics. State is managed via React Context/Hooks.
- **Backend**: Node.js + Express (located in \`server/\`). Manages routing and business logic.
- **Database**: SQLite3. Provides a simple, local, zero-configuration relational database to store users, tasks, and subtasks.
- **AI Integration**: OpenAI API. We use the \`openai\` Node package on the backend to securely prompt GPT-3.5/GPT-4 to generate subtasks and daily plans, keeping API keys out of the frontend.

## Prerequisites
- Node.js (v18+)
- npm or yarn

## 1. Environment Setup
1. Create a \`.env\` file in the \`server/\` folder.
2. Add your OpenAI API Key:
   \`\`\`env
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

## 2. Backend Setup (Production / Local Dev)
1. Navigate to the \`server/\` directory.
2. Install dependencies:
   \`npm install express cors sqlite3 openai uuid dotenv\`
3. Start the server:
   \`node server.js\`
   The SQLite database (\`daypilot.db\`) will be created automatically.

## 3. Frontend Setup
1. Ensure you are in the project root.
2. Install dependencies (already done in this environment):
   \`npm install\`
3. Run the frontend development server:
   \`npm run dev\`

## 4. How the AI Works (OpenAI Integration)
The Express backend acts as a secure proxy to OpenAI.
- **Plan My Day**: The frontend sends the user's goals to \`/api/ai/plan-day\`. The backend instructs the AI to return a JSON array of tasks with estimated times and priority levels.
- **Breakdown Task**: The frontend sends a task title to \`/api/ai/breakdown\`. The AI returns a list of actionable subtasks.

*(Note: For this live Vite demo, the frontend will use simulated API calls backed by LocalStorage so you can test it immediately without needing to boot up the Node server or supply an API key!)*