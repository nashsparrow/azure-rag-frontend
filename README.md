# azure-rag-frontend

This project is an Angular frontend for a RAG research assistant. It lets users upload PDF documents, track document indexing, and ask grounded questions through a chat interface backed by an Azure-based retrieval pipeline.

The app includes a home dashboard, a document upload flow, a chat experience, an architecture page, and an evaluation page. It is designed to work with a separate backend API and reads the API base URL from `src/environments/environment.ts`.

For local development, run the frontend from the `rag-chat-frontend` folder with `npm install` and `npm start`. In GitHub Actions, the deployment workflow generates `environment.ts` from the `BASE_URL` repository secret before building and deploying the app.

## Project structure

- `rag-chat-frontend/src/app/home` contains the main dashboard, upload flow, quick links, and embedded chat area.
- `rag-chat-frontend/src/app/chat` contains the chat UI and request flow for asking questions against uploaded content.
- `rag-chat-frontend/src/app/services` contains the API service used to talk to the backend.
- `rag-chat-frontend/src/app/document-list-dialog` contains the dialog that shows indexed documents.
- `rag-chat-frontend/src/app/upload-status-dialog` contains the dialog used to show document processing progress.
- `rag-chat-frontend/src/app/architecture` contains the architecture overview page and system diagrams.
- `rag-chat-frontend/src/app/evaluation` contains the evaluation page and retrieval performance summary.
- `rag-chat-frontend/src/environments` contains frontend environment configuration such as the API base URL.
- `rag-chat-frontend/public/images` contains the static diagrams and visual assets used across the app.
- `.github/workflows` contains the GitHub Actions workflow used for build and deployment.
