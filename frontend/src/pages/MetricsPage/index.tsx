import { useQueryClient } from "@tanstack/react-query";
import { getIPAddres, getUserAgent } from "../../api/metrics.ts";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { getCurrentUser, getSpeedTest } from "../../api/user.ts";
import { formatTime, millisToMinutesAndSeconds } from "../../utils/utils.ts";
import { useEffect, useState } from "react";

export function MetricsPage() {
  const [metrics, setMetrics] = useState({
    ip: "",
    userAgent: "",
    currentUser: "",
    rebufferingEvents: "",
    rebufferingTime: "",
    speedTest: ""
  });

  const queryClient = useQueryClient();

  useEffect(() => {

    const fetchData = async () => {
      const [ipResult, userAgentResult, userResult, speedTestResult] = await Promise.all([
        queryClient.fetchQuery(["ip"], getIPAddres),
        queryClient.fetchQuery(["userAgent"], getUserAgent),
        queryClient.fetchQuery(["user"], getCurrentUser),
        queryClient.fetchQuery(["speedTest"], getSpeedTest)
      ]);

      setMetrics({
        ip: ipResult.data.ip ?? "N.D.",
        userAgent: userAgentResult.data.name ?? "N.D",
        currentUser: formatTime(userResult.data?.streamedTimeTotal),
        rebufferingEvents: userResult.data?.rebufferingEvents,
        rebufferingTime: millisToMinutesAndSeconds(userResult.data?.rebufferingTime),
        speedTest: speedTestResult.data?.downloadSpeed

      });

    };

    fetchData();


  }, [queryClient]);

  const getScreenSize = () => {
    const width = window.screen.width.toString();
    const height = window.screen.height.toString();
    return width.concat("x").concat(height);
  };


  if (queryClient.isFetching()) return <PageLoader />;
  return (
    <div>
      <h1>Your IP Address is: {metrics.ip}</h1>
      <h1>Your User Agent is: {metrics.userAgent}</h1>
      <h1>Total Streamed time: {metrics.currentUser}</h1>
      <h1>Rebuffering events: {metrics.rebufferingEvents}</h1>
      <h1>Rebuffering time: {metrics.rebufferingTime}</h1>
      <h1>Screen size: {getScreenSize()}</h1>
      <h1>Download rate: {metrics.speedTest}</h1>
    </div>
  );
}