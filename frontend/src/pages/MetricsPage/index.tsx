import { useQueryClient } from "@tanstack/react-query";
import { getIPAddres, getUserAgent } from "../../api/metrics.ts";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { getCurrentUser, getSpeedTest } from "../../api/user.ts";
import { formatTime, millisToMinutesAndSeconds } from "../../utils/utils.ts";
import { useEffect, useState } from "react";
import BasicTable from "./components/BasicTable.tsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAtomValue, useSetAtom } from "jotai";
import { metricsAtom } from "../../atoms/metricsAtom.ts";

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

export function MetricsPage() {
  const metrics = useAtomValue(metricsAtom);
  const setMetrics = useSetAtom(metricsAtom);
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
        streamedTime: formatTime(userResult.data?.streamedTimeTotal),
        rebufferingEvents: userResult.data?.rebufferingEvents,
        rebufferingTime: millisToMinutesAndSeconds(userResult.data?.rebufferingTime),
        speedTest: speedTestResult.data?.downloadSpeed?.toFixed(2)?.concat(" MB")
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
      return { ip, userAgent,  streamedTime, rebufferingEvents, rebufferingTime, screenSize, speedTest };
    };


  const rows = [
    createData(
      metrics.ip,
      metrics.userAgent,
      metrics.streamedTime,
      metrics.rebufferingEvents,
      metrics.rebufferingTime,
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
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }
    ],

  }

  if (loading) return <PageLoader />;

  return (
    <>
      <BasicTable header={HEADER} rows={rows}></BasicTable>
      <div style={{width: 500}}>
        <Doughnut data={metricsData} />
      </div>

    </>

    // <div>
    //   <h1>Your IP Address is: {metrics.ip}</h1>
    //   <h1>Your User Agent is: {metrics.userAgent}</h1>
    //   <h1>Total Streamed time: {metrics.currentUser}</h1>
    //   <h1>Rebuffering events: {metrics.rebufferingEvents}</h1>
    //   <h1>Rebuffering time: {metrics.rebufferingTime}</h1>
    //   <h1>Screen size: {getScreenSize()}</h1>
    //   <h1>Download rate: {metrics.speedTest}</h1>
    // </div>
  );
}