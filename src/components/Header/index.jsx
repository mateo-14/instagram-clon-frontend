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

  const handleModalClose = (post) => {
    setIsModalVisible(false);

    if (post) {
      // TODO Show toast
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.container}>
        <Link to="/" aria-label="Instagram logo">
          <div className={styles.logoWrapper}>
            <img src={instagramLogo} alt="Instagram" />
          </div>
        </Link>

        <div className={styles.rightMenu}>
          <button className={styles.rightMenuButton}>
            <OutlineHomeIcon className={styles.rightMenuIcon} />
          </button>
          <button className={styles.rightMenuButton} onClick={() => setIsModalVisible(true)}>
            <CreatePostIcon className={styles.rightMenuIcon} />
          </button>
          <NavbarProfile />
          {isModalVisible && <NewPostModal onClose={handleModalClose} />}
        </div>
      </nav>
    </header>
  );
}

function NavbarProfile() {
  const { data } = useAuth();
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
        <ProfileImage src={data?.profileImage} />
      </button>

      <ProfileMenu isOpen={isMenuOpen} onClose={handleProfileClick} user={data} />
    </>
  );
}

function ProfileMenu({ isOpen, onClose, user }) {
  const ref = useRef();
  useOnClickOutside(ref, onClose);

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
