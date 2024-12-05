/*
Centralized Configuration: Sets default React Query behaviors with queryConfig
Reusable Type Utilities: Simplifies typing for queries and mutations by inferring:
- Return types of API functions (ApiFnReturnType)
- Input and output types for queries and mutations (QueryConfig and MutationConfig)
Improved Type Safety: Reduces manual type definitions when integrating React Query with API calls
*/

// UseMutationOptions: A type for configuring mutations in React Query
// DefaultOptions: A type for setting global default configurations for queries and mutations
import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

// Centralizes default settings for queries used throughout the app
export const queryConfig = {
  queries: {
    // throwOnError: true,
    // prevents refetching data when the window regains focus
    refetchOnWindowFocus: false,
    // disables automatic retries on query failure
    retry: false,
    // marks data as fresh for 1 minute, reducing unnecessary refetches
    staleTime: 1000 * 60, // 1 min
  },
  // ensures the configuration matches React Query's DefaultOptions type
} satisfies DefaultOptions;

// extracts the resolved type (return type) of a function that returns a promise
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;
// example:
// const fetchUser = async (): Promise<User> => { ... };
// ApiFnReturnType<typeof fetchUser> // Resolves to `User`

// creates a type for configuring queries without requiring the queryKey and queryFn properties
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;
// example:
// type Config = QueryConfig<typeof useQuery>;
// Config will contain query options except `queryKey` and `queryFn`

// configures React Query mutations with proper typings for:
// The mutation's return value (ApiFnReturnType)
// The error type (Error)
// The mutation's input parameters (Parameters<MutationFnType>[0])
export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
// example:
// const createUser = async (data: CreateUserRequest): Promise<User> => { ... };
// type Config = MutationConfig<typeof createUser>;
