import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Link, Stack, Alert } from '@mui/material';

function SignUp() {
  const { control, handleSubmit, watch } = useForm();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (formData) => {
    axios.post('http://localhost:5000/sign-up', formData)
      .then(({ data }) => {
        setErrorMessage('');
        login(data.token);
      })
      .catch((err) => {
        if (err.response) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
  };

  const watchPassword = watch('password', '');

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: 1, height: '100vh' }}
      backgroundColor="#EDF4F2"
    >
      <Container component="main" maxWidth="xs" style={{ backgroundColor: '#fafafa', padding: '60px 40px', borderRadius: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h2" variant="h5">
            Sign Up
          </Typography>
          <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="First name"
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : null}
                  />
                )}
                rules={{ required: 'First name is required' }}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Last name"
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : null}
                  />
                )}
                rules={{ required: 'Last name is required' }}
              />
            </Stack>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Username"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : null}
                />
              )}
              rules={{ required: 'Username is required' }}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Email"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : null}
                />
              )}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Entered value does not match email format',
                },
              }}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Password"
                  type="password"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : null}
                />
              )}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'The password is too short.',
                },
              }}
            />
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : null}
                />
              )}
              rules={{
                required: 'Confirm Password is required',
                validate: value => value === watchPassword || 'The passwords do not match'
              }}
            />
            {errorMessage && (
              <Alert severity="error" fullwidth >{errorMessage}</Alert>
            )}
            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '1rem' }}>
              Sign Up
            </Button>
            <Typography component="p" variant="body2" pt={2} style={{ textAlign: 'center' }}>
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </Typography>
          </form>
        </div>
      </Container>
    </Stack>
  );
}

export default SignUp;
