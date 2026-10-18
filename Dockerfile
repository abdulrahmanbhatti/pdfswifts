# Dockerfile for 100% Free Deployment on Hugging Face Spaces / Render / Railway
FROM node:20-slim

WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies and build frontend
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

# Hugging Face default port is 7860, others use 5000/10000
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

# Start unified server (Express serves built React frontend + PDF APIs)
CMD ["node", "backend/src/server.js"]
