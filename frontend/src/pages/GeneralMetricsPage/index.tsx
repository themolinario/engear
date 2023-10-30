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
  const rebufferingTimes = generalMetrics?.data.map(m => m.rebufferingTime) || [];
  const rebufferingEvents = generalMetrics?.data.map(m => m.rebufferingEvents) || [];
  const streamedTime = generalMetrics?.data.map(m => m.streamedTimeTotal) || [];
  const userAgent = generalMetrics?.data.map(m => m.userAgent) || [];
  const userAgentValues : number[]= []
  userAgent.forEach(e => (userAgentValues[userAgent.indexOf(e)] = (userAgentValues[userAgent.indexOf(e)] || 0) + 1 ));
  const userAgentNames = userAgent.filter((u, idx) => userAgent.indexOf(u) === idx);

  if (isMetricsLoading) return <PageLoader />;

  const downloadRateData = {
    labels: generalMetrics?.data.map(m => m.username),
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

  const rebufferingTimesData = {
    labels: generalMetrics?.data.map(m => m.username),
    datasets: [
      {
        label: "Rebuffering Time",
        data: rebufferingTimes,
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

  const rebufferingEventsData = {
    labels: generalMetrics?.data.map(m => m.username),
    datasets: [
      {
        label: "Rebuffering Events",
        data: rebufferingEvents,
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

  const streamedTimeData = {
    labels: generalMetrics?.data.map(m => m.username),
    datasets: [
      {
        label: "Streamed time",
        data: streamedTime,
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

  const userAgentData = {
    labels: userAgentNames,
    datasets: [
      {
        label: "",
        data: userAgentValues,
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
        display: "flex"
      }}>
        <div style={{
          flex: 1
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            <h4>Speed rate</h4>
          </div>
          <Doughnut data={downloadRateData} />
        </div>
        <div style={{
          flex: 1
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            <h4>Rebuffering Time</h4>
          </div>
          <Doughnut data={rebufferingTimesData} />
        </div>

      </div>
      <div style={{
        display: "flex"
      }}>
        <div style={{
          flex: 1
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            <h4>Rebuffering Events</h4>
          </div>
          <Doughnut data={rebufferingEventsData} />
        </div>
        <div style={{
          flex: 1
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            <h4>Streamed Time</h4>
          </div>
          <Doughnut data={streamedTimeData} />
        </div>
      </div>

      <div style={{
        display: "flex"
      }}>
        <div style={{
          flex: 1
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            <h4>User Agent</h4>
          </div>
          <Doughnut data={userAgentData} />
        </div>
      </div>

    </div>
  )
}