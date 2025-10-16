import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { checkTokenAndHandleExpiration, isTokenExpired } from '../utils/tokenUtils';

const httpLink = createHttpLink({
  uri: 'https://api.badhosa.com/graphql', // Change this line
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Check if token is expired before sending request
  if (typeof window !== 'undefined' && token) {
    if (isTokenExpired(token)) {
      checkTokenAndHandleExpiration();
      return {
        headers: {
          ...headers,
          authorization: "",
        }
      };
    }
  }
  
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle authentication errors
      if (message.includes('Authentication required') || 
          message.includes('Authentication failed') ||
          message.includes('User not found')) {
        checkTokenAndHandleExpiration();
      }
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    
    // Handle network errors that might be authentication related
    if (networkError.message.includes('401') || 
        networkError.message.includes('Unauthorized')) {
      checkTokenAndHandleExpiration();
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
