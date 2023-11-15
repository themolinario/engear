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
import {signIn} from "../../../api/login.ts";
import {useNavigate} from "react-router-dom";
// import axios from "axios";
import { useSetAtom } from "jotai";
import { userAtom } from "../../../atoms/userAtom.ts";
import { IUser } from "../../../types/User.ts";

export function SigninForm() {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const setUser = useSetAtom(userAtom);

    const {mutate: signinMutation} = useMutation({
        mutationFn: ({name, password} : {name: string, password: string}) => signIn(name || "", password || ""),
        onSuccess: (res) => {
            // axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            sessionStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            handleRolesNavigate(res.data.user)
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

        if (username != null && password != null) {
            signinMutation({name: username, password});
        }
    };

    const handleRolesNavigate = (userData: IUser) => {
        const isRoot = userData?.roles.find((role: string) => role === "root");

        if (isRoot) {
            navigate("/general-metrics")
        } else {
            navigate("/home");
        }

    }

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
                        Sign in
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
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
    );
}