import { useQuery } from "@tanstack/react-query";
import { getAllMetrics } from "../../api/metrics.ts";
import { PageLoader } from "../../components/basic/PageLoader.tsx";
import { Doughnut } from "react-chartjs-2";

export function GeneralMetricsPage () {
  const {data: generalMetrics, isLoading: isMetricsLoading} = useQuery({
    queryKey: ["general"],
    queryFn: getAllMetrics
  });

  const downloadRate = generalMetrics?.data.map(g => Number(g.speedTest.substring(0, g.speedTest.length - 2))) || [];

  if (isMetricsLoading) return <PageLoader />;

  const downloadRateData = {
    labels: ["Download Rate"],
    datasets: [
      {
        label: "Download rate",
        data: downloadRate,
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

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1>Metriche Generali</h1>
      <div style={{
        width: 500
      }}>
        <Doughnut data={downloadRateData} />
      </div>
    </div>
  )
}