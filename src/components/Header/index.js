import Image from 'next/image';
import styles from './Header.module.css';
import instagramLogo from '../../../public/instagram-logo.svg';
import CreatePostIcon from 'components/common/Icons/CreatePostIcon';
import OutlineHomeIcon from 'components/common/Icons/OutlineHomeIcon';
import NavbarButton from 'components/NavbarButton';
import NavbarProfile from 'components/NavbarProfile';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Image src={instagramLogo} alt="Instagram" layout="fill" />
        </div>
        <nav className={styles.navbar}>
          <NavbarButton>
            <OutlineHomeIcon className={styles.navbarIcon} />
          </NavbarButton>
          <NavbarButton>
            <CreatePostIcon className={styles.navbarIcon} />
          </NavbarButton>
          <NavbarProfile />
        </nav>
      </div>
    </header>
  );
}
