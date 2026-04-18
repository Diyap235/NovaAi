# NovaAi

NovaAi is a full-stack intelligent writing assistant designed to make text analysis simple, fast, and useful. The idea behind this project was to bring multiple text processing features into one place instead of relying on different tools for different tasks.

The system takes raw text as input and processes it through a structured NLP pipeline to generate meaningful insights such as summaries, sentiment, keywords, readability score, and similarity detection. The focus of this project is not just on implementing features, but on building a complete working system that is scalable, secure, and easy to use.

---

## Why NovaAi?

While working with content, I realized that most tools either do one thing well or give unstructured results. Switching between tools becomes inefficient. NovaAi was built to solve that — a single platform where everything is integrated and results are clear and consistent.

---

## Features

* Text Summarization (extractive)
* Sentiment Analysis (positive, negative, neutral)
* Keyword Extraction with density
* Readability Score (Flesch-based)
* Grammar Checking (basic rule-based)
* Vocabulary Enhancement suggestions
* Style consistency suggestions
* Similarity / plagiarism detection (TF-IDF + cosine)

---

## Tech Stack

Frontend:

* React.js

Backend:

* Node.js
* Express.js

Database:

* MongoDB

NLP:

* compromise (tokenization, parsing)
* natural (TF-IDF, similarity)

Security:

* JWT authentication
* Bcrypt password hashing

---

## How It Works

1. User enters text in the frontend (React UI)
2. Request is sent to backend via API
3. Backend processes text using NLP pipeline:
   tokenization → analysis → feature modules
4. Results are generated in structured format
5. Output is displayed to the user

---

## Project Structure

/client
/server
/routes
/controllers
/models
/utils (NLP logic)

---

## Setup Instructions

1. Clone the repository
   git clone 

2. Install dependencies
   npm install

3. Start backend
   node server.js

4. Start frontend
   npm start

5. Add environment variables (.env)
   MONGO_URI=your_db
   JWT_SECRET=your_secret

---

## Challenges Faced

* Integrating multiple NLP features into one pipeline
* Managing large text efficiently
* Maintaining performance while adding features
* Ensuring smooth frontend-backend communication

---

## What I Learned

This project helped me understand how real-world applications are built. It was not just about coding features, but about connecting everything properly — frontend, backend, database, and logic. I also got hands-on experience with NLP concepts and API design.

---

## Future Improvements

* Add advanced models like BERT/GPT
* Support multiple languages
* Improve grammar and style suggestions
* Deploy on cloud (AWS)
* Convert into a SaaS product

---

## Final Note

NovaAi is built as a practical system, not just a demo project. The goal was to create something that actually works end-to-end and can be extended further.

---

## Author

Diya Prajapati
