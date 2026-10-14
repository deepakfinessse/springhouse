"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  primary: "#0066CC",
  secondary: "#FF6B35",
  tertiary: "#4ECDC4",
  accent1: "#FFE66D",
  accent2: "#A8D8EA",
  accent3: "#FF99AC",
  accent4: "#C7CEEA",
};

const chartColors = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.tertiary,
  COLORS.accent1,
  COLORS.accent2,
  COLORS.accent3,
  COLORS.accent4,
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    cities: 0,
    areas: 0,
    enquiries: 0,
  });

  const [citiesData, setCitiesData] = useState([]);
  const [enquiriesData, setEnquiriesData] = useState({
    read: 0,
    unread: 0,
  });
  const [solutionsData, setSolutionsData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const statsRes = await fetch("/api/admin/dashboard/stats");
        const statsJson = await statsRes.json();
        
        if (statsJson.success) {
          const { properties, cities, areas, enquiries, charts } = statsJson.data;
          
          setStats({ properties, cities, areas, enquiries });
          
          if (charts) {
            setCitiesData(charts.citiesData || []);
            setEnquiriesData(charts.enquiriesData || { read: 0, unread: 0 });
            setSolutionsData(charts.solutionsData || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const cards = [
    { title: "Total Properties", value: stats.properties },
    { title: "Active Cities", value: stats.cities },
    { title: "Active Areas", value: stats.areas },
    { title: "New Enquiries", value: stats.enquiries },
  ];

  const enquiriesChartData = [
    { name: "Read", value: enquiriesData.read },
    { name: "Unread", value: enquiriesData.unread },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-gray-900 px-4 py-2 shadow-lg border border-brand-primary">
          <p className="text-sm font-semibold text-brand-primary">
            {payload[0].name}
          </p>
          <p className="text-lg font-bold text-white">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{`
        .recharts-surface {
          outline: none !important;
          border: none !important;
        }
        .recharts-surface:focus {
          outline: none !important;
          border: none !important;
        }
        svg {
          outline: none !important;
          border: none !important;
        }
        svg:focus {
          outline: none !important;
          border: none !important;
        }
        .recharts-pie-sector {
          outline: none !important;
          border: none !important;
        }
        .chart-container {
          outline: none !important;
        }
        .chart-container:focus {
          outline: none !important;
        }
        .chart-container *:focus {
          outline: none !important;
        }
      `}</style>
      <div className="space-y-8 max-w-[1440px] mx-auto w-full">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-brand-primary/20 outline-none focus:outline-none"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                {card.title}
              </h3>
              <p className="mt-2 font-heading text-4xl text-brand-primary">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  card.value
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Properties by Cities */}
          <div className="chart-container rounded-xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md outline-none focus:outline-none">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Properties by Cities
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Distribution across locations
              </p>
            </div>

            {loading || citiesData.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-gray-400">
                  {loading ? "Loading..." : "No data available"}
                </p>
              </div>
            ) : (
              <div className="outline-none focus:outline-none">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={citiesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      stroke="none"
                    >
                      {citiesData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {citiesData.length > 0 && (
              <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                {citiesData.map((city, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {city.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {city.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enquiries Status */}
          <div className="chart-container rounded-xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md outline-none focus:outline-none">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Enquiry Status
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Read vs Unread enquiries
              </p>
            </div>

            {loading ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            ) : (
              <div className="outline-none focus:outline-none">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={enquiriesChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      stroke="none"
                    >
                      <Cell fill={COLORS.primary} stroke="none" />
                      <Cell fill={COLORS.secondary} stroke="none" />
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {enquiriesChartData.length > 0 && (
              <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS.primary }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Read
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {enquiriesData.read}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS.secondary }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Unread
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {enquiriesData.unread}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Properties by Solutions */}
          <div className="chart-container rounded-xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md outline-none focus:outline-none">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Properties by Solutions
              </h2>
              <p className="mt-1 text-sm text-gray-500">By service type</p>
            </div>

            {loading || !solutionsData || solutionsData.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-gray-400">
                  {loading ? "Loading..." : "No data available"}
                </p>
              </div>
            ) : (
              <div className="outline-none focus:outline-none">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={solutionsData.filter((item) => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      stroke="none"
                    >
                      {solutionsData
                        .filter((item) => item.value > 0)
                        .map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                            stroke="none"
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {solutionsData && solutionsData.length > 0 && (
              <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 max-h-40 overflow-y-auto">
                {solutionsData.map((solution, index) => (
                  <div
                    key={solution.id || index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {solution.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">
                      {solution.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
