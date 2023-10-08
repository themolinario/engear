import { useQuery } from "@tanstack/react-query";
import { getIPAddres, getUserAgent } from "../../api/metrics.ts";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { getCurrentUser } from "../../api/user.ts";
import { formatTime } from "../../utils/utils.ts";

export function MetricsPage() {
  const { data: ip, isLoading: isIPLoading } = useQuery({
    queryKey: ["ip"],
    queryFn: getIPAddres
  });

  const { data: userAgent, isLoading: isUserAgentLoading } = useQuery({
    queryKey: ["userAgent"],
    queryFn: getUserAgent
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser
  });

  if (isIPLoading || isUserAgentLoading || isLoadingUser) return <PageLoader />;
  return (
    <div>
      <h1>Your IP Address is: {ip?.data.ip}</h1>
      <h1>Your User Agent is: {userAgent?.data.name}</h1>
      <h1>Total Streamed time: {formatTime(user?.data?.streamedTimeTotal)}</h1>
    </div>
  );
}