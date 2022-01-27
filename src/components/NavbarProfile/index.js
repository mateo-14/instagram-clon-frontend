import { useRef, useState } from 'react';
import NavbarButton from 'components/NavbarButton';
import styles from './NavbarProfile.module.css';
import ProfileIcon from 'components/common/Icons/ProfileIcon';
import SettingsIcon from 'components/common/Icons/SettingsIcon';
import Link from 'next/link';
import ProfileImage from 'components/ProfileImage';
import testImage from '../../../public/test_profile.jpg';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useAuth from 'hooks/useAuth';

export default function NavbarProfile() {
  const auth = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleProfileClick = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <NavbarButton
        onClick={handleProfileClick}
        className={`${styles.profileButton} ${isMenuOpen ? styles.active : ''}`}
      >
        <ProfileImage src={testImage} />
      </NavbarButton>

      <ProfileMenu isOpen={isMenuOpen} onClose={handleProfileClick} />
    </>
  );
}

function ProfileMenu({ isOpen, onClose }) {
  const ref = useRef();
  useOnClickOutside(ref, onClose);

  return (
    isOpen && (
      <div className={styles.menu} ref={ref}>
        <ProfileMenuButton href="/profile">
          <ProfileIcon />
          Profile
        </ProfileMenuButton>
        <ProfileMenuButton href="/settings">
          <SettingsIcon />
          Settings
        </ProfileMenuButton>
        <ProfileMenuButton href="/logout" className={styles.logoutButton}>
          Log Out
        </ProfileMenuButton>
      </div>
    )
  );
}

const ProfileMenuButton = ({ children, onClick, href, className }) => (
  <Link href={href}>
    <a onClick={onClick} className={`${styles.menuButton} ${className ? className : ''}`}>
      {children}
    </a>
  </Link>
);
