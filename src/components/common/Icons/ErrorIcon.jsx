const ErrorIcon = ({ className }) => (
  <svg
    aria-label="Something went wrong. Please try again."
    fill="currentColor"
    role="img"
    viewBox="0 0 96 96"
    className={className}
  >
    <path d="M48 0c26.5 0 48 21.5 48 48S74.5 96 48 96 0 74.5 0 48 21.5 0 48 0zm0 2C22.6 2 2 22.6 2 48s20.6 46 46 46 46-20.6 46-46S73.4 2 48 2zm0 57.8c3.4 0 6.1 2.7 6.1 6.1 0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1c0-3.3 2.7-6.1 6.1-6.1zm0 2c-2.3 0-4.1 1.8-4.1 4.1S45.7 70 48 70s4.1-1.8 4.1-4.1c0-2.2-1.8-4.1-4.1-4.1zM48 23c3.5 0 6.4 2.8 6.1 6.2l-1.6 22.5c-.2 2.3-2.2 4-4.5 4-2.4 0-4.4-1.7-4.5-4l-1.6-22.5c-.3-3.4 2.6-6.2 6.1-6.2zm0 2c-2.4 0-4.3 1.9-4.1 4l1.6 22.5c.1 1.2 1.2 2.1 2.5 2.1s2.4-.9 2.5-2.1L52.1 29c.2-2.1-1.7-4-4.1-4z"></path>
  </svg>
);
export default ErrorIcon;
