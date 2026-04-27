# Chatster

Talk to strangers. Stay anonymous.

Chatster is a simple, fast, and anonymous chat platform where you can connect with people around the world instantly. No complicated profiles, just jump in and start talking.

### Features
- **Instant Matchmaking**: Find someone to talk to in seconds.
- **True Anonymity**: No personal data required to chat as a guest.
- **Real-time Interaction**: Live typing indicators and instant messaging.
- **Safety First**: Built-in reporting and safety reminders.
- **Responsive Design**: Works great on both desktop and mobile.

### Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, TypeScript
- **Backend**: Node.js, Express 5, Socket.IO 4
- **Database/Queue**: Redis (for matchmaking), MongoDB (for optional user accounts)

### How to run locally

1. **Redis**: Start a Redis instance (Docker is easiest)
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Backend**:
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI and PORT
   npm start
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   # Create .env.local with NEXT_PUBLIC_BACKEND_URL
   npm run dev
   ```

### Deployment
[Live Demo Link Placeholder]

---
*Stay safe and respect others in the community.*
