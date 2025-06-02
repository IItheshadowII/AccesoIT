
# Stage 1: Build the Next.js frontend and Express server
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and lock files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
# If you use yarn or pnpm, adjust accordingly
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build Next.js app and Express server
# The "build" script in package.json should handle both (e.g., with npm-run-all)
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist # This is where the compiled Express server goes

# Expose Next.js port (default 9002 as per your package.json dev script)
# Expose Express server port (default 3001 as per server/index.ts)
EXPOSE 9002
EXPOSE 3001

# Set environment variables (can also be set at runtime)
# ENV NODE_ENV=production
# ENV SERVER_PORT=3001
# ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other necessary ENV variables for Firebase client and admin SDK

# Command to run both Next.js app and Express server
# You might use a process manager like PM2 in a real deployment for better reliability.
# For simplicity, this Dockerfile uses npm-run-all if your start script handles both.
# Or, you can run them as separate commands if your start script is just for one.
# The "start" script in the provided package.json uses npm-run-all.
CMD ["npm", "start"]

# ---
# Notes for deployment on VPS:
# 1. Service Account Key for Firebase Admin:
#    - Option A (Recommended for Docker): Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
#      and FIREBASE_PRIVATE_KEY as environment variables when running the Docker container.
#      The private key should have its newlines escaped (e.g., \n).
#    - Option B: If not using Docker or prefer a file, copy your serviceAccountKey.json
#      into the image (not recommended for security if the image is public) or mount it as a volume.
#      Then set GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json in your Docker run command
#      or server environment. The `src/server/firebaseAdmin.ts` currently prioritizes direct env vars.
#
# 2. Environment Variables:
#    Ensure all necessary environment variables from your .env file (like GOOGLE_API_KEY,
#    Firebase client config, Firebase admin config, SERVER_PORT) are available to the container
#    at runtime (e.g., using `docker run -e VAR=value ...` or a .env file with Docker Compose).
#
# 3. Running directly on VPS (without Docker):
#    - Install Node.js (e.g., v18).
#    - Clone your repository.
#    - Create a .env file with your production configurations.
#    - Run `npm install --production` (or your package manager's equivalent).
#    - Run `npm run build`.
#    - Run `npm start`.
#    - Consider using a process manager like PM2:
#      `npm install pm2 -g`
#      `pm2 start npm --name "accesoit-app" -- run start`
#      `pm2 startup`
#      `pm2 save`
#
# 4. CORS:
#    The Express server (`src/server/index.ts`) includes `cors()`.
#    You might need to configure it more strictly in production, e.g.:
#    `app.use(cors({ origin: 'https://your-frontend-domain.com' }));`
#
# 5. Next.js serving:
#    The `npm start` script uses `npm-run-all` to start both Next.js and the Express server.
#    In a production VPS, you might have Nginx or Apache as a reverse proxy in front of
#    both Node.js processes, routing traffic appropriately (e.g., requests to /api/* to
#    the Express server, and other requests to the Next.js server).
#
# 6. tsconfig.server.json:
#    This Dockerfile assumes `npm run build` compiles the server TypeScript code into `dist/`.
#    A `tsconfig.server.json` is needed for this.
