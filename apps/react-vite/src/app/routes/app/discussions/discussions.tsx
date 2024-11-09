import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionsList } from '@/features/discussions/components/discussions-list';

// load the initial data for discussions before rendering DiscussionsRoute component

export const discussionsLoader =
  (
    // take a QueryClient's instance
    queryClient: QueryClient,
  ) =>
  // return an async function, which takes request, which includes data about current request
  async ({ request }: LoaderFunctionArgs) => {
    // new URL instance base on current request url
    const url = new URL(request.url);

    // get the pagination param, default 1
    const page = Number(url.searchParams.get('page') || 1);

    // build a query configuration, including the query key and fetch function, base on 'page'
    // TODO: explore more this
    const query = getDiscussionsQueryOptions({ page });

    return (
      // check if data for this query already existed in cache
      queryClient.getQueryData(query.queryKey) ??
      // fetch data from the server if it's not cached
      (await queryClient.fetchQuery(query))
    );
  };

// component that defines the layout and content of the discussions page,
// including elements for creating and listing discussions.
export const DiscussionsRoute = () => {
  // queryClient instance
  const queryClient = useQueryClient();

  return (
    // a wrapper for the layout with a title of 'Discussions'
    <ContentLayout title="Discussions">
      <div className="flex justify-end">
        {/* create new discussion feature */}
        {/* TODO: explore this */}
        <CreateDiscussion />
      </div>
      <div className="mt-4">
        <DiscussionsList
          onDiscussionPrefetch={(id) => {
            // Prefetch the comments data when the user hovers over the link in the list
            queryClient.prefetchInfiniteQuery(
              getInfiniteCommentsQueryOptions(id),
            );
          }}
        />
      </div>
    </ContentLayout>
  );
};
