import React, { useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Link,
  Stack,
  Alert,
} from "@mui/material";

function SignIn() {
  const { control, handleSubmit } = useForm();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = (formData) => {
    axios
      .post("/user/sign-in", formData)
      .then(({ data }) => {
        setErrorMessage("");
        login(data.token);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: 1, height: "100vh" }}
      backgroundColor="#EDF4F2"
    >
      <Container
        component="main"
        maxWidth="xs"
        style={{
          backgroundColor: "#fafafa",
          padding: "60px 40px",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h2" variant="h5">
            Sign In
          </Typography>
          <form
            style={{ width: "100%", marginTop: "1rem" }}
            onSubmit={handleSubmit(onSubmit)}
          >
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
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                />
              )}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Entered value does not match email format",
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
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                />
              )}
              rules={{
                required: "Password is required",
              }}
            />
            {errorMessage && (
              <Alert severity="error" fullwidth="true">
                {errorMessage}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem", background: "#31473A" }}
            >
              Sign In
            </Button>
            <Typography
              component="p"
              variant="body2"
              pt={2}
              style={{ textAlign: "center" }}
            >
              Don't have an account? <Link href="/sign-up">Sign up</Link>
            </Typography>
          </form>
        </div>
      </Container>
    </Stack>
  );
}

export default SignIn;
