import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

// config default setting for queries
export const queryConfig = {
  queries: {
    // throwOnError: true,
    // disable refetch on window focus
    refetchOnWindowFocus: false,
    // disable retry attempt
    retry: false,
    // setting data to be stale after 1 minute
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

// extracts the type of the resolved value from any function that return a Promise
// making it easier to work with async function return types
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

// creates a type for query configuration that excludes queryKey and queryFn
// simplifying setup for custom query options.
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

// defines configuration options for a mutation, specifying the mutation’s
// return type, error type, and parameter type for better type safety
export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
