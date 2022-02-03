import CreatePostIcon from 'components/common/Icons/CreatePostIcon';
import OutlineHomeIcon from 'components/common/Icons/OutlineHomeIcon';
import ProfileIcon from 'components/common/Icons/ProfileIcon';
import SettingsIcon from 'components/common/Icons/SettingsIcon';
import ProfileImage from 'components/ProfileImage';
import useAuth from 'hooks/useAuth';
import useOnClickOutside from 'hooks/useOnClickOutside';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import instagramLogo from '../../../public/instagram-logo.svg';
import testImage from '../../../public/test_profile.jpg';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.container}>
        <Link href="/">
          <a aria-label="Instagram logo">
            <div className={styles.logoWrapper}>
              <Image src={instagramLogo} alt="Instagram" layout="fill" />
            </div>
          </a>
        </Link>

        <div className={styles.rightMenu}>
          <button className={styles.rightMenuButton}>
            <OutlineHomeIcon className={styles.rightMenuIcon} />
          </button>
          <button className={styles.rightMenuButton}>
            <CreatePostIcon className={styles.rightMenuIcon} />
          </button>
          <NavbarProfile />
        </div>
      </nav>
    </header>
  );
}

function NavbarProfile() {
  const auth = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleProfileClick = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <button
        className={`${styles.navbarButton} ${styles.profileButton} ${
          isMenuOpen ? styles.active : ''
        }`}
        onClick={handleProfileClick}
      >
        <ProfileImage src={testImage} />
      </button>

      <ProfileMenu isOpen={isMenuOpen} onClose={handleProfileClick} />
    </>
  );
}

function ProfileMenu({ isOpen, onClose }) {
  const ref = useRef();
  useOnClickOutside(ref, onClose);

  return (
    isOpen && (
      <div className={styles.profileMenu} ref={ref}>
        <Link href="/profile">
          <a className={styles.menuButton}>
            <ProfileIcon />
            Profile
          </a>
        </Link>
        <Link href="/settings">
          <a className={styles.menuButton}>
            <SettingsIcon />
            Settings
          </a>
        </Link>
        <Link href="/logout">
          <a className={`${styles.menuButton} ${styles.logoutButton}`}>Log Out</a>
        </Link>
      </div>
    )
  );
}
