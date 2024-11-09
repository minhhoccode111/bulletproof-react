import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

// component to display when path not found
export const NotFoundRoute = () => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      {/* "replace" control how the browser handles navigation history, in this
       * case, we want to replace because we don't want user to his "Back"
       * button and go back to this not found path */}
      <Link to={paths.home.getHref()} replace>
        Go to Home
      </Link>
    </div>
  );
};
