const ProfileIcon = ({ className = '' }) => (
  <svg
    aria-label="Profile"
    className={className}
    role="img"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle
      cx="12.004"
      cy="12.004"
      r="10.5"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></circle>
    <path
      d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></path>
    <circle
      cx="12.006"
      cy="9.718"
      r="4.109"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></circle>
  </svg>
);

export default ProfileIcon;
