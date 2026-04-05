import React, { useState, useEffect, useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiActivity,
  FiCalendar,
  FiTrendingUp,
  FiUser,
  FiGrid,
  FiArrowUpRight,
  FiArrowDownRight,
  FiMinus
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import Loader from '../../../components/Common/loader';
import { allEmployeeDashboardData } from '../../../apis';
import { toast } from 'react-toastify';
import { AppContext } from '../../../App';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

export default function EmployeeDashboard() {
  const state = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [employee, setEmployee] = useState({});
  const [noOfPartner, setNoOfPartner] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getDashboardDetails = async () => {
    setLoading(true);
    try {
      const res = await allEmployeeDashboardData(selectedYear);
      if (res?.data?.success) {
        if (res?.data?.graphData) setGraphData(res?.data?.graphData);
        if (res?.data?.pieChartData) setChartData(res?.data?.pieChartData);
        if (res?.data?.employee) setEmployee(res?.data?.employee);
        if (res?.data?.noOfPartner) setNoOfPartner(res?.data?.noOfPartner);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardDetails();
  }, [selectedYear]);


  // Premium chart configurations
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#1e293b',
        borderWidth: 2,
        padding: 16,
        cornerRadius: 16,
        titleFont: { size: 14, weight: '600', family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          stepSize: 5,
          color: '#64748b',
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 8,
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 8,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#3b82f6',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          color: '#334155',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#1e293b',
        borderWidth: 2,
        padding: 16,
        cornerRadius: 16,
        titleFont: { size: 14, weight: '600', family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
      },
    },
  };

  // Chart data preparation
  const lineData = {
    labels: graphData?.map(data => data?.monthName?.slice(0, 3)) || [],
    datasets: [
      {
        label: 'Total Cases',
        data: graphData?.map(data => data?.totalCases) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.02)',
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: chartData[0]?.allCase?.map(data => data?._id) || ['No Data'],
    datasets: [
      {
        data: chartData[0]?.allCase?.map(data => data?.totalCases) || [1],
        backgroundColor: [
          '#3b82f6',
          '#60a5fa',
          '#93c5fd',
          '#bfdbfe',
          '#dbeafe',
          '#eff6ff',
        ],

        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Helper functions
  const getYearOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 2; i++) {
      const year = currentYear - i;
      options.push({ label: `FY ${year}-${year + 1}`, value: year });
    }
    return options;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const StatCard = ({ title, value, icon: Icon }) => {

    return (
      <div className="stat-card">
        <div className="stat-card-header">
          <div className="icon-wrapper">
            <Icon size={20} />
          </div>
        </div>

        <div className="stat-card-body">
          <h6 className="stat-title">{title}</h6>
          <h3 className="stat-value">{value}</h3>
        </div>

        <style jsx>{`
          .stat-card {
            background: linear-gradient(145deg, #ffffff, #fafafa);
            border-radius: 24px;
            padding: 24px;
            height: 100%;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.02),
              0 2px 4px -1px rgba(0, 0, 0, 0.02),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(226, 232, 240, 0.6);
            transition: all 0.2s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 20px 25px -5px rgba(0, 0, 0, 0.05),
              0 10px 10px -5px rgba(0, 0, 0, 0.02),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
            border-color: rgba(59, 130, 246, 0.2);
          }

          .stat-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .icon-wrapper {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
          }

          .stat-title {
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.02em;
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
            line-height: 1.2;
          }

          .stat-subtitle {
            color: #94a3b8;
            font-size: 13px;
            font-weight: 400;
            margin: 0;
          }
        `}</style>
      </div>
    );
  };

  const CategoryCard = ({ category, value, total, amount, totalAmount, icon: Icon }) => {
    const percentage = total ? Math.round((value / total) * 100) : 0;
    const amountPercentage = totalAmount ? Math.round((amount / totalAmount) * 100) : 0;
    const growthColor = '#10b981';
    const amountGrowthColor = amountPercentage > 50 ? '#10b981' : '#ef4444';

    return (
      <div className="category-card">
        <div className="category-card-header">
          <div className="d-flex align-items-center gap-3">
            <div className="category-icon">
              <Icon size={18} />
            </div>
            <div>
              <h6 className="category-name">{category}</h6>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="category-value">{value.toLocaleString()}</span>
                {/* <span className="category-percentage">{percentage}%</span> */}
              </div>
            </div>

          </div>
          <div className="growth-indicator" style={{ color: growthColor }}>
            {/* <GrowthIcon size={16} /> */}
            <span>{percentage}%</span>
          </div>
        </div>

        <div className='d-flex justify-content-between align-items-center'>
          <p>{formatCurrency(amount)}</p>
          <div className="growth-indicator" style={{ color: amountGrowthColor }}>
            <span>{amountPercentage}%</span>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${percentage}%` }} />
        </div>


        <style jsx>{`
          .category-card {
            background: white;
            border-radius: 20px;
            padding: 20px;
            border: 1px solid rgba(226, 232, 240, 0.6);
            transition: all 0.2s ease;
          }

          .category-card:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
          }

          .category-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 16px;
          }

          .category-icon {
            width: 40px;
            height: 40px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3b82f6;
          }

          .category-name {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            margin: 0;
            text-transform: capitalize;
          }

          .category-value {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
          }

          .category-percentage {
            font-size: 13px;
            font-weight: 500;
            color: #64748b;
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 100px;
          }

          .growth-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: #f8fafc;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 600;
          }

          .progress-container {
            height: 4px;
            background: #f1f5f9;
            border-radius: 100px;
            overflow: hidden;
          }

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            border-radius: 100px;
            transition: width 0.3s ease;
          }
        `}</style>
      </div>
    );
  };

  if (loading) return <Loader />;

  const totalCases = chartData[0]?.totalCase || 0;
  const totalRevenue = chartData[0]?.totalCaseAmount || 0;

  return (
    <div className="dashboard-container">
      {/* Premium Header */}
      <div className="header-section">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-wrapper">
              <img
                src="/Images/icons/company-logo.png"
                height={40}
                alt="Company logo"
                loading="lazy"
              />
            </div>
            <div className="header-title">
              <h1>Dashboard</h1>
              <p>Welcome back, {employee?.fullName || 'User'}</p>
            </div>
          </div>

          <div className="header-right">
            <div className="year-selector">
              <FiCalendar size={18} className="text-primary" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {getYearOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="premium-badge">
              <HiOutlineSparkles size={16} />
              <span>Premium</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="profile-card">
        <div className="profile-grid">
          <div className="profile-item">
            <div className="profile-icon">
              <FiUser />
            </div>
            <div>
              <span className="profile-label">Full Name</span>
              <span className="profile-value">{employee?.fullName || '—'}</span>
            </div>
          </div>
          <div className="profile-item">
            <div className="profile-icon">
              <FiGrid />
            </div>
            <div>
              <span className="profile-label">Department</span>
              <span className="profile-value">{employee?.type || '—'}</span>
            </div>
          </div>
          <div className="profile-item">
            <div className="profile-icon">
              <FiTrendingUp />
            </div>
            <div>
              <span className="profile-label">Designation</span>
              <span className="profile-value">{employee?.designation || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Cases"
          value={totalCases.toLocaleString()}
          icon={FiBriefcase}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={FiDollarSign}
        />
        <StatCard
          title="Partners"
          value={noOfPartner.toLocaleString()}
          icon={FiUsers}
        />
        {/* <StatCard 
          title="Activity Rate"
          value={`${totalCases ? Math.round((noOfPartner / totalCases) * 100) : 0}%`}
          icon={FiActivity}
        /> */}
      </div>

      {/* Category Cards with Growth Icons */}
      {chartData[0]?.allCase?.length > 0 && (
        <div className="category-section">
          <div className="section-header">
            <h2>Case Categories</h2>
            <span className="section-badge">Performance Overview</span>
          </div>
          <div className="category-grid">
            {chartData[0]?.allCase?.map((data) => (
              <CategoryCard
                key={data?._id}
                category={data?._id}
                value={data?.totalCases}
                amount={data?.totalCaseAmount}
                totalAmount={totalRevenue}
                total={totalCases}
                icon={FiTrendingUp}
              />
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Case Trends</h3>
            <span className="chart-badge">Monthly Overview</span>
          </div>
          <div className="chart-container">
            <Line data={lineData} options={lineChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Case Distribution</h3>
            <span className="chart-badge">By Category</span>
          </div>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          background: #f8fafc;
          min-height: 100vh;
          padding: 24px 32px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Header Styles */
        .header-section {
          margin-bottom: 32px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .logo-wrapper {
          background: white;
          padding: 12px;
          border-radius: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .header-title h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .header-title p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .year-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .year-selector select {
          border: none;
          background: transparent;
          font-weight: 600;
          color: #0f172a;
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        .premium-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2);
        }

        /* Profile Card */
        .profile-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .profile-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .profile-icon {
          width: 48px;
          height: 48px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          font-size: 20px;
        }

        .profile-label {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .profile-value {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        /* Category Section */
        .category-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .section-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        /* Charts Section */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .chart-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .chart-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .chart-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
        }

        .chart-container {
          height: 300px;
          position: relative;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .chart-container {
            height: 250px;
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}