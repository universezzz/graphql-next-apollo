import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from '@apollo/client';

import { PaginatedPost } from "../generated/graphql";
import { NextPageContext } from "next";

const createClient = (ctx: NextPageContext | undefined) => new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(existing: PaginatedPost | undefined, incoming: PaginatedPost): PaginatedPost {
                return {  
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts]
                };
              },  
            },
          },
        },
      },
    }),
    credentials: 'include',
    headers: {
        cookie: (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || "", 
    }
});

export const withApollo = createWithApollo(createClient);    