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
import { Link, useMatch } from 'react-router-dom';
import classNames from 'classnames';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isHomeActive = useMatch({ path: '', end: true });

  return (
    <header className={styles.header}>
      <nav className={styles.container}>
        <Link to="/" aria-label="Instagram logo">
          <div className={styles.logoWrapper}>
            <img src={instagramLogo} alt="Instagram" />
          </div>
        </Link>

        <div className={styles.rightMenu}>
          <Link
            className={classNames(styles.rightMenuButton, { [styles.active]: isHomeActive })}
            to="/"
          >
            <OutlineHomeIcon />
          </Link>

          <button
            className={styles.rightMenuButton}
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <CreatePostIcon />
          </button>
          <NavbarProfileButton />
          {isModalOpen && <NewPostModal onClose={() => setIsModalOpen(false)} />}
        </div>
      </nav>
    </header>
  );
}

function NavbarProfileButton() {
  const { data } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef();

  return (
    <>
      <button
        className={classNames(styles.profileButton, {
          [styles.active]: isMenuOpen,
        })}
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
  useOnClickOutside(ref, onClose, isOpen, [exclude]);

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
