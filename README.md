# autoRAG-n8n

> End-to-end no-code Retrieval-Augmented Generation (RAG) chat system using `n8n`, `Supabase`, and `Telegram` powered by `OpenRouter`.

This repository contains two main automated workflows built using n8n:
1. **Web Scraper → Chunk → Embed → Vector Store (Supabase)**
2. **Telegram Chat → Embed Query → Vector Search → RAG → Response**

---

## 📁 Folder Structure

```
autoRAG-n8n/
├── workflows/                  # n8n export files
│   ├── website_ingest.json     # Ingest workflow: URL → Vector DB
│   └── telegram_chat_rag.json  # Telegram RAG chat workflow
├── sql/
│   └── create_rag_table.sql    # SQL to setup Supabase table
├── env.template                # Template for required environment variables
├── README.md                   # Project documentation
├── challenges.md               # Document challenges & solutions
└── demo/
    └── demo.mp4                # Screen recording of the complete demo
```

---

## ⚙️ Setup Instructions

### Step 1: Clone the Repo
```bash
git clone https://github.com/<your-username>/autoRAG-n8n.git
cd autoRAG-n8n
```

### Step 2: Configure Environment Variables
Create a `.env` file using the provided template:
```bash
cp env.template .env
```
Edit `.env` and add your keys:
```env
OPENROUTER_API_KEY=sk-...
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
```

### Step 3: Set Up Supabase
1. Create a new Supabase project
2. Open SQL editor and run:
```sql
-- from sql/create_rag_table.sql
create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists rag_documents (
  id uuid primary key default uuid_generate_v4(),
  source_url text not null,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536) not null
);
```

### Step 4: Start n8n
```bash
n8n start
```
Or use Docker:
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Step 5: Import Workflows
In n8n UI:
- Import `workflows/website_ingest.json`
- Import `workflows/telegram_chat_rag.json`

Configure credentials as prompted:
- `OpenRouter` (API Key)
- `Supabase` (HTTP Header Auth)
- `TelegramBot`

---

## 🧪 How to Test

### Web Ingest Test
- Go to the webhook URL exposed by the "Website Ingest" form node.
- Submit a valid webpage URL.
- Confirm chunks appear in Supabase’s `rag_documents` table.

### Telegram RAG Chat
- Message your bot with a question relevant to the ingested content.
- Bot will reply with an AI-generated answer using RAG.

---

## 📹 Demo

A full screen-recorded walk-through can be found at `demo/demo.mp4`.

---

## 🧱 Built With
- [n8n](https://n8n.io/) - No-code automation
- [Supabase](https://supabase.com/) - Vector DB (via pgvector)
- [OpenRouter](https://openrouter.ai/) - LLM API platform
- [Telegram](https://core.telegram.org/bots/api) - Chat interface

---

## 🧠 Challenges Faced (`challenges.md`)
- Embedding format compatibility
- Telegram webhook vs polling
- n8n payload debugging & transformation quirks

---

## 🚀 Future Enhancements
- Add full support for PDF & DOCX ingestion
- Enable Slack or WhatsApp integrations
- Replace Supabase with Pinecone for enterprise scale
- Add error workflows for logging failures

---

## 🙌 Credits
Made with ❤️ by Pranav | Inspired by autonomous agent stacks

---

## 📘 License
[MIT](LICENSE)
