import {useQuery} from "@tanstack/react-query";
import {getIPAddres} from "../../api/metrics.ts";
import {PageLoader} from "../../components/basic/PageLoader.tsx";

export function MetricsPage () {
        const {data: ip, isLoading: isIPLoading} = useQuery({
            queryKey: ["ip"],
            queryFn: getIPAddres
        });

        if (isIPLoading) return <PageLoader />
        return (
            <div>
                <h1>Your IP Address is: {ip?.data.ip}</h1>
            </div>
        )
}