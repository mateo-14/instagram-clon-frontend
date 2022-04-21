import CreatePostIcon from 'components/common/Icons/CreatePostIcon';
import OutlineHomeIcon from 'components/common/Icons/HomeIcon';
import ProfileIcon from 'components/common/Icons/ProfileIcon';
import SettingsIcon from 'components/common/Icons/SettingsIcon';
import NewPostModal from 'components/NewPostModal';
import ProfileImage from 'components/common/ProfileImage';
import useAuth from 'hooks/useAuth';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef, useState } from 'react';
import instagramLogo from '/instagram-logo.svg';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default function Header() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.container}>
        <Link to="/" aria-label="Instagram logo">
          <div className={styles.logoWrapper}>
            <img src={instagramLogo} alt="Instagram" />
          </div>
        </Link>

        <div className={styles.rightMenu}>
          <button className={styles.rightMenuButton} type="button">
            <OutlineHomeIcon className={styles.rightMenuIcon} />
          </button>
          <button
            className={styles.rightMenuButton}
            onClick={() => setIsModalVisible(true)}
            type="button"
          >
            <CreatePostIcon className={styles.rightMenuIcon} />
          </button>
          <NavbarProfile />
          {isModalVisible && <NewPostModal onClose={() => setIsModalVisible(false)} />}
        </div>
      </nav>
    </header>
  );
}

function NavbarProfile() {
  const { data } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef();

  return (
    <>
      <button
        className={`${styles.navbarButton} ${styles.profileButton} ${
          isMenuOpen ? styles.active : ''
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        ref={profileRef}
        type="button"
      >
        <ProfileImage src={data?.profileImage} />
      </button>

      <ProfileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        exclude={profileRef}
        user={data}
      />
    </>
  );
}

function ProfileMenu({ isOpen, onClose, user, exclude }) {
  const ref = useRef();
  useOnClickOutside(ref, onClose, [exclude]);

  return (
    isOpen && (
      <div className={styles.profileMenu} ref={ref}>
        <Link to={`/${user.username}`} className={styles.menuButton}>
          <ProfileIcon />
          Profile
        </Link>
        <Link to="/accounts/edit" className={styles.menuButton}>
          <SettingsIcon />
          Settings
        </Link>
        <Link to="/accounts/logout" className={classNames(styles.menuButton, styles.logoutButton)}>
          Log Out
        </Link>
      </div>
    )
  );
}
