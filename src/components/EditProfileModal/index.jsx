import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import InputTextArea from 'components/common/InputTextArea';
import Modal, { ModalBody, ModalContent, ModalHeader } from 'components/common/Modal';
import ProfileImage from 'components/common/ProfileImage';
import { show } from 'components/Toast';
import useAuth from 'hooks/useAuth';
import useFormErrorHandling from 'hooks/useFormErrorHandling';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { editProfile, uploadPhoto } from 'services/usersService';
import validateImageFile from 'src/utils/validateImageFile';
import * as yup from 'yup';
import styles from './EditProfileModal.module.css';

const schema = yup
  .object({
    username: yup.string().required('Username is required').trim(),
    bio: yup.string().trim().max(150),
    displayName: yup.string().trim().max(60),
  })
  .required();

export default function EditProfileModal() {
  const location = useLocation();
  const modalLocation = location.state?.modalLocation;
  const navigate = useNavigate();
  const { data: user } = useAuth(true);
  const fileRef = useRef();

  const { register, handleSubmit, formState, setError, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { errors } = formState;
  const handleErrorr = useFormErrorHandling(setError);
  const queryClient = useQueryClient();
  const updatePhotoMutation = useMutation((file) => uploadPhoto(file));
  const editProfileMutation = useMutation((data) => editProfile(data));

  useEffect(() => {
    if (!user) return;

    reset();

    setValue('username', user.username);
    setValue('displayName', user.displayName);
    setValue('bio', user.bio);
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const updated = await editProfileMutation.mutateAsync(data);
      queryClient.setQueryData(['users', user.id], updated);
      show('Profile updated successfully.');
    } catch (err) {
      handleErrorr(err);
    }
  };

  const handleFileChange = (e) => {
    const [file] = e.target.files;
    if (validateImageFile(file)) {
      updatePhotoMutation.mutate(file, {
        onSuccess: () => {
          queryClient.refetchQueries(['users', user.id]);
          show('Photo updated successfully.');
        },
      });
    }
  };

  const handleClose = () => {
    navigate(modalLocation ? modalLocation.pathname : '/');
  };
  return (
    <>
      <Modal isOpen={true} onClose={handleClose} >
        <ModalContent showCloseButton={true} onClose={handleClose} className={styles.modal}>
          <ModalHeader>
            <h1>Edit profile</h1>
          </ModalHeader>
          <ModalBody >
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              {user?.isTestAccount && (
                <p className={styles.testAccountMsg}>
                  You cannot edit the public test account!
                </p>
              )}
              <ProfileImage
                src={user?.profileImage}
                className={styles.changePhotoImg}
              ></ProfileImage>
              <div className={styles.changePhotoRight}>
                <h2 className={styles.changePhotoName}>{user?.username}</h2>
                <Button
                  style="text"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={user?.isTestAccount || updatePhotoMutation.isLoading}
                >
                  Change Profile Photo
                </Button>
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg"
                  ref={fileRef}
                  onChange={handleFileChange}
                ></input>
              </div>
              {/* Name */}
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <div>
                <Input
                  id="displayName"
                  className={styles.input}
                  placeholder="Name"
                  disabled={user?.isTestAccount || formState.isSubmitting}
                  {...register('displayName')}
                />
                <p className={styles.errorText}>{errors?.displayName?.message}</p>
              </div>

              {/* Username */}

              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <div>
                <Input
                  id="username"
                  className={styles.input}
                  placeholder="Username"
                  disabled={user?.isTestAccount || formState.isSubmitting}
                  {...register('username')}
                />
                <p className={styles.errorText}>{errors?.username?.message}</p>
              </div>
              {/* Bio */}

              <label htmlFor="bio" className={styles.label}>
                Bio
              </label>
              <div>
                <InputTextArea
                  id="bio"
                  bordered
                  rows={6}
                  maxRows={10}
                  className={styles.textarea}
                  disabled={user?.isTestAccount || formState.isSubmitting}
                  {...register('bio')}
                />
                <p className={styles.errorText}>{errors?.bio?.message}</p>
              </div>

              <Button
                className={styles.submit}
                disabled={!formState.isValid || !formState.isDirty || formState.isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
