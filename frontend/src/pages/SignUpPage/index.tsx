import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {FormEvent, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {signUp} from "../../api/login.ts";
import {useNavigate} from "react-router-dom";

export function SignUpPage() {
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const {mutate: signUpMutation} = useMutation({
        mutationFn: ({name, password, email} : {name: string, password: string, email: string}) =>
            signUp(name || "", email || "", password || ""),
        onSuccess: () => {
            navigate("/login");
        },
        onError: () => {
            setError(true);
        }
    })
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username')?.toString();
        const password = data.get('password')?.toString();
        const email = data.get('email')?.toString();


        if (username && password && email) {
            signUpMutation({name: username, password: password, email: email});
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        color={error ? "error" : undefined}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        color={error ? "error" : undefined}
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
                        color={error ? "error" : undefined}

                    />
                    {error && <Typography style={{color: "red"}}>Wrong Credentials</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}