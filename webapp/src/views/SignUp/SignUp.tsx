import { LockOutlined } from '@mui/icons-material';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useNavigate } from 'react-location';
import { useMutation } from 'react-relay';

import type { FC, SyntheticEvent } from 'react';
import { useState } from 'react';

import type { SignUp_signUp_Mutation } from './__generated__/SignUp_signUp_Mutation.graphql';

import { Footer } from '@/components/Footer';
import { Routes } from '@/enumerations';

export const SignUp: FC = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [signUp] = useMutation<SignUp_signUp_Mutation>(
    graphql`
      mutation SignUp_signUp_Mutation($login: String!, $password: String!) {
        signUp(login: $login, password: $password) {
          id
          token
        }
      }
    `,
  );

  const onSignUp = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    signUp({
      variables: {
        login: data.get('login') as string,
        password: data.get('password') as string,
      },
      onCompleted: response => {
        setErrorMessage('');

        const { id, token } = response.signUp;

        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('token', token);

        navigate({ to: Routes.Lobby });
      },
      onError: err => {
        setErrorMessage(err.message);
      },
    });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>

          <Typography variant="h5">Sign up</Typography>

          <Box onSubmit={onSignUp} component="form" noValidate sx={{ mt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Login"
              name="login"
              autoComplete="login"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={Routes.SignIn} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  );
};
