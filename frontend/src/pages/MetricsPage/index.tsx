import {useQuery} from "@tanstack/react-query";
import {getIPAddres, getUserAgent} from "../../api/metrics.ts";
import {PageLoader} from "../../components/basic/PageLoader.tsx";
import { Box, Container } from "@mui/material";

export function MetricsPage () {
        const {data: ip, isLoading: isIPLoading} = useQuery({
            queryKey: ["ip"],
            queryFn: getIPAddres
        });

        const {data: userAgent, isLoading: isUserAgentLoading} = useQuery({
            queryKey: ["userAgent"],
            queryFn: getUserAgent
        })

        if (isIPLoading || isUserAgentLoading) return <PageLoader />
        return (
            <Container maxWidth="xs">
              <Box className="d-flex flex-column align-items-center mt-4">
                <Box className="d-flex flex-column align-items-center card p-5">
                  <h3>Metrics</h3>
                  <Box className="mt-3">
                    <p>Your IP Address is: {ip?.data.ip}</p>
                    <p>Your User Agent is: {userAgent?.data.name} on {userAgent?.data.operatingSystem.name}</p>
                  </Box>
                </Box>
              </Box>
            </Container>
        )
}