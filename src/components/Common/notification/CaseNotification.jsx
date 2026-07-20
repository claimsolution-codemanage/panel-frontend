import { useEffect, useState, useMemo } from "react"
import { toast } from 'react-toastify'
import Loader from "../loader"
import { Link } from "react-router-dom"
import { MdMarkChatRead, MdNotificationsActive, MdOutlineDateRange, MdClear, MdSearch } from "react-icons/md"
import { FiFilter, FiCheckSquare, FiSquare, FiExternalLink, FiRefreshCw } from "react-icons/fi"
import moment from "moment"
import DateSelect from "../Modal/DateSelect"

export default function ViewAllNotification({ getNotificationApi, viewUrl, updateNotificationApi }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [markNotification, setMarkNotification] = useState([])

    // Date Filter State
    const [showDateModal, setShowDateModal] = useState(false)
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    })

    // Search Query State
    const [searchQuery, setSearchQuery] = useState("")

    const getAllNotification = async () => {
        setLoading(true)
        try {
            const res = await getNotificationApi()
            if (res?.data?.success && res?.data?.data) {
                setData(res?.data?.data || [])
                setLoading(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setLoading(false)
        }
    }

    const handleMarkNotification = async () => {
        if (!markNotification || markNotification.length === 0) return
        setSaving(true)
        try {
            const res = await updateNotificationApi({ markNotification })
            if (res?.status === 200 || res?.data?.success) {
                toast.success("Notifications marked as read")
                setMarkNotification([])
                getAllNotification()
            } else {
                toast.error("Failed to update notifications")
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        getAllNotification()
    }, [])

    // Apply & Reset Date Filter Handlers
    const handleApplyDateFilter = () => {
        setIsFilterActive(true)
    }

    const handleResetDateFilter = () => {
        setIsFilterActive(false)
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        })
    }

    // Filter Data by Search Query and Date Range (createdAt)
    const filteredData = useMemo(() => {
        return (data || []).filter(item => {
            // Search Query Filter
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase().trim()
                const msgMatch = item?.message?.toLowerCase().includes(query)
                const caseIdMatch = item?.caseId?._id?.toLowerCase().includes(query)
                if (!msgMatch && !caseIdMatch) return false
            }

            // Date Range Filter (createdAt)
            if (isFilterActive && dateRange?.startDate && dateRange?.endDate) {
                if (!item?.createdAt) return false
                const itemDate = moment(item.createdAt)
                const start = moment(dateRange.startDate).startOf('day')
                const end = moment(dateRange.endDate).endOf('day')
                if (!itemDate.isBetween(start, end, null, '[]')) {
                    return false
                }
            }

            return true
        })
    }, [data, isFilterActive, dateRange, searchQuery])

    // Individual Item Selection Handler
    const handleCheck = (e, _id) => {
        const checked = e?.target?.checked
        if (checked) {
            setMarkNotification(prev => [...new Set([...prev, _id])])
        } else {
            setMarkNotification(prev => prev.filter(id => id !== _id))
        }
    }

    // Select All Filtered / Visible Items
    const isAllFilteredSelected = useMemo(() => {
        if (filteredData.length === 0) return false
        return filteredData.every(item => markNotification.includes(item?._id))
    }, [filteredData, markNotification])

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredData.map(item => item?._id).filter(Boolean)
        if (isAllFilteredSelected) {
            // Unselect all filtered items
            setMarkNotification(prev => prev.filter(id => !filteredIds.includes(id)))
        } else {
            // Add all filtered items to selection
            setMarkNotification(prev => [...new Set([...prev, ...filteredIds])])
        }
    }

    // Select All Overall Items
    const isAllOverallSelected = useMemo(() => {
        if (data.length === 0) return false
        return data.length === markNotification.length
    }, [data, markNotification])

    const handleSelectAllOverall = () => {
        if (isAllOverallSelected) {
            setMarkNotification([])
        } else {
            const allIds = data.map(item => item?._id).filter(Boolean)
            setMarkNotification(allIds)
        }
    }

    const handleClearSelection = () => {
        setMarkNotification([])
    }

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Header Section */}
            <div className="bg-white border-bottom shadow-sm sticky-top py-3 px-4 mb-4">
                <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-3 p-0">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                            <MdNotificationsActive className="fs-3" />
                        </div>
                        <div>
                            <h4 className="mb-0 text-dark fw-bold">Notifications Showcase</h4>
                            <span className="text-muted small">Manage & review system notifications</span>
                        </div>
                    </div>

                    {/* Stats & Mark as Read */}
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <div className="bg-light border rounded-pill px-3 py-1.5 d-flex align-items-center gap-2">
                            <span className="badge bg-secondary rounded-pill">{data.length}</span>
                            <span className="small text-muted fw-semibold">Total</span>
                        </div>
                        <div className="bg-light border rounded-pill px-3 py-1.5 d-flex align-items-center gap-2">
                            <span className="badge bg-info rounded-pill">{filteredData.length}</span>
                            <span className="small text-muted fw-semibold">Showing</span>
                        </div>
                        <div className="bg-light border rounded-pill px-3 py-1.5 d-flex align-items-center gap-2">
                            <span className={`badge ${markNotification.length > 0 ? 'bg-primary' : 'bg-secondary'} rounded-pill`}>
                                {markNotification.length}
                            </span>
                            <span className="small text-dark fw-semibold">Selected</span>
                        </div>

                        <button
                            onClick={handleMarkNotification}
                            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-pill px-4"
                            disabled={markNotification.length === 0 || saving}
                        >
                            <MdMarkChatRead className="fs-5" />
                            <span>{saving ? "Saving..." : `Mark as read (${markNotification.length})`}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-fluid px-3 px-md-5">
                {/* Filter & Toolbar Controls */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-3 p-md-4">
                        <div className="row g-3 align-items-center justify-content-between">
                            {/* Search Input */}
                            <div className="col-12 col-md-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted">
                                        <MdSearch className="fs-5" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0 shadow-none"
                                        placeholder="Search notifications..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            className="btn btn-outline-secondary border-start-0 bg-white"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            <MdClear />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Date Filter & Selection Controls */}
                            <div className="col-12 col-md-8 d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                                {/* Date Filter Button */}
                                <button
                                    onClick={() => setShowDateModal(true)}
                                    className={`btn d-flex align-items-center gap-2 rounded-3 ${isFilterActive ? 'btn-primary' : 'btn-outline-primary'}`}
                                >
                                    <FiFilter />
                                    <span>Date Filter</span>
                                    {isFilterActive && <span className="badge bg-white text-primary ms-1">Active</span>}
                                </button>

                                {isFilterActive && (
                                    <div className="d-flex align-items-center bg-primary-subtle text-primary border border-primary-subtle rounded-3 px-3 py-1.5 gap-2">
                                        <MdOutlineDateRange />
                                        <span className="small fw-semibold">
                                            {moment(dateRange.startDate).format("DD/MM/YYYY")} - {moment(dateRange.endDate).format("DD/MM/YYYY")}
                                        </span>
                                        <button
                                            onClick={handleResetDateFilter}
                                            className="btn btn-sm btn-link p-0 text-primary ms-1"
                                            title="Clear date filter"
                                        >
                                            <MdClear className="fs-5" />
                                        </button>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="vr d-none d-md-block mx-1" style={{ height: 24 }}></div>

                                {/* Select Controls Buttons */}
                                <button
                                    onClick={handleSelectAllFiltered}
                                    className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 ${isAllFilteredSelected ? 'btn-dark' : 'btn-outline-secondary'}`}
                                    disabled={filteredData.length === 0}
                                >
                                    {isAllFilteredSelected ? <FiCheckSquare /> : <FiSquare />}
                                    <span>Select All ({filteredData.length})</span>
                                </button>

                                <button
                                    onClick={handleSelectAllOverall}
                                    className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 ${isAllOverallSelected ? 'btn-dark' : 'btn-outline-secondary'}`}
                                    disabled={data.length === 0}
                                >
                                    {isAllOverallSelected ? <FiCheckSquare /> : <FiSquare />}
                                    <span>Select All Overall</span>
                                </button>

                                {markNotification.length > 0 && (
                                    <button
                                        onClick={handleClearSelection}
                                        className="btn btn-sm btn-outline-danger rounded-3"
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Showcase Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <Loader />
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="card border-0 shadow-sm rounded-4 text-center py-5 px-3">
                        <div className="card-body">
                            <div className="bg-light text-secondary rounded-circle d-inline-flex p-4 mb-3">
                                <MdNotificationsActive className="display-4 text-muted" />
                            </div>
                            <h5 className="fw-bold text-dark">No Notifications Found</h5>
                            <p className="text-muted mb-4">
                                {isFilterActive || searchQuery
                                    ? "No notifications match your current filter criteria."
                                    : "You don't have any notifications at the moment."}
                            </p>
                            {(isFilterActive || searchQuery) && (
                                <button
                                    onClick={() => {
                                        handleResetDateFilter()
                                        setSearchQuery("")
                                    }}
                                    className="btn btn-primary rounded-pill px-4"
                                >
                                    <FiRefreshCw className="me-2" /> Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="row g-3">
                        {filteredData.map(item => {
                            const isSelected = markNotification.includes(item?._id)
                            return (
                                <div key={item?._id || Math.random()} className="col-12 col-md-6 col-lg-4">
                                    <div
                                        className={`card h-100 border-0 shadow-sm rounded-4 position-relative transition-all hover-shadow ${isSelected ? 'bg-primary-subtle border border-2 border-primary' : 'bg-white'
                                            }`}
                                        style={{ transition: 'all 0.2s ease-in-out' }}
                                    >
                                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div
                                                            className={`d-flex align-items-center justify-content-center rounded-circle ${isSelected ? 'bg-primary text-white' : 'bg-primary-subtle text-primary'
                                                                }`}
                                                            style={{ width: 40, height: 40 }}
                                                        >
                                                            <MdNotificationsActive className="fs-5" />
                                                        </div>
                                                        <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1 small">
                                                            {moment().diff(moment(item?.createdAt), 'M')} months ago
                                                        </span>
                                                    </div>

                                                    <div className="form-check m-0">
                                                        <input
                                                            className="form-check-input border-secondary"
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => handleCheck(e, item?._id)}
                                                            id={`notif-check-${item?._id}`}
                                                            style={{ width: 20, height: 20, cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </div>

                                                <p className="card-text text-dark fw-medium mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                                    {item?.message}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex align-items-center justify-content-between mt-2">
                                                <span className="text-muted small">
                                                    {moment(item?.createdAt).format("DD MMM YYYY, hh:mm A")}
                                                </span>
                                                {item?.caseId?._id && (
                                                    <Link
                                                        to={`${viewUrl}${item?.caseId?._id}`}
                                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                                    >
                                                        <span>View Case</span>
                                                        <FiExternalLink className="small" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Date Select Modal */}
            <DateSelect
                show={showDateModal}
                hide={() => setShowDateModal(false)}
                onFilter={handleApplyDateFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
        </div>
    )
}