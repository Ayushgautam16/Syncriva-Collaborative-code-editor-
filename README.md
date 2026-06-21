# Syncriva - Real-Time Collaborative Code Editor

A modern, real-time collaborative code editor that enables multiple developers to write, edit, and code together seamlessly. Built with Docker containerization for easy deployment and AWS-ready infrastructure.

## 🌟 Features

- **Real-Time Collaboration** - Multiple users can edit code simultaneously with instant synchronization
- **Live Cursor Tracking** - See where other users are typing in real-time
- **WebSocket Communication** - Built with Socket.IO for reliable real-time updates
- **Docker Support** - Complete containerization for consistent development and production environments
- **Cloud Ready** - AWS-optimized deployment configuration
- **Modern Stack** - React frontend with Vite for fast development, Express backend with real-time sync

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Syncriva Editor                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐              ┌──────────────────┐   │
│  │   Frontend      │              │    Backend       │   │
│  │  (React+Vite)   │◄────────────►│  (Express+IO)    │   │
│  │                 │   WebSocket  │                  │   │
│  │  • UI Components│              │ • Socket.IO      │   │
│  │  • Real-time    │              │ • Y-socket.io    │   │
│  │    sync         │              │ • CRDT Sync      │   │
│  └─────────────────┘              └──────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│            Docker Container (Node.js 20)                │
│  • Frontend built and served from Backend/public         │
│  • Backend runs on configurable port                     │
└─────────────────────────────────────────────────────────┘
```

## 📋 Project Structure

```
docker-aws-main/
├── Backend/                 # Express.js backend server
│   ├── server.js           # Main server file with Socket.IO setup
│   ├── package.json        # Backend dependencies
│   └── public/             # Static files (built frontend)
│
├── Frontend/               # React + Vite application
│   ├── src/
│   │   ├── main.jsx
│   │   └── app/
│   │       ├── App.jsx
│   │       └── App.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── Syncriva-Collaborative-code-editor-/  # Collaborative editor component
│   └── README.md
│
├── dockerfile              # Multi-stage Docker build
├── .dockerignore           # Docker ignore file
├── aws-setup.pdf           # AWS deployment guide
├── docker.pdf              # Docker documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (for containerized setup)
- **Node.js 20+** (for local development)
- **npm** (Node Package Manager)

### Local Development Setup

#### 1. Clone and Navigate
```bash
cd docker-aws-main
```

#### 2. Backend Setup
```bash
cd Backend
npm install
npm run dev    # Runs with nodemon for auto-reload
```

The backend will start on `http://localhost:3000` by default.

#### 3. Frontend Setup (in a new terminal)
```bash
cd Frontend
npm install
npm run dev    # Starts Vite dev server
```

The frontend will typically run on `http://localhost:5173`.

### Docker Setup

#### 1. Build Docker Image
```bash
docker build -t syncriva:latest .
```

#### 2. Run Container
```bash
docker run -p 3000:3000 syncriva:latest
```

The application will be accessible at `http://localhost:3000`

#### Using Docker Compose (recommended)
```bash
docker-compose up --build
```

## 🔧 Backend

**Location:** `./Backend/`

**Technology Stack:**
- **Framework:** Express.js 5.2.1
- **Real-time Communication:** Socket.IO 4.8.3
- **Collaborative Editing:** y-socket.io 1.1.3 (CRDT-based sync)
- **Runtime:** Node.js 20

**Key Features:**
- RESTful API with Express
- WebSocket support via Socket.IO
- Health check endpoint: `/health`
- CORS enabled for cross-origin requests
- Static file serving for frontend

**Available Scripts:**
```bash
npm run dev      # Development with nodemon
npm start        # Production server
npm test         # Run tests
```

## 💻 Frontend

**Location:** `./Frontend/`

**Technology Stack:**
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS
- **Linting:** ESLint

**Available Scripts:**
```bash
npm run dev      # Development server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐳 Docker Build Process

The `dockerfile` uses a multi-stage build:

1. **Stage 1 - Frontend Build:**
   - Copies Frontend directory
   - Installs dependencies
   - Builds optimized production bundle

2. **Stage 2 - Backend Runtime:**
   - Copies Backend directory with built frontend in `public/`
   - Installs backend dependencies
   - Ready to serve application

## 🌐 API Endpoints

### REST Endpoints
- `GET /health` - Health check endpoint
  - Response: `{ "message": "ok", "success": true }`

### WebSocket Events (Socket.IO)

The application uses Socket.IO for real-time collaboration. Check `Backend/server.js` and `Syncriva-Collaborative-code-editor-/README.md` for specific event handlers.

## 📦 Dependencies

### Backend
```json
{
  "express": "^5.2.1",
  "socket.io": "^4.8.3",
  "y-socket.io": "^1.1.3"
}
```

### Frontend
See `Frontend/package.json` for complete list.

## 🚢 Deployment

### AWS Deployment
- Refer to `aws-setup.pdf` for detailed AWS deployment instructions
- Docker image can be pushed to AWS ECR (Elastic Container Registry)
- Can be deployed using ECS, EKS, or Elastic Beanstalk

### Docker Hub Deployment
```bash
docker tag syncriva:latest <your-dockerhub>/syncriva:latest
docker push <your-dockerhub>/syncriva:latest
```

## 📚 Documentation

- **Docker Setup:** See `docker.pdf`
- **AWS Deployment:** See `aws-setup.pdf`
- **Frontend Details:** See `Frontend/README.md`
- **Syncriva Editor:** See `Syncriva-Collaborative-code-editor-/README.md`

## 🔒 Security & CORS

The application has CORS enabled for all origins. For production:

1. Update CORS configuration in `Backend/server.js`:
   ```javascript
   const io = new Server(httpServer, {
       cors: {
           origin: "https://your-production-domain.com",
           methods: ["GET", "POST"]
       }
   })
   ```

2. Set appropriate environment variables
3. Use HTTPS in production
4. Configure firewall rules

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### WebSocket Connection Issues
- Ensure Socket.IO is properly configured
- Check CORS settings
- Verify firewall allows WebSocket connections
- Check browser console for errors

### Docker Build Failures
```bash
# Clear cache and rebuild
docker system prune -a
docker build --no-cache -t syncriva:latest .
```

## 📝 Environment Variables

Create `.env` files in `Backend/` and `Frontend/` directories as needed:

**Backend (.env):**
```
PORT=3000
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License. See LICENSE files in respective directories.

## 👥 Team & Contact

For questions or support, please open an issue in the repository.

## 🎯 Roadmap

- [ ] User authentication & authorization
- [ ] Persistent code storage
- [ ] Multiple document support
- [ ] Code execution environment
- [ ] Team management features
- [ ] Version control integration
- [ ] Mobile app support

---

**Built with ❤️ for seamless collaboration**
