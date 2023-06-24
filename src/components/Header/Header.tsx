'use client'

import CreatePostIcon from '@/components/common/Icons/CreatePostIcon'
import OutlineHomeIcon from '@/components/common/Icons/HomeIcon'
import ProfileIcon from '@/components/common/Icons/ProfileIcon'
import SettingsIcon from '@/components/common/Icons/SettingsIcon'
// import NewPostModal from '@/components/NewPostModal'
import ProfileImage from '@/components/common/ProfileImage'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import { useRef, useState } from 'react'
import styles from './Header.module.css'
// import { Link, useLocation, useMatch } from 'react-router-dom'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import useAuth from '@/hooks/useAuth'
import { type User } from '@/types/user'
import NewPostModal from '../NewPostModal'
import { usePathname } from 'next/navigation'

export default function Header (): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isHomeActive = usePathname() === '/'
  const { data: user, isLoading, logout } = useAuth()

  return (
    <header className={styles.header}>
      <nav className={styles.container}>
        <Link href="/" aria-label="Instagram logo" className={styles.logoLink}>
          <Image src="/instagram-logo.svg" alt="Instagram Logo" width={100} height={28}></Image>
        </Link>

        <div className={styles.rightMenu}>
          <Link
            className={classNames(styles.rightMenuButton, { [styles.active]: isHomeActive })}
            href="/"
          >
            <OutlineHomeIcon />
          </Link>

          <button
            className={styles.rightMenuButton}
            onClick={() => { setIsModalOpen(true) }}
            type="button"
          >
            <CreatePostIcon />
          </button>
          {user != null && <NavbarProfileButton data={user} onLogout={() => {
            logout()
          }}/>}
          {isLoading && <div className={styles.profilePictureLoading} />}
          {isModalOpen && <NewPostModal onClose={() => {
            if (!isLoading) {
              setIsModalOpen(false)
            }
          }} />}
        </div>
      </nav>
    </header>
  )
}

interface NavbarProfileButtonProps {
  data: User
  onLogout: () => void
}

function NavbarProfileButton ({ data, onLogout }: NavbarProfileButtonProps): JSX.Element | null {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const profileRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        className={classNames(styles.profileButton, {
          [styles.active]: isMenuOpen
        })}
        onClick={() => { setIsMenuOpen(!isMenuOpen) }}
        ref={profileRef}
        type="button"
      >
        <ProfileImage src={data.profileImage} width={30} height={30} />
      </button>

      <ProfileMenu
        isOpen={isMenuOpen}
        onClose={() => { setIsMenuOpen(false) }}
        exclude={profileRef}
        user={data}
        onLogout={onLogout}
      />
    </>
  )
}

interface ProfileMenuProps {
  isOpen: boolean
  onClose: () => void
  exclude: React.RefObject<HTMLElement>
  user: User
  onLogout: () => void
}

function ProfileMenu ({ isOpen, onClose, user, exclude, onLogout }: ProfileMenuProps): JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onClose, isOpen, [exclude])

  return (
    isOpen
      ? (
        <div className={styles.profileMenu} ref={ref}>
          <Link href={`/${user.username}`} className={styles.menuButton}>
            <ProfileIcon />
            Profile
          </Link>
          {/* <Link href="/accounts/edit" className={styles.menuButton}>
            <SettingsIcon />
            Settings
          </Link> */}
          <button onClick={onLogout} className={classNames(styles.menuButton, styles.logoutButton)}>
            Log Out
          </button>
        </div>
        )
      : null
  )
}
