# NovaAi

NovaAi is a full-stack intelligent writing assistant designed to make text analysis simple, fast, and actually useful. The main idea behind this project was to bring multiple text processing features into one place instead of relying on different tools for different tasks.

The system takes raw text as input and processes it through a structured NLP pipeline to generate meaningful insights such as summaries, sentiment, keywords, readability score, grammar improvements, and similarity detection. Along with this, advanced AI APIs are integrated to enhance accuracy and provide better contextual understanding.

The focus of this project is not just on implementing features, but on building a complete working system that is scalable, secure, and practical.

---

## Why NovaAi?

While working with content, I realized that most tools either focus on one feature or give outputs that are not structured. Switching between tools wastes time and breaks workflow.

NovaAi solves this by combining everything into a single system where results are consistent, structured, and easy to understand.

---

## Features

* Text Summarization (extractive + AI-assisted)
* Sentiment Analysis (tone detection)
* Keyword Extraction with density
* Readability Score (Flesch-based)
* Grammar Checking (rule-based + AI support)
* Vocabulary Enhancement suggestions
* Style consistency suggestions
* Similarity / plagiarism detection (TF-IDF + cosine)
* AI-powered sentence improvement (API-based)

---

## Tech Stack

Frontend:

* React.js

Backend:

* Node.js
* Express.js

Database:

* MongoDB

NLP (Local Processing):

* compromise (tokenization, parsing)
* natural (TF-IDF, similarity)

AI Integration:

* OpenAI API (text improvement, restructuring, advanced suggestions)
* Groq API (fast inference for AI-based processing)

Security:

* JWT authentication
* Bcrypt password hashing

---

## How It Works

1. User enters text in the React interface
2. Request is sent to backend via API
3. Backend processes text through:

   * NLP pipeline (local processing)
   * AI APIs (for advanced enhancements)
4. Modules run:
   tokenization → sentiment → keywords → readability → summary → similarity → AI enhancement
5. Structured output is returned and displayed

---

## Project Structure

/client
/server
/routes
/controllers
/models
/utils (NLP + API logic)

---


## Challenges Faced

* Integrating multiple NLP modules into one pipeline
* Managing balance between local processing and API usage
* Handling large text efficiently
* Maintaining performance with AI API calls
* Ensuring smooth frontend-backend communication

---

## What I Learned

This project helped me understand how real-world systems are built end-to-end. It was not just about implementing features, but about designing flow, handling APIs, managing data, and keeping everything connected.

I also learned how to combine traditional NLP techniques with modern AI APIs to build a more powerful system.

---

## Future Improvements

* Add advanced transformer-based models (BERT/GPT fine-tuning)
* Improve AI-based grammar and style suggestions
* Add multilingual support
* Optimize API usage and cost
* Deploy on cloud (AWS)
* Convert into a SaaS platform

---

## Final Note

NovaAi is not just a feature-based project. It is built as a system that combines NLP and AI into a single workflow. The goal was to make something practical that can actually be extended further.

---

## Author

Diya Prajapati
