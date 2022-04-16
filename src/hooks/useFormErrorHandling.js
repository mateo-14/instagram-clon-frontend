export default function useFormErrorHandling(setError) {
  const handleError = (err) => {
    if (err.errors) {
      for (const key in err.errors) {
        setError(key, { message: err.errors[key] });
      }
    } else
      setError('error', {
        message: `An unknown error has occurred ${
          err.status ? '(HTTP status code ' + err.status + ')' : ''
        }`,
      });
  };

  return handleError;
}
