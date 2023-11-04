import { getIPAddres, getUserAgent, postMetrics } from "../../api/metrics.ts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAtomValue } from "jotai";
import { metricUserAtom } from "../../atoms/metricsAtom.ts";
import { getCurrentUser, getSpeedTest } from "../../api/user.ts";
import BasicTable from "./components/BasicTable.tsx";
import Button from "@mui/material/Button";
import { useState } from "react";
import { formatTime, millisToMinutesAndSeconds } from "../../utils/utils.ts";

ChartJS.register(ArcElement, Tooltip, Legend);

const METRIC_HEADER = [
  "IP",
  "User agent",
  "Streamed time",
  "Rebuffering events",
  "Rebuffering time",
  "Screen size",
  "Speed test"
];

export function MetricsPage() {
  const metricsUser = useAtomValue(metricUserAtom);
  const [sentMetrics, setSentMetrics] = useState(false);

  const queryOptions = { refetchOnWindowFocus: false };
  const queryMultiple = () => {
    const ipResult = useQuery(["ip"], getIPAddres, queryOptions);
    const userAgentResult = useQuery(["userAgent"], getUserAgent, queryOptions);
    const userResult = useQuery(["user"], getCurrentUser, queryOptions);
    const speedTestResult = useQuery(["speedTest"], getSpeedTest, queryOptions);

    return [ipResult, userAgentResult, userResult, speedTestResult];
  };

  const postMetricsMutation = useMutation({
    mutationFn: postMetrics
  });

  const [
    { isLoading: isIpLoading, data: dataIp },
    { isLoading: isUserAgentLoading, data: dataUserAgent },
    { isLoading: isUserLoading, data: dataUser },
    { isLoading: isSpeedTestLoading, data: dataSpeedTest }
  ] = queryMultiple();


  const getScreenSize = () => {
    const width = window.screen.width.toString();
    const height = window.screen.height.toString();
    return width.concat("x").concat(height);
  };

  const getValue = (value: string) => {
    switch (value) {
      case "STREAMED_TIME_TOTAL":
        return metricsUser.streamedTimeTotal ? metricsUser.streamedTimeTotal : dataUser?.data?.streamedTimeTotal;
      case "REBUFFERING_EVENTS":
        return metricsUser.rebufferingEvents != "N.N." ? metricsUser.rebufferingEvents : dataUser?.data?.rebufferingEvents;
      case "REBUFFERING_TIME":
        return metricsUser.rebufferingTime ? metricsUser.rebufferingTime : dataUser?.data?.rebufferingTime;
    }
  };

  const rows = [
    [
      { value: dataIp?.data.ip },
      { value: dataUserAgent?.data.name },
      { value: formatTime(getValue("STREAMED_TIME_TOTAL")), tooltipTitle: "HH:MM:SS" },
      { value: getValue("REBUFFERING_EVENTS") },
      { value: millisToMinutesAndSeconds(getValue("REBUFFERING_TIME")), tooltipTitle: "MM:SS" },
      { value: getScreenSize() },
      { value: dataSpeedTest?.data?.downloadSpeed.toFixed(2)?.concat(" MB") }]
  ];

  if (isIpLoading || isUserAgentLoading || isSpeedTestLoading || isUserLoading) return <PageLoader />;

  const handleSubmitMetrics = () => {
    postMetricsMutation.mutate({
      rebufferingEvents: getValue("REBUFFERING_EVENTS"),
      rebufferingTime: getValue("REBUFFERING_TIME"),
      streamedTimeTotal: getValue("STREAMED_TIME_TOTAL"),
      userAgent: (dataUserAgent?.data.name || "") as string,
      speedTest: (dataSpeedTest?.data?.downloadSpeed.toFixed(2)?.concat(" MB") || "") as string,
      username: dataUser?.data.name
    });
    setSentMetrics(true);
  };

  return (
    <>
      <BasicTable header={METRIC_HEADER} rows={rows}></BasicTable>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16 }}>
        {sentMetrics && <p>Metriche inviate!</p>}
        <Button variant="contained" onClick={() => handleSubmitMetrics()}>
          Inoltra metriche
        </Button>
      </div>
    </>

  );
}