import React from 'react';
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
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { CiAlignBottom, CiBookmark, CiStar, CiShoppingTag, CiGrid41 } from 'react-icons/ci'
import Loader from '../../../components/Common/loader';
import { useState } from 'react';
import { allMonths } from '../../../utils/constant';


// import faker from 'faker';
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



import { adminDashboardData } from '../../../apis';
import { toast } from 'react-toastify'
import { useEffect } from 'react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])
  const [graphData, setGraphData] = useState([])
  const [info, setInfo] = useState({ noOfClient: 0, noOfPartner: 0, noOfEmployee: 0 })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const getDashboardDetails = async () => {
    try {
      setLoading(true)
      const res = await adminDashboardData(selectedYear)
      if (res?.data?.success) {
        if (res?.data?.graphData) {
          setGraphData(res?.data?.graphData)
        }
        if (res?.data?.pieChartData) {
          setChartData(res?.data?.pieChartData)
        }
        if (res?.data?.noOfClient) {
          setInfo({ noOfClient: res?.data?.noOfClient, noOfPartner: res?.data?.noOfPartner, noOfEmployee: res?.data?.noOfEmployee })
        }
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }
  useEffect(() => {
    getDashboardDetails()
  }, [selectedYear])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  const data = {
    labels: graphData?.map(data => { return `${allMonths[data?._id?.month - 1]}` }),
    datasets: [
      {
        label: 'Cases',
        data: graphData?.map(data => { return data?.totalCases }),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const data1 = {
    labels: chartData?.length === 0 ? ["No Case"] : chartData[0]?.allCase?.map(data => { return data?._id }),
    // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Case',
        data: chartData?.length === 0 ? [0] : chartData[0]?.allCase?.map(data => { return data?.totalCases }),
        backgroundColor: [
          'rgb(255 99 132 / 78%)',
          'rgb(54 162 235 / 76%)',
          'rgb(255 206 86 / 77%)',
          'rgb(75 192 192 / 75%)',
          'rgb(153 102 255 / 74%)',
          'rgb(255 159 64 / 75%)',
          'rgb(255 100 90 / 75%)',
          'rgb(255 140 200 / 75%)',
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
      },
    ],
  };

  const getAllYearOptions = () => {
    const options = []
    const currentYear = new Date().getFullYear()
    const startYear = 2024
    for (let i = currentYear - startYear; i >= 0; i--) {
      options.push(startYear + i)
    }
    return options
  }

  return (
    <>
      {loading ? <Loader /> :
        <div className="bg-color-7">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card mx-4 p-3 border-0 shadow rounded-4 mt-3">
                  <div className='d-flex flex-column flex-lg-row align-items-center justify-content-lg-between justify-content-center'>
                    <div className='d-flex align-items-center'>
                      <div className="nav__logo">
                        <img src="/Images/icons/company-logo.png" height={70} alt="Company logo" loading="lazy" />
                      </div>
                    </div>
                    <p className='fw-bold h5 p-0 m-0 '>Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card p-3 mx-4 mt-4 rounded-4 bg-color-1 border-none border-0 shadow">
                  <div className='d-flex justify-content-between'>
                    <h6 className="h1 fw-bold">Welcome to your Dashboard</h6>
                    <div className='d-flex gap-1 align-items-center justify-content-center'>
                      <p className='p-0 m-0'>Year</p>
                      <select className="form-select w-auto h-auto" name="year" id="year" value={selectedYear} onChange={(e) => setSelectedYear(e?.target?.value)}>
                        {getAllYearOptions().map(ele => <option value={ele}>{ele}</option>)}
                      </select>
                    </div>
                  </div>

                  <p className='mt-4'>You can view the overall data of your case details.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="mx-4">
              <div className="row">
                <div className="col-md-3 border-end">
                  <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                    <div className='d-flex align-items-center justify-content-around'>
                      <div className="text-center ">
                        <h3 className='fw-bold h2'>{chartData[0]?.totalCase ? chartData[0]?.totalCase : 0}</h3>
                        <p className='card-title fs-5 text-primary text-capitalize'>Total Case</p>
                      </div>
                      <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                    </div></div>
                </div>
                <div className="col-md-3 border-end">
                  <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                    <div className='d-flex align-items-center justify-content-around'>
                      <div className="text-center ">
                        <h3 className='fw-bold h2'>{chartData[0]?.totalCaseAmount ? chartData[0]?.totalCaseAmount : 0}</h3>
                        <p className='card-title fs-5 text-primary text-capitalize'>Total Case Amount</p>
                      </div>
                      <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                    </div></div>
                </div>
                <div className="col-md-3 border-end">
                  <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                    <div className='d-flex align-items-center justify-content-around'>
                      <div className="text-center ">
                        <h3 className='fw-bold h2'>{info?.noOfPartner ? info?.noOfPartner : 0}</h3>
                        <p className='card-title fs-5 text-primary text-capitalize'>Total Partner</p>
                      </div>
                      <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                    </div></div>
                </div>
                <div className="col-md-3 border-end">
                  <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                    <div className='d-flex align-items-center justify-content-around'>
                      <div className="text-center ">
                        <h3 className='fw-bold h2'>{info?.noOfClient ? info?.noOfClient : 0}</h3>
                        <p className='card-title fs-5 text-primary text-capitalize'>Total Client</p>
                      </div>
                      <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                    </div></div>
                </div>
                <div className="col-md-3 border-end">
                  <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                    <div className='d-flex align-items-center justify-content-around'>
                      <div className="text-center ">
                        <h3 className='fw-bold h2'>{info?.noOfEmployee ? info?.noOfEmployee : 0}</h3>
                        <p className='card-title fs-5 text-primary text-capitalize'>Total Employee</p>
                      </div>
                      <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                    </div></div>
                </div>
                {chartData[0]?.allCase?.map(data => <div className="col-md-3 border-end">
                  <div className="bg-color-1 border-5 border-primary border-start card mx-1 my-4 p-2 shadow">
                    <div className='d-flex align-items-center justify-content-around'>
                      <div className="text-center ">
                        <h3 className='fw-bold h2'>{data?.totalCases}</h3>
                        <p className='card-title fs-5 text-primary text-capitalize'>{data?._id}</p>
                      </div>
                      <div className="bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, borderRadius: 50 }}><CiAlignBottom className='fs-2' /></div>
                    </div></div>
                </div>)}

              </div>
            </div>
          </div>
          <div className="container-fluid my-2">
            <div className="row px-4 h-100">
              <div className="col-12 col-md-8 h-100">
                <div className="card border-0 rounded-4 shadow p-4">
                  <Line options={options} data={data} />
                </div>
              </div>
              <div className="col-12 col-md-4 h-100">
                <div className="card border-0 rounded-4 shadow p-4">
                  <div className="">
                    <Pie data={data1} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>}
    </>
  )
}
