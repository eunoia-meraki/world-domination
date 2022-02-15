import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useNavigate } from 'react-location';
import { useMutation } from 'react-relay';

import type { FC, SyntheticEvent } from 'react';

import type { SignUp_signUp_Mutation } from './__generated__/SignUp_signUp_Mutation.graphql';

import { Footer } from '@/components/Footer';
import { Routes } from '@/enumerations';

export const SignUp: FC = () => {
  const navigate = useNavigate();

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
        const { id, token } = response.signUp;

        localStorage.setItem('userId', id);
        localStorage.setItem('token', token);

        navigate({ to: Routes.Lobbies });
      },
      onError: () => {
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

          <Box onSubmit={onSignUp} component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

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
