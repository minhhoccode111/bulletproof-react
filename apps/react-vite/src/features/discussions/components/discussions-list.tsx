import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

// custom components
import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';

import { paths } from '@/config/paths';
import { formatDate } from '@/utils/format';

import { getDiscussionQueryOptions } from '../api/get-discussion';
import { useDiscussions } from '../api/get-discussions';

import { DeleteDiscussion } from './delete-discussion';

export type DiscussionsListProps = {
  // an optional function takes a discussion id string allow pre-fetching data
  // on certain interaction, like 'hover'
  onDiscussionPrefetch?: (id: string) => void;
};

// component fetched a paginated list of discussions, displaying them in a table
// with options for viewing and deleting
export const DiscussionsList = ({
  onDiscussionPrefetch,
}: DiscussionsListProps) => {
  // read URL query params, like 'page'
  const [searchParams] = useSearchParams();

  // use the useDiscussions hook, passing the 'page' value from `searchParams`
  // the query return `isLoading`, `data`, and `meta` (pagination details)
  // TODO: explore this
  const discussionsQuery = useDiscussions({
    page: +(searchParams.get('page') || 1),
  });

  // access the queryClient for managing cache and pre-fetching data
  const queryClient = useQueryClient();

  // display spinner if data state is 'isLoading'
  if (discussionsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discussions = discussionsQuery.data?.data;

  const meta = discussionsQuery.data?.meta;

  // if the discussions is 'null', the component return null, meaning no content
  // is rendered if the data isn't available
  if (!discussions) return null;

  return (
    // render the table if discussions data is available
    // TODO: explore this
    <Table
      data={discussions}
      columns={[
        {
          title: 'Title',
          field: 'title',
        },
        {
          title: 'Created At',
          field: 'createdAt',
          // the Cell function allows you to customize how data is displayed in
          // individual cells of a column
          // if Cell is not provided the table will display the data directly
          // from the specified field
          // TODO: explore this Cell custom function
          Cell({ entry: { createdAt } }) {
            return <span>{formatDate(createdAt)}</span>;
          },
        },
        {
          // this is 'id' field, but will be used as the `view` link by passing
          // the value to a Link wrapper component which pre-fetch all comments
          // of that discussion's id on hover. Great!
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return (
              // link to a specific discussion, pre-fetch all comments on hover
              <Link
                onMouseEnter={() => {
                  // Prefetch the discussion data when the user hovers over the link
                  queryClient.prefetchQuery(getDiscussionQueryOptions(id));
                  onDiscussionPrefetch?.(id);
                }}
                // dynamic link to view discussion
                to={paths.app.discussion.getHref(id)}
              >
                View
              </Link>
            );
          },
        },
        {
          // same with above but with delete button
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <DeleteDiscussion id={id} />;
          },
        },
      ]}
      // include pagination controls if pagination meta data is available
      pagination={
        meta && {
          totalPages: meta.totalPages,
          currentPage: meta.page,
          rootUrl: '',
        }
      }
    />
  );
};
