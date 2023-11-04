import Button from "@mui/material/Button";
import { FormEvent, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Typography from "@mui/material/Typography";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import TextField from "@mui/material/TextField";
import { useMutation } from "@tanstack/react-query";
import { postVideo } from "../../api/videos.ts";
import { IVideo } from "../../types/Video.ts";
import { app } from "../../firebaseConfig.ts";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AlertMessage } from "../../components/basic/AlertMessage.tsx";


export function AddVideoPage() {
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
  const [error, setError] = useState({ isActive: false, message: "" });

  const uploadVideoMutation = useMutation({
    mutationFn: (video: Partial<IVideo>) => postVideo(video),
    onSuccess: (res) => {
      navigate(`/${res.data._id}`);
    },
    onError: (error) => {
      setError({ isActive: true, message: "Error to publish video" });
      console.log("error", error);

    }
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    uploadVideoMutation.mutate({
      title: title,
      desc: desc,
      videoUrl: videoURL,
      imgUrl: imgURL
    });
  };

  useEffect(() => {
    if (video) {
      const videoRef = ref(storage, video.name);
      const videoUpload = uploadBytesResumable(videoRef, video);
      videoUpload.on("state_changed", (snapshot) => {
          const progress = Number(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2));
          setVideoPerc(progress);
        },
        () => {
        },
        () => {
          getDownloadURL(videoUpload.snapshot.ref).then((downloadURL) => {
            setVideoURL(downloadURL)
          });
        });

    }


  }, [video]);

  useEffect(() => {
    if (img) {
      const imgRef = ref(storage, img.name + new Date().getTime());
      const imgUpload = uploadBytesResumable(imgRef, img);
      imgUpload.on("state_changed", (snapshot) => {
        const progress = Number(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2));
        setImgPerc(progress);
      }, () => {
      }, () => {
        getDownloadURL(imgUpload.snapshot.ref).then((downloadURL) => {
          downloadURL.replace("https://firebasestorage.googleapis.com","https://ik.imagekit.io/mmolinari");
          setImgURL(downloadURL);
        });
      });

    }


  }, [img]);


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <FileUploadIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Upload A Video
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography>Pick Video File: </Typography>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderColor: "blue",
              padding: 4,
              border: 1,
              borderRadius: 2,
              marginBottom: 2,
              gap: "15px",
              textAlign: "center",

            }}
          >
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload Video {videoPerc}
              <VisuallyHiddenInput
                type="file"
                accept="video/*"
                id="video"
                name="video"
                required
                hidden
                onChange={(e) => {
                  if (e.target.files) setVideo(e.target.files[0]);
                }}
              />
              <LinearProgress variant="determinate" value={videoPerc} />
            </Button>

            {video?.name}

          </Box>
          <Typography>Set Preview Image: </Typography>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderColor: "blue",
              padding: 4,
              border: 1,
              borderRadius: 2,
              marginBottom: 2,
              gap: "15px",
              textAlign: "center",
            }}
          >
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload Image {imgPerc}

              <VisuallyHiddenInput
                type="file"
                required
                accept="image/*"
                id="image"
                name="image"
                onChange={(e) => {
                  // console.log(e.target.files[0])
                  if (e.target.files) setImg(e.target.files[0]);
                }}
              />
              {/*<LinearProgress variant="determinate" value={imgPerc} />*/}

            </Button>

            {img?.name}

          </Box>
          <TextField
            id="title"
            placeholder="Insert title"
            fullWidth
            margin="normal"
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            id="description"
            placeholder="Insert description"
            multiline
            maxRows={4}
            fullWidth
            margin="normal"
            onChange={e => setDesc(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            Publish
          </Button>
        </Box>
      </Box>

      <AlertMessage error={error} setError={setError}></AlertMessage>
    </Container>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});