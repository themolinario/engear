import {useQuery} from "@tanstack/react-query";
import {getIPAddres, getUserAgent} from "../../api/metrics.ts";
import {PageLoader} from "../../components/basic/PageLoader.tsx";

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
            <div>
                <h1>Your IP Address is: {ip?.data.ip}</h1>
                <h1>Your User Agent is: {userAgent?.data.name}</h1>
            </div>
        )
}