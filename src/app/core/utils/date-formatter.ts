import { DateTimeFormatOptions } from 'src/app/shared/shared.model';

export const dateFormatter = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateToUS = (dateString: string) => {
  if (dateString) {
    const options: DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const [day, month, year] = dateString.split('/');

    const date = new Date(`${year}-${month}-${day}`);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date
    );
    const parts = formattedDate.split(' ');
    const switchedDate = `${parts[1].slice(0, -1)} ${parts[0]}, ${parts[2]}`;

    return switchedDate;
  } else {
    return null;
  }
};

export const dateToDataTime = (dateTimeString: string | null) => {
  if (dateTimeString) {
    const options: DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', options);
    const parts = formattedDate.split(' ');
    const switchedDate = `${parts[1].slice(0, -1)} ${parts[0]} ${parts[2]}`;
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      date: switchedDate.slice(0, formattedDate.lastIndexOf(',')),
      time: formattedTime,
    };
  }
  return null;
};
