import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4004/graphql', // Update this to match your backend GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Apollo Client - Token from localStorage:', token ? 'Token exists' : 'No token');
    console.log('Apollo Client - Headers being sent:', {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    });
  }
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
