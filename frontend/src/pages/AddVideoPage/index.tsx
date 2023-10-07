
import Button from "@mui/material/Button";
import {FormEvent, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from "@mui/material/Typography";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import TextField from "@mui/material/TextField";
import {useMutation} from "@tanstack/react-query";
import {postVideo} from "../../api/videos.ts";
import {IVideo} from "../../types/Video.ts";
import {app} from "../../firebaseConfig.ts";
import {useNavigate} from "react-router-dom";




export function AddVideoPage () {
    const storage = getStorage(app);
    const [video, setVideo] = useState<File | undefined>();
    const [videoPerc, setVideoPerc] = useState(0);
    const [img, setImg] = useState<File | undefined>();
    const [imgPerc, setImgPerc] = useState(0);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [videoURL, setVideoURL] = useState("");
    const [imgURL, setImgURL] = useState("");
    const navigate = useNavigate();

    const uploadVideoMutation = useMutation({
        mutationFn: (video: Partial<IVideo>) => postVideo(video),
        onSuccess: (res) => {
            navigate(`/${res.data._id}`)
        }
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
            uploadVideoMutation.mutate({
                title: title,
                desc: desc,
                videoUrl: videoURL,
                imgUrl: imgURL
            })

    };

    useEffect(() => {
        if (video) {
            const videoRef = ref(storage,video.name + new Date().getTime());
            const videoUpload = uploadBytesResumable(videoRef, video);
            videoUpload.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                setVideoPerc(progress);
            },
                () => {},
                () => {getDownloadURL(videoUpload.snapshot.ref).then((downloadURL) => setVideoURL(downloadURL))});

        }


    }, [video]);

    useEffect(() => {
        if (img) {
            const imgRef = ref(storage, img.name + new Date().getTime());
            const imgUpload = uploadBytesResumable(imgRef, img);
            imgUpload.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                setImgPerc(progress);
            }, () => {}, () => {
                getDownloadURL(imgUpload.snapshot.ref).then((downloadURL) => setImgURL(downloadURL));
            });

        }


    }, [img]);



    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <Box
                className="d-flex flex-column align-items-center mt-5"
            >
                <Box className="card">
                    <Box className="card-body d-flex flex-column align-items-center">
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <FileUploadIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Upload A Video
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Typography >Pick Video File: </Typography>
                            <Box
                              sx={{
                                  marginTop: 2,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  padding: 2,
                                  marginBottom: 2
                              }}
                            >
                                <input
                                  type="file"
                                  accept="video/*"
                                  id="video"
                                  name="video"
                                  required
                                  onChange={(e) => {if (e.target.files) setVideo(e.target.files[0])}}
                                />
                                {videoPerc}
                            </Box>
                            <Typography >Set Preview Image: </Typography>
                            <Box
                              sx={{
                                  marginTop: 2,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  padding: 2,

                              }}
                            >

                                <input
                                  type="file"
                                  required
                                  accept="image/*"
                                  id="image"
                                  name="image"
                                  onChange={(e) => {if (e.target.files) setImg(e.target.files[0])}}
                                />
                                {imgPerc}
                            </Box>
                            <TextField
                              id="title"
                              placeholder="Inserisci titolo"
                              onChange={e => setTitle(e.target.value)}
                            />
                            <TextField
                              id="description"
                              placeholder="Inserisci descrizione"
                              onChange={e => setDesc(e.target.value)}
                            />
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                            >
                                Publish
                            </Button>
                    </Box>
                </Box>

                </Box>
            </Box>
        </Container>
    );
}