# Contributing to Essence Radio

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone <your-fork>
   cd essence
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Set Up Environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env
   ```

4. **Start Development**
   ```bash
   # Terminal 1: Backend
   npm run dev:backend
   
   # Terminal 2: Web
   npm run dev:web
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Run linter: `npm run lint` (in each app directory)
- Format code: `npm run format` (in backend)

## Project Structure

```
essence/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/    # Authentication module
│   │   ├── stations/ # Stations CRUD
│   │   ├── chat/    # WebSocket chat
│   │   ├── streaming/ # WebRTC signalling
│   │   └── admin/   # Admin panel
├── web/             # React web app
│   └── src/
│       ├── pages/   # Page components
│       ├── components/ # Reusable components
│       └── contexts/ # React contexts
└── mobile/          # Expo React Native
    └── src/
        ├── screens/ # Screen components
        └── components/ # Reusable components
```

## Adding New Features

1. **Backend**: Create module in `backend/src/`
2. **Web**: Add pages/components in `web/src/`
3. **Mobile**: Add screens in `mobile/src/screens/`
4. **Update**: Add routes, update navigation

## Testing

- Backend: `cd backend && npm test`
- Manual testing recommended for WebRTC features

## Pull Request Process

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

