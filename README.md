# BadhoSa Frontend

This is the frontend for BadhoSa (Vehicle Rentals) built with Next.js and Apollo Client for GraphQL integration.

## Tech Stack

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **GraphQL** - API query language

## Getting Started

### Prerequisites

Make sure you have the backend server running on `http://localhost:4000` before starting the frontend.

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Run the development server:
```bash
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
client/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Apollo Provider
│   ├── page.tsx          # Home page with vehicle listing
│   └── globals.css       # Global styles
├── components/           # React components
│   └── ApolloWrapper.tsx # Apollo Client provider wrapper
├── lib/                  # Utility libraries
│   └── apollo-client.ts  # Apollo Client configuration
└── public/              # Static assets
```

## GraphQL Integration

The app is configured to connect to your backend GraphQL server at `http://localhost:4000/graphql`. You can modify the endpoint in `lib/apollo-client.ts` if needed.

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Next Steps

1. Customize the GraphQL queries based on your backend schema
2. Add more pages (vehicle details, booking, user profile, etc.)
3. Implement authentication
4. Add more styling and components
5. Set up environment variables for different environments
