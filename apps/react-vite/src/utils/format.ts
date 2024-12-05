import { default as dayjs } from 'dayjs';

// use dayjs to format dates
export const formatDate = (date: number) =>
  dayjs(date).format('MMMM D, YYYY h:mm A');
