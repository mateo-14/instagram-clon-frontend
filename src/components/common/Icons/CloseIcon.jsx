const CloseIcon = ({ className = '' }) => (
  <svg aria-label="Close" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <polyline
      fill="none"
      points="20.643 3.357 12 12 3.353 20.647"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    ></polyline>
    <line
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      x1="20.649"
      x2="3.354"
      y1="20.649"
      y2="3.354"
    ></line>
  </svg>
);
export default CloseIcon;