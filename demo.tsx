"use client"

import * as React from "react"
import { PeakChart } from "@/components/ui/peak-chart"

// Datasets for the 3 Shree Ram Mobile metrics
const REPAIRED_PHONES_SERIES: Record<string, { data: number[]; labels: string[]; value: number }> = {
  Weekly: {
    data: [1.8, 2.4, 2.9, 3.5, 4.2, 4.8, 5.0],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    value: 5.0,
  },
  Monthly: {
    data: [1.2, 1.4, 1.6, 1.9, 2.2, 2.4, 2.7, 3.0, 3.3, 3.5, 3.8, 4.0, 4.3, 4.6, 4.8, 5.0],
    labels: Array.from({ length: 16 }, (_, i) => `Day ${i * 2 + 1}`),
    value: 5.0,
  },
  Yearly: {
    data: [1.2, 1.5, 1.9, 2.3, 2.8, 3.2, 3.7, 4.1, 4.4, 4.7, 4.9, 5.0],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    value: 5.0,
  },
}

const EXPERIENCE_SERIES: Record<string, { data: number[]; labels: string[]; value: number }> = {
  Weekly: {
    data: [9.2, 9.4, 9.6, 9.8, 9.9, 10.0, 10.0],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    value: 10,
  },
  Monthly: {
    data: [8.5, 8.8, 9.0, 9.1, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.8, 9.9, 9.9, 10.0, 10.0, 10.0],
    labels: Array.from({ length: 16 }, (_, i) => `Day ${i * 2 + 1}`),
    value: 10,
  },
  Yearly: {
    data: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 8.8, 9.4, 9.8, 10.0],
    labels: ["2014", "2016", "2018", "2020", "2022", "2024", "2026"],
    value: 10,
  },
}

const HAPPY_CUSTOMERS_SERIES: Record<string, { data: number[]; labels: string[]; value: number }> = {
  Weekly: {
    data: [15.2, 16.1, 16.9, 17.8, 18.6, 19.4, 20.0],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    value: 20.0,
  },
  Monthly: {
    data: [7.2, 8.5, 9.8, 11.0, 12.4, 13.6, 14.8, 15.9, 16.8, 17.6, 18.2, 18.9, 19.4, 19.7, 19.9, 20.0],
    labels: Array.from({ length: 16 }, (_, i) => `Day ${i * 2 + 1}`),
    value: 20.0,
  },
  Yearly: {
    data: [5.0, 6.5, 8.2, 9.8, 11.5, 13.0, 14.8, 16.2, 17.5, 18.6, 19.4, 20.0],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    value: 20.0,
  },
}

function measureWidth() {
  if (typeof window === "undefined") return 360
  const vw = window.innerWidth
  if (vw >= 1200) return Math.min(380, Math.floor((vw - 120) / 3))
  if (vw >= 768) return Math.min(360, Math.floor((vw - 80) / 2))
  return Math.min(340, vw - 40)
}

function useResponsiveWidth() {
  const [width, setWidth] = React.useState(measureWidth)
  React.useEffect(() => {
    const handleResize = () => setWidth(measureWidth())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return width
}

export default function PeakChartDemo() {
  const cardWidth = useResponsiveWidth()
  const [period1, setPeriod1] = React.useState("Monthly")
  const [period2, setPeriod2] = React.useState("Monthly")
  const [period3, setPeriod3] = React.useState("Monthly")

  const p1 = REPAIRED_PHONES_SERIES[period1]
  const p2 = EXPERIENCE_SERIES[period2]
  const p3 = HAPPY_CUSTOMERS_SERIES[period3]

  return (
    <main className="relative min-h-screen w-full bg-[#08101a] py-16 px-4 flex flex-col items-center justify-center">
      <div className="text-center max-w-xl mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
          SHREE RAM MOBILE // LAB ANALYTICS
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
          Hardware & Growth Telemetry
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-7 max-w-7xl w-full">
        {/* Card 1: Repair phone - 5k+ */}
        <PeakChart
          width={cardWidth}
          title="Repair phone"
          value={p1.value}
          valueSuffix="k+"
          decimals={0}
          caption="Over 5,000 devices successfully revived"
          updatedText="Daily Dispatch"
          accent="#2e85ff"
          period={period1}
          onPeriodChange={setPeriod1}
          data={p1.data}
          labels={p1.labels}
          formatValue={(v) => `${v.toFixed(1)}k+`}
        />

        {/* Card 2: Year of experience - 10+ */}
        <PeakChart
          width={cardWidth}
          title="Year of experience"
          value={p2.value}
          valueSuffix="+"
          decimals={0}
          caption="Master hardware engineering lab since 2014"
          updatedText="Certified Lab"
          accent="#f59e0b"
          period={period2}
          onPeriodChange={setPeriod2}
          data={p2.data}
          labels={p2.labels}
          formatValue={(v) => `${Math.round(v)}+`}
        />

        {/* Card 3: Happy customer - 20k+ */}
        <PeakChart
          width={cardWidth}
          title="Happy customer"
          value={p3.value}
          valueSuffix="k+"
          decimals={0}
          caption="99.8% 5-star verified customer satisfaction"
          updatedText="5-Star Rated"
          accent="#2ec99a"
          period={period3}
          onPeriodChange={setPeriod3}
          data={p3.data}
          labels={p3.labels}
          formatValue={(v) => `${v.toFixed(1)}k+`}
        />
      </div>
    </main>
  )
}
