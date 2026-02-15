import { useState, useEffect, useRef } from "react"
import { toast } from 'react-toastify'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Loader from "../../../../components/Common/loader";
import LeadTable from "./LeadTable";
import { exportToCSV, exportToExcel } from "../../../../utils/exportUtils";
const PAGE_SIZE = 10;
export default function AllLeadComp({ getAllColumnApi, addOrUpdateLeadApi, empGetLeadRowsApi, getSaleEmp, deleteLeadApi,hasDeleteAccess }) {
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const isFetchingRef = useRef(true)
  const [toggleRerender,setToggleRerender] = useState(false)

  const getAllLeads = async () => {
    if (loading || !hasMore) return;
    setLoading(true)
    try {

      const res = await empGetLeadRowsApi({ limit: PAGE_SIZE, page, filters, sortConfig })
      if (res?.data?.success && res?.data?.data) {
        const newData = res?.data?.data || [];
        setData((prev) => [...(page === 1 ? [] : prev), ...newData]);
        setTotalData(res?.data?.noOfData)
        if (newData.length === 0) {
          setHasMore(false);
        }
        setLoading(false)
      }
    } catch (error) {
      console.log("error-", error)
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
    setLoading(false);
    isFetchingRef.current = false;

    // ✅ Restore scroll position smoothly
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollPositionRef.current;
      }
    });

  }

  const getViewAllColumn = async () => {
    try {
      const res = await getAllColumnApi({})
      if (res?.data?.success && res?.data?.data) {
        setColumns([...res?.data?.data])
      }
    } catch (error) {
      console.log(error)
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }


  }


  useEffect(() => {
    getAllLeads()
  }, [page,toggleRerender])

  useEffect(() => {
    getViewAllColumn()
  }, [])


  const handleScroll = () => {
  const container = containerRef.current;
  if (!container) return;

  const { scrollTop, scrollHeight, clientHeight } = container;

  const isAtBottom =
    scrollTop + clientHeight >= scrollHeight - 150;

  if (isAtBottom && !loading && hasMore && !isFetchingRef.current) {
    isFetchingRef.current = true;

    // ✅ store current scroll position
    scrollPositionRef.current = scrollHeight;

    setPage((prev) => prev + 1);
  }
};


  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore]);
  
  
  const handleFilterApply =()=>{
  // when filter changes → reset everything
  setData([]);
  setPage(1);
  setHasMore(true);
  setToggleRerender(!toggleRerender)
}


  const formatDataForExport = (rows=[]) => {
  return rows.map((row) => {
    const formattedRow = {};

    columns
      .filter((col) => col.isActive !== false) // skip inactive columns
      .sort((a, b) => a.order - b.order) // respect column order
      .forEach((col) => {
        let value;

        // 🔥 Handle system/root fields
        if (col.key === "assignedTo") {
          value = row?.assignedTo?.fullName || "";
        } 
        else if (col.key === "followUpDate") {
          value = row?.followUpDate
            ? new Date(row.followUpDate).toISOString().split("T")[0]
            : "";
        } 
        // 🔥 Default: dynamic fields from row.data
        else {
          value = row?.data?.[col.key];
        }

        // Type-based formatting
        if (col.type === "checkbox") {
          value = value ? "Yes" : "No";
        }

        if (col.type === "date" && value) {
          value = new Date(value).toISOString().split("T")[0];
        }

        formattedRow[col.label] = value ?? "";
      });

    return formattedRow;
  });
};


const handleExport = async(type="excel")=>{
   try {
      const res = await empGetLeadRowsApi({isExport:true, filters, sortConfig })
      if (res?.data?.success && res?.data?.data) {
        const newData = res?.data?.data || [];
        const data = formatDataForExport(newData)
        type==="excel" ? exportToExcel(data) : exportToCSV(data)
        toast.success(`Successfully export to ${type}`)
      }
    } catch (error) {
      console.log("export error-", error)
      toast.error("Failed to download the file")
    }
}


  return (<>
      <div>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            <div className="d-flex flex align-items-center gap-1">
              <span>All Leads</span>
            </div>
          </div>
        </div>


        <div className="m-0 m-md-5">
          <LeadTable
            loading={loading}
            totalRecord={totalData}
            containerRef={containerRef}
            columns={columns}
            rows={data}
            setRows={setData}
            getSaleEmp={getSaleEmp}
            addOrUpdateLeadApi={addOrUpdateLeadApi}
            deleteLeadApi={deleteLeadApi}
            getFilterData={handleFilterApply}
            filters={filters}
            setFilters={setFilters}
            setSortConfig={setSortConfig}
            sortConfig={sortConfig}
            hasDeleteAccess={hasDeleteAccess}
            handleExport={handleExport}
          />
        </div>

      </div >
    {/* {loading ? <Loader /> :
    } */}
  </>)
}