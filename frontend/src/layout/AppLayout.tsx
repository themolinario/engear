import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import NavBar from "./components/NavBar.tsx";

function AppLayout() {

  return (
          <Container>
              <Box style={{margin: 36}}>
                  <NavBar />
              </Box>

              <Outlet />
          </Container>
  )
}

export default AppLayout;

