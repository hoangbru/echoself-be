# Echoself - Music Streaming API

A production-ready RESTful API for a music streaming service, built with Node.js, Express.js, TypeScript, PostgreSQL, and Prisma.

## Technology Stack

- **Backend**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Installation

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/hoangbru/echoself-be.git
   cd echoself-be
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit `.env` and update the following:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `JWT_REFRESH_SECRET`: A strong secret key for refresh tokens
   - `PORT`: Server port (default: 3000)

4. **Setup the database**
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`
   This will create all tables and run migrations.

5. **Start the server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The server will start on `http://localhost:3000`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Register and verify your email
2. Login to get access and refresh tokens
3. Include the access token in the `Authorization` header:
   \`\`\`
   Authorization: Bearer <your-access-token>
   \`\`\`

## Database Schema

The database includes the following main entities:

- **User**: User accounts with roles (USER, ADMIN)
- **Playlist**: User playlists with songs
- **Song**: Music tracks with metadata
- **Artist**: Music artists
- **Album**: Music albums
- **Genre**: Music genres

See `prisma/schema.prisma` for the complete schema.

## Error Handling

The API uses a global error handling middleware that returns consistent error responses:

\`\`\`json
{
  "message": "Error message",
  "error": "Error"
}
\`\`\`

## Development

### Run in development mode with auto-reload
\`\`\`bash
npm run dev
\`\`\`

### Generate Prisma Client
\`\`\`bash
npm run prisma:generate
\`\`\`

### Open Prisma Studio (Database GUI)
\`\`\`bash
npm run prisma:studio
\`\`\`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production database (e.g., AWS RDS, Heroku Postgres)
3. Set strong JWT secrets
4. Configure CORS appropriately
5. Use a process manager like PM2
6. Set up proper logging and monitoring

## Future Enhancements

- [ ] OAuth integration (Google, Spotify)
- [ ] Real email service integration
- [ ] Cloudinary file upload implementation
- [ ] Rate limiting
- [ ] Caching with Redis
- [ ] WebSocket support for real-time updates
- [ ] Advanced search with Elasticsearch
- [ ] Analytics and recommendations
- [ ] Payment integration for premium features

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
