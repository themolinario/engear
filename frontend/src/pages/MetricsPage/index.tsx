import { getIPAddres, getUserAgent, postMetrics } from "../../api/metrics.ts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { formatTime, millisToMinutesAndSeconds } from "../../utils/utils.ts";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAtomValue } from "jotai";
import { metricUserAtom } from "../../atoms/metricsAtom.ts";
import { getCurrentUser, getSpeedTest } from "../../api/user.ts";
import BasicTable from "./components/BasicTable.tsx";
import { useState } from "react";

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
  const [metricsLoad, setMetricsLoad] = useState(false);

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
  })

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
        return formatTime(metricsUser.streamedTimeTotal ? metricsUser.streamedTimeTotal : dataUser?.data?.streamedTimeTotal);
      case "REBUFFERING_EVENTS":
        return metricsUser.rebufferingEvents != "N.N." ? metricsUser.rebufferingEvents : dataUser?.data?.rebufferingEvents;
      case "REBUFFERING_TIME":
        return millisToMinutesAndSeconds(metricsUser.rebufferingTime ? metricsUser.rebufferingTime : dataUser?.data?.rebufferingTime);
    }
  };

  const rows = [
    [
      { value: dataIp?.data.ip },
      { value: dataUserAgent?.data.name },
      { value: getValue("STREAMED_TIME_TOTAL"), tooltipTitle: "HH:MM:SS" },
      { value: getValue("REBUFFERING_EVENTS") },
      { value: getValue("REBUFFERING_TIME"), tooltipTitle: "MM:SS" },
      { value: getScreenSize() },
      { value: dataSpeedTest?.data?.downloadSpeed.toFixed(2)?.concat(" MB") }]
  ];

  const metricsData = {
    labels: ["Download Rate"],
    datasets: [
      {
        label: "Download rate",
        data: [dataSpeedTest?.data?.downloadSpeed],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]

  };

  if (isIpLoading || isUserAgentLoading || isSpeedTestLoading || isUserLoading) return <PageLoader />;
  if (!(isIpLoading || isUserAgentLoading || isSpeedTestLoading || isUserLoading) && !metricsLoad) {
    postMetricsMutation.mutate(metricsUser);
    setMetricsLoad(true);
  }

  return (
    <>
      <BasicTable header={METRIC_HEADER} rows={rows}></BasicTable>

      <div style={{ width: 500 }}>
        <Doughnut data={metricsData} />
      </div>

    </>

  );
}