"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [dateRange, setDateRange] = React.useState("30");
  const [selectedMetrics, setSelectedMetrics] = React.useState([
    "sales",
    "leads",
    "conversion",
  ]);
  const [widgets, setWidgets] = React.useState([
    {
      id: "sales-overview",
      type: "chart",
      title: "Sales Overview",
      position: 1,
      visible: true,
    },
    {
      id: "lead-conversion",
      type: "chart",
      title: "Lead Conversion",
      position: 2,
      visible: true,
    },
    {
      id: "revenue-trend",
      type: "chart",
      title: "Revenue Trend",
      position: 3,
      visible: true,
    },
    {
      id: "top-performers",
      type: "table",
      title: "Top Performers",
      position: 4,
      visible: true,
    },
  ]);
  const [filters, setFilters] = React.useState({
    salesRep: "all",
    region: "all",
    product: "all",
  });
  const [isExporting, setIsExporting] = React.useState(false);

  const mockData = {
    salesOverview: {
      totalRevenue: 245600,
      totalDeals: 156,
      avgDealSize: 1574,
      growthRate: 12.5,
    },
    leadMetrics: {
      totalLeads: 1247,
      qualifiedLeads: 456,
      conversionRate: 36.6,
      avgResponseTime: 2.4,
    },
    chartData: {
      salesTrend: [
        { month: "Jan", revenue: 45000, deals: 23 },
        { month: "Feb", revenue: 52000, deals: 28 },
        { month: "Mar", revenue: 48000, deals: 25 },
        { month: "Apr", revenue: 61000, deals: 32 },
        { month: "May", revenue: 58000, deals: 29 },
        { month: "Jun", revenue: 67000, deals: 35 },
      ],
      conversionFunnel: [
        { stage: "Leads", count: 1247, percentage: 100 },
        { stage: "Qualified", count: 456, percentage: 36.6 },
        { stage: "Proposal", count: 234, percentage: 18.8 },
        { stage: "Negotiation", count: 123, percentage: 9.9 },
        { stage: "Closed Won", count: 89, percentage: 7.1 },
      ],
    },
  };

  const handleExport = React.useCallback(async (format) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const filename = `analytics-report-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      console.log(`Exporting report as ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const toggleWidget = React.useCallback((widgetId) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  }, []);

  const renderKPICard = (title, value, change, icon, color) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <i
              className={`fas fa-arrow-${change >= 0 ? "up" : "down"} text-${
                change >= 0 ? "green" : "red"
              }-500 text-sm mr-1`}
            ></i>
            <span
              className={`text-sm font-medium text-${
                change >= 0 ? "green" : "red"
              }-600`}
            >
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div
          className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}
        >
          <i className={`${icon} text-${color}-600 text-xl`}></i>
        </div>
      </div>
    </div>
  );

  const renderChart = (type, title, data) => {
    if (type === "bar") {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {data.map((item, index) => {
              const maxValue = Math.max(...data.map((d) => d.revenue));
              const height = (item.revenue / maxValue) * 200;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}px` }}
                    title={`${item.month}: $${item.revenue.toLocaleString()}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "funnel") {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.stage}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <i className="fas fa-chart-line text-4xl mb-2"></i>
          <p>Chart visualization</p>
        </div>
      </div>
    );
  };

  const renderTopPerformers = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top Performers
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-600">
                Sales Rep
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Revenue
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Deals
              </th>
              <th className="text-left py-2 font-medium text-gray-600">
                Conversion
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Sarah Johnson",
                revenue: 45600,
                deals: 23,
                conversion: 42.1,
              },
              {
                name: "Mike Chen",
                revenue: 38900,
                deals: 19,
                conversion: 38.5,
              },
              {
                name: "Emily Davis",
                revenue: 34200,
                deals: 17,
                conversion: 35.8,
              },
              {
                name: "David Wilson",
                revenue: 29800,
                deals: 15,
                conversion: 33.2,
              },
            ].map((performer, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 font-medium text-gray-800">
                  {performer.name}
                </td>
                <td className="py-3 text-gray-600">
                  ${performer.revenue.toLocaleString()}
                </td>
                <td className="py-3 text-gray-600">{performer.deals}</td>
                <td className="py-3 text-gray-600">{performer.conversion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderKPICard(
          "Total Revenue",
          `$${mockData.salesOverview.totalRevenue.toLocaleString()}`,
          12.5,
          "fas fa-dollar-sign",
          "green"
        )}
        {renderKPICard(
          "Total Deals",
          mockData.salesOverview.totalDeals,
          8.3,
          "fas fa-handshake",
          "blue"
        )}
        {renderKPICard(
          "Avg Deal Size",
          `$${mockData.salesOverview.avgDealSize.toLocaleString()}`,
          5.2,
          "fas fa-chart-line",
          "purple"
        )}
        {renderKPICard(
          "Conversion Rate",
          `${mockData.leadMetrics.conversionRate}%`,
          -2.1,
          "fas fa-percentage",
          "orange"
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.find((w) => w.id === "sales-overview" && w.visible) &&
          renderChart("bar", "Sales Trend", mockData.chartData.salesTrend)}
        {widgets.find((w) => w.id === "lead-conversion" && w.visible) &&
          renderChart(
            "funnel",
            "Lead Conversion Funnel",
            mockData.chartData.conversionFunnel
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.find((w) => w.id === "revenue-trend" && w.visible) &&
          renderChart("line", "Revenue Trend", mockData.chartData.salesTrend)}
        {widgets.find((w) => w.id === "top-performers" && w.visible) &&
          renderTopPerformers()}
      </div>
    </div>
  );

  const renderSalesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderKPICard(
          "Monthly Revenue",
          "$67,400",
          15.2,
          "fas fa-chart-line",
          "green"
        )}
        {renderKPICard("Deals Closed", "35", 12.8, "fas fa-handshake", "blue")}
        {renderKPICard(
          "Pipeline Value",
          "$234,500",
          8.7,
          "fas fa-funnel-dollar",
          "purple"
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart(
          "bar",
          "Monthly Sales Performance",
          mockData.chartData.salesTrend
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Region
          </h3>
          <div className="space-y-4">
            {[
              { region: "North America", value: 45, amount: 112500 },
              { region: "Europe", value: 30, amount: 75000 },
              { region: "Asia Pacific", value: 20, amount: 50000 },
              { region: "Latin America", value: 5, amount: 12500 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.region}
                  </span>
                  <span className="text-sm text-gray-600">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeadsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {renderKPICard("Total Leads", "1,247", 18.5, "fas fa-users", "blue")}
        {renderKPICard(
          "Qualified Leads",
          "456",
          22.3,
          "fas fa-user-check",
          "green"
        )}
        {renderKPICard(
          "Conversion Rate",
          "36.6%",
          -3.2,
          "fas fa-percentage",
          "purple"
        )}
        {renderKPICard(
          "Avg Response Time",
          "2.4h",
          -15.6,
          "fas fa-clock",
          "orange"
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart(
          "funnel",
          "Lead Conversion Funnel",
          mockData.chartData.conversionFunnel
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Lead Sources
          </h3>
          <div className="space-y-3">
            {[
              { source: "Website", count: 456, percentage: 36.6 },
              { source: "Social Media", count: 312, percentage: 25.0 },
              { source: "Email Campaign", count: 234, percentage: 18.8 },
              { source: "Referrals", count: 156, percentage: 12.5 },
              { source: "Cold Outreach", count: 89, percentage: 7.1 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.source}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <i className="fas fa-clock"></i>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>

              <div className="relative">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <i className="fas fa-download"></i>
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 hidden group-hover:block">
                  <button
                    onClick={() => handleExport("pdf")}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="fas fa-file-pdf text-red-500"></i>
                    <span>Export as PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport("xlsx")}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="fas fa-file-excel text-green-500"></i>
                    <span>Export as Excel</span>
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="fas fa-file-csv text-blue-500"></i>
                    <span>Export as CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: "fas fa-chart-pie" },
                { id: "sales", name: "Sales", icon: "fas fa-dollar-sign" },
                { id: "leads", name: "Leads", icon: "fas fa-users" },
                {
                  id: "performance",
                  name: "Performance",
                  icon: "fas fa-trophy",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Filters:
              </label>
            </div>

            <select
              value={filters.salesRep}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, salesRep: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sales Reps</option>
              <option value="sarah">Sarah Johnson</option>
              <option value="mike">Mike Chen</option>
              <option value="emily">Emily Davis</option>
            </select>

            <select
              value={filters.region}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, region: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="ap">Asia Pacific</option>
            </select>

            <select
              value={filters.product}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, product: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Products</option>
              <option value="enterprise">Enterprise</option>
              <option value="professional">Professional</option>
              <option value="starter">Starter</option>
            </select>

            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-600">Customize widgets:</span>
              {widgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    widget.visible
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  {widget.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "sales" && renderSalesTab()}
          {activeTab === "leads" && renderLeadsTab()}
          {activeTab === "performance" && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <i className="fas fa-trophy text-4xl text-yellow-500 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Performance Analytics
              </h3>
              <p className="text-gray-600">
                Detailed performance metrics and team analytics coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Exporting report...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;