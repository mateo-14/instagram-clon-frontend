import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import Layout from 'components/Layout';
import styles from 'styles/accounts/edit.module.css';
import Input from 'components/common/Input';
import InputTextArea from 'components/common/InputTextArea';
import Button from 'components/common/Button';
import { editProfile, uploadPhoto } from 'services/usersService';
import { useMutation, useQueryClient } from 'react-query';
import { useEffect } from 'react';
import useTitle from 'hooks/useTitle';
import ProfileImage from 'components/common/ProfileImage';
import { useRef } from 'react';
import validateImageFile from 'src/utils/validateImageFile';
import useFormErrorHandling from 'hooks/useFormErrorHandling';
import sharedStyles from 'styles/accounts/shared.module.css';
import { show } from 'components/Toast';

const schema = yup
  .object({
    username: yup.string().required('Username is required').trim(),
    bio: yup.string().trim().max(150),
    displayName: yup.string().trim().max(60),
  })
  .required();

export default function Edit() {
  const { data: user } = useAuth();
  const fileRef = useRef();
  useTitle('Edit Profile - Instagram');

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

  const handleChangePhoto = (e) => {
    fileRef.current?.click();
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

  return (
    <Layout>
      <section className={styles.section}>
        <h1>Edit Profile</h1>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <ProfileImage src={user?.profileImage} className={styles.changePhotoImg}></ProfileImage>
          <div className={styles.changePhotoRight}>
            <h2 className={styles.changePhotoName}>{user?.username}</h2>
            <Button
              style="text"
              type="button"
              onClick={handleChangePhoto}
              disabled={updatePhotoMutation.isLoading}
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
              disabled={formState.isSubmitting}
              {...register('displayName')}
            />
            <p className={sharedStyles.errorText}>{errors?.displayName?.message}</p>
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
              disabled={formState.isSubmitting}
              {...register('username')}
            />
            <p className={sharedStyles.errorText}>{errors?.username?.message}</p>
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
              disabled={formState.isSubmitting}
              {...register('bio')}
            />
            <p className={sharedStyles.errorText}>{errors?.bio?.message}</p>
          </div>

          <Button
            className={styles.submit}
            disabled={!formState.isValid || !formState.isDirty || formState.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </section>
    </Layout>
  );
}
