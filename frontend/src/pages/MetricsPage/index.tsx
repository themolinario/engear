import { useQueryClient } from "@tanstack/react-query";
import { getIPAddres, getUserAgent } from "../../api/metrics.ts";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { getCurrentUser, getSpeedTest } from "../../api/user.ts";
import { formatTime, millisToMinutesAndSeconds } from "../../utils/utils.ts";
import { useEffect, useState } from "react";
import BasicTable from "./components/BasicTable.tsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAtomValue } from "jotai";
import { metricUserAtom } from "../../atoms/metricsAtom.ts";
import { IMetric } from "../../types/Metrics.ts";

ChartJS.register(ArcElement, Tooltip, Legend);

const HEADER = [
  "IP",
  "User agent",
  "Streamed time",
  "Rebuffering events",
  "Rebuffering time",
  "Screen size",
  "Speed test"
];

const INIT_METRICS: IMetric = {
  ip: "N.N.",
  userAgent: "N.N.",
  speedTest: "N.N.",
  streamedTime: 0,
  rebufferingEvents: "N.N.",
  rebufferingTime: 0
};

export function MetricsPage() {
  const metricsUser = useAtomValue(metricUserAtom);
  const [metrics, setMetrics] = useState(INIT_METRICS);
  const [loading, setLoading] = useState(true);

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
        speedTest: speedTestResult.data?.downloadSpeed?.toFixed(2)?.concat(" MB"),
        streamedTime: userResult.data?.streamedTimeTotal,
        rebufferingEvents: userResult.data?.rebufferingEvents,
        rebufferingTime: userResult.data?.rebufferingTime
      });


    };

    fetchData().then(() => setLoading(false));


  }, [queryClient]);

  const getScreenSize = () => {
    const width = window.screen.width.toString();
    const height = window.screen.height.toString();
    return width.concat("x").concat(height);
  };

  const
    createData = (
      ip: string,
      userAgent: string,
      streamedTime: string,
      rebufferingEvents: string,
      rebufferingTime: string,
      screenSize: string,
      speedTest: string
    ) => {
      return { ip, userAgent, streamedTime, rebufferingEvents, rebufferingTime, screenSize, speedTest };
    };


  const rows = [
    createData(
      metrics.ip,
      metrics.userAgent,
      formatTime(metricsUser.streamedTime ? metricsUser.streamedTime : metrics.streamedTime),
      metricsUser.rebufferingEvents != "N.N." ? metricsUser.rebufferingEvents : metrics.rebufferingEvents,
      millisToMinutesAndSeconds(metricsUser.rebufferingTime ? metricsUser.rebufferingTime : metrics.rebufferingTime),
      getScreenSize(),
      metrics.speedTest
    )
  ];

  const metricsData = {
    labels: ["Download Rate"],
    datasets: [
      {
        label: "Download rate",
        data: [metrics.speedTest && Number(metrics.speedTest.substring(0, metrics.speedTest.length - 3))],
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

  if (loading) return <PageLoader />;

  return (
    <>
      <BasicTable header={HEADER} rows={rows}></BasicTable>
      <div style={{ width: 500 }}>
        <Doughnut data={metricsData} />
      </div>

    </>

  );
}