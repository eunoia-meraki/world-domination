import { LockOutlined } from '@mui/icons-material';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';

import type { FC } from 'react';

import { Footer } from '@/components/Footer';
import graphql from 'babel-plugin-relay/macro';
import { Routes } from '@/enumerations';
import { useNavigate } from 'react-location';
import { useMutation } from 'react-relay';
import type { SignIn_signInMutation } from './__generated__/SignIn_signInMutation.graphql';

export const SignIn: FC = () => {
  const navigate = useNavigate();

  const [signIn] = useMutation<SignIn_signInMutation>(
    graphql`
      mutation SignIn_signInMutation($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          id
          token
        }
      }
    `,
  );

  const onSignIn = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signIn({
      variables: {
        login: data.get('login') as string,
        password: data.get('password') as string,
      },
      onCompleted: response => {
        const { id, token } = response.signIn;

        localStorage.setItem('userId', id);
        localStorage.setItem('token', token);

        navigate({ to: Routes.Games });
      },
      onError: error => {
        // TODO
        console.log('error', error);
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

        <Typography variant="h5">Sign in</Typography>

        <Box onSubmit={onSignIn} component="form" noValidate sx={{ mt: 1 }}>
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
            autoComplete="current-password"
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item>
              <Link href={Routes.SignUp} variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>

    <Footer />
  </>
);
