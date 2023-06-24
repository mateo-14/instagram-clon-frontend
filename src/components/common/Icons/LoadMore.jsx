const LoadMore = ({className=''}) => (
  <svg stroke="currentColor" role="img" viewBox="0 0 24 24" className={className}>
    <circle
      cx="12.001"
      cy="12.005"
      fill="none"
      r="10.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    ></circle>
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="7.001"
      x2="17.001"
      y1="12.005"
      y2="12.005"
    ></line>
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="12.001"
      x2="12.001"
      y1="7.005"
      y2="17.005"
    ></line>
  </svg>
);

export default LoadMore;
