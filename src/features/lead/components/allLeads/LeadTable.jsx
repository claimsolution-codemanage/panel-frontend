

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { formatDateToISO, getFormateDMYDate } from "../../../../utils/helperFunction";
import AsyncSelect from 'react-select/async';
import debounce from 'debounce';
import { MdDelete } from "react-icons/md";
import { IoCloudDoneOutline } from "react-icons/io5";
import LeadColumnFilter from "./LeadColumnFilter";
import { CiFilter } from "react-icons/ci";
import { toast } from "react-toastify";
import AddLeadColumn from "./AddLeadColumn";
const STORAGE_KEY = "leadEngine_columnWidths_v1";

export default function LeadExcelTable({ columns, rows, addOrUpdateLeadApi, getSaleEmp, deleteLeadApi, getFilterData, filters, sortConfig, 
  setFilters, setSortConfig, containerRef, loading, handleExport, hasDeleteAccess,addLeadColumnApi,refetchColumnData,hasAddColumnAccess }) {
  const inputRef = useRef();
  const [grid, setGrid] = useState([]);
  const [resizingColumn, setResizingColumn] = useState(null);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [editing, setEditing] = useState(null); // {row, key}
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [rowHeights, setRowHeights] = useState({});
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [frozenColumns, setFrozenColumns] = useState(() => {
    const saved = localStorage.getItem("leadEngine_frozenColumns");
    return saved ? JSON.parse(saved) : [];
  });
  const [textWrap, setTextWrap] = useState(() => {
    const saved = localStorage.getItem("leadEngine_textWrap");
    return saved ? JSON.parse(saved) : false;
  });
  const [autoHeight, setAutoHeight] = useState(() => {
    const saved = localStorage.getItem("leadEngine_autoHeight");
    return saved ? JSON.parse(saved) : true;
  });

  const isResizing = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [columnWidths, setColumnWidths] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    // default widths if nothing saved
    return columns.reduce((acc, col) => {
      acc[col.key] = 180;
      return acc;
    }, {});
  });

  const today = new Date().toISOString().split("T")[0];

  // Save column widths to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Save frozen columns to localStorage
  useEffect(() => {
    localStorage.setItem("leadEngine_frozenColumns", JSON.stringify(frozenColumns));
  }, [frozenColumns]);

  // Save text wrap setting to localStorage
  useEffect(() => {
    localStorage.setItem("leadEngine_textWrap", JSON.stringify(textWrap));
  }, [textWrap]);

  // Save auto height setting to localStorage
  useEffect(() => {
    localStorage.setItem("leadEngine_autoHeight", JSON.stringify(autoHeight));
  }, [autoHeight]);

  const fetchEmpList = async (inputValue, cb) => {
    try {
      const { data } = await getSaleEmp(50, 0, inputValue)
      const list = data?.data?.map(emp => {
        return {
          label: `${emp?.fullName || ""} | ${emp?.type || ""}`,
          value: emp?._id
        }
      })
      cb(list)
    } catch (error) {
      cb([])
    }
  }
  const fetchOptions = debounce(fetchEmpList, 3000)

  useEffect(() => {
    const formatted = rows.map((r) => ({
      _id: r._id,
      followUpDate: r?.followUpDate ? formatDateToISO(r?.followUpDate) : null,
      assignedTo: r?.assignedTo?._id ? { label: `${r?.assignedTo?.fullName || ""} | ${r?.assignedTo?.type || ""}`, value: r?.assignedTo?._id } : null,
      ...r.data,
    }));
    setGrid(formatted);

    // Calculate auto heights if enabled
    if (autoHeight) {
      setTimeout(() => calculateAutoHeights(formatted), 100);
    }
  }, [rows, autoHeight]);

  // Calculate auto heights based on content
  const calculateAutoHeights = (data) => {
    const newHeights = {};
    data.forEach((row, index) => {
      let maxHeight = 44; // minimum height

      columns.forEach(col => {
        const value = row[col.key];
        if (value) {
          const contentLength = String(value).length;
          const estimatedLines = Math.ceil(contentLength / 30); // rough estimate
          const estimatedHeight = estimatedLines * 24; // 24px per line
          maxHeight = Math.max(maxHeight, estimatedHeight);
        }
      });

      newHeights[index] = Math.min(maxHeight, 200); // cap at 200px
    });
    setRowHeights(newHeights);
  };

  // Update cell locally
  const updateCell = (rowIndex, key, value) => {
    setGrid(prev => {
      const copy = [...prev];
      copy[rowIndex][key] = value;
      return copy;
    });

    setDirtyRows(prev => {
      const updated = new Set(prev);
      updated.add(rowIndex);
      return updated;
    });

    setIsDirty(true);

    // Update auto height if enabled
    if (autoHeight) {
      setTimeout(() => {
        const textarea = document.createElement('textarea');
        textarea.value = value || '';
        textarea.style.width = `${columnWidths[key]}px`;
        textarea.style.fontSize = '14px';
        textarea.style.padding = '10px 14px';
        document.body.appendChild(textarea);
        const height = Math.max(44, textarea.scrollHeight);
        document.body.removeChild(textarea);

        setRowHeights(prev => ({
          ...prev,
          [rowIndex]: Math.min(height, 200)
        }));
      }, 0);
    }
  };

  const saveAll = async () => {
    if (dirtyRows.size === 0) return;

    try {
      setSaving(true);

      const bulkPayload = [];

      for (let rowIndex of dirtyRows) {
        const row = grid[rowIndex];

        const payload = {
          ...(row._id ? { _id: row._id } : {}),
          data: {},
        };

        columns.forEach((col) => {
          if (col.key === "assignedTo") {
            payload[col.key] = row[col.key]?.value || null;
          } else if (col.key === "followUpDate") {
            payload[col.key] = row[col.key] || null;
          } else {
            payload.data[col.key] = row[col.key] || "";
          }
        });

        bulkPayload.push(payload);
      }
      const result = await addOrUpdateLeadApi(bulkPayload);
      const insertedDocs = result?.data?.inserted || [];

      if (insertedDocs.length) {
        let insertIndex = 0;

        setGrid(prev => {
          const updated = [...prev];

          dirtyRows.forEach(rowIndex => {
            if (!updated[rowIndex]._id && insertedDocs[insertIndex]) {
              updated[rowIndex]._id = insertedDocs[insertIndex]._id;
              insertIndex++;
            }
          });

          return updated;
        });
      }

      setDirtyRows(new Set());
      setIsDirty(false);

    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderInputByType = (col, value, rowIndex) => {
    const commonProps = {
      ref: inputRef,
      autoFocus: true,
      className: "modern-input",
      value: value || "",
      onChange: (e) => updateCell(rowIndex, col.key, e.target.value),
      onKeyDown: (e) => {
        e.stopPropagation();
        const { row, col } = activeCell;

        if (e.key === "Escape") {
          setEditing(null);
          return;
        }

        if (["Enter", "Tab", "ArrowUp", "ArrowDown"].includes(e.key)) {
          e.preventDefault();

          let newRow = row;
          let newCol = col;

          switch (e.key) {
            case "Enter":
            case "ArrowDown":
              newRow += 1;
              break;
            case "ArrowUp":
              newRow -= 1;
              break;
            case "Tab":
            case "ArrowRight":
              newCol += 1;
              break;
            case "ArrowLeft":
              newCol -= 1;
              break;
          }

          moveActive(newRow, newCol);

          const nextKey = columns[newCol]?.key;

          setTimeout(() => {
            setEditing({ row: newRow, key: nextKey });
          }, 50);
        }
      },
    };

    switch (col.type) {
      case "number":
        return <input type="number" {...commonProps} />;

      case "date":
        return (
          <input
            type="date"
            {...commonProps}
            min={today}
            value={
              commonProps?.value
                ? formatDateToISO(commonProps.value)
                : ""
            }
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        );

      case "select":
        return (
          <select {...commonProps}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <option value="">Select</option>
            {col.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "emp-select":
        return (
          <div
            onKeyDown={(e) => {
              const navigationKeys = [
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Enter",
                "Tab",
              ];

              if (navigationKeys.includes(e.key)) {
                e.stopPropagation();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AsyncSelect
              cacheOptions
              defaultOptions
              className="text-capitalize"
              value={commonProps?.value}
              onChange={(val) => updateCell(rowIndex, col.key, val)}
              loadOptions={fetchOptions}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const addRow = () => {
    const empty = {};
    columns.forEach((c) => (empty[c.key] = ""));
    setGrid((prev) => [empty, ...prev]);

    if (autoHeight) {
      setRowHeights(prev => ({
        0: 44,
        ...Object.keys(prev).reduce((acc, key) => {
          acc[parseInt(key) + 1] = prev[key];
          return acc;
        }, {})
      }));
    }
  };

  const deleteRow = async (id, index) => {
    if (id) {
      try {
        const result = await deleteLeadApi({ _id: id });
        setGrid((prev) => prev.filter((_, i) => i !== index));

        // Adjust row heights
        if (autoHeight) {
          const newHeights = {};
          Object.keys(rowHeights).forEach(key => {
            const numKey = parseInt(key);
            if (numKey < index) {
              newHeights[numKey] = rowHeights[numKey];
            } else if (numKey > index) {
              newHeights[numKey - 1] = rowHeights[numKey];
            }
          });
          setRowHeights(newHeights);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message ?? "Failed to delete lead")
      }
    }
  };

  const selectCell = async (rowIndex, colIndex) => {
    if (editing) {
      const editingRow = editing.row;
      setEditing(null);
    }

    setActiveCell({ row: rowIndex, col: colIndex });
  };

  const moveActive = (row, col) => {
    const maxRow = grid.length - 1;
    const maxCol = columns.length - 1;

    if (row < 0) row = 0;
    if (col < 0) col = 0;
    if (row > maxRow) row = maxRow;
    if (col > maxCol) col = maxCol;

    selectCell(row, col);
  };

  const handleKeyNavigation = (e) => {
    e.stopPropagation();

    const { row, col } = activeCell;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveActive(row, col + 1);
        break;

      case "ArrowLeft":
        e.preventDefault();
        moveActive(row, col - 1);
        break;

      case "ArrowDown":
        e.preventDefault();
        moveActive(row + 1, col);
        break;

      case "ArrowUp":
        e.preventDefault();
        moveActive(row - 1, col);
        break;

      case "Tab":
        e.preventDefault();
        if (e.shiftKey) moveActive(row, col - 1);
        else moveActive(row, col + 1);
        break;

      case "Enter":
        e.preventDefault();
        moveActive(row + 1, col);
        break;

      default:
        break;
    }

    const navigationKeys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Escape",
    ];

    const isPrintableKey =
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !navigationKeys.includes(e.key);

    if (!editing && isPrintableKey) {
      const colKey = columns[activeCell.col].key;

      setEditing({ row: activeCell.row, key: colKey });

      setTimeout(() => {
        updateCell(activeCell.row, colKey, e.key);
      }, 0);
    }
  };

  const startColumnResize = (e, key) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    setResizingColumn(key);

    const startX = e.clientX;
    const startWidth = columnWidths[key] ?? 180;

    // Add class to body to prevent text selection during resize
    document.body.classList.add('resizing-active');
    document.body.style.cursor = 'col-resize';

    const onMouseMove = (moveEvent) => {
      if (!isResizing.current) return;
      moveEvent.preventDefault();
      const newWidth = Math.max(120, startWidth + (moveEvent.clientX - startX));

      setColumnWidths((prev) => ({
        ...prev,
        [key]: newWidth,
      }));
    };

    const onMouseUp = () => {
      isResizing.current = false;
      setResizingColumn(null);

      // Remove body styles
      document.body.classList.remove('resizing-active');
      document.body.style.cursor = '';

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startRowResize = (e, rowIndex) => {
    e.stopPropagation();
    const startY = e.clientY;
    const startHeight = rowHeights[rowIndex] || 44;

    const onMouseMove = (moveEvent) => {
      const newHeight = Math.max(36, startHeight + (moveEvent.clientY - startY));

      setRowHeights((prev) => ({
        ...prev,
        [rowIndex]: newHeight,
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const toggleFreezeColumn = (colKey) => {
    setFrozenColumns(prev => {
      if (prev.includes(colKey)) {
        return prev.filter(key => key !== colKey);
      } else {
        return [...prev, colKey];
      }
    });
  };

  const toggleTextWrap = () => {
    setTextWrap(prev => !prev);
  };

  const toggleAutoHeight = () => {
    setAutoHeight(prev => {
      const newValue = !prev;
      if (newValue) {
        setTimeout(() => calculateAutoHeights(grid), 100);
      } else {
        setRowHeights(44);
      }
      return newValue;
    });
  };

  const handleResetFilter = () => {
    setFilters({})
    setSortConfig(null)
    getFilterData()
  }

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        const confirmLeave = window.confirm(
          "You have unsaved changes. Save before moving?"
        );

        if (confirmLeave) {
          saveAll();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const getFollowUpClass = (nextFollowUp) => {
    if (!nextFollowUp) return "badge bg-secondary";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const followUpDate = new Date(nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);

    const diffInMs = followUpDate - today;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return "badge bg-danger text-white" // Overdue → Red
    if (diffInDays === 0) return "badge bg-orange text-white" // Today → Orange
    if (diffInDays === 1) return "badge bg-warning text-white"; // Tomorrow → Yellow
    return "badge bg-success text-white"; // Future Dates → Green
  };

  const getStatusClass = (status) => {
    if (!status) return "badge bg-secondary";

    switch (status.toLowerCase()) {
      case "new":
        return "badge bg-primary text-white"; // Blue
      case "interested":
        return "badge bg-success text-white"; // Green
      case "not interested":
        return "badge bg-danger text-white"; // Red
      case "follow-up pending":
        return "badge bg-orange text-white"; // Orange
      default:
        return "badge bg-secondary text-white";
    }
  };

  const renderInputValue = (row, col) => {
    // Conditional formatting for status column
    if (col.key === "status" && row[col.key]) {
      return (
        <span className={getStatusClass(row[col.key])}>
          {row[col.key]}
        </span>
      );
    }

    // Conditional formatting for follow-up date (first column)
    if (col.type === "date" && row[col.key]) {
      return (
        <span className={getFollowUpClass(row[col.key])}>
          {getFormateDMYDate(row[col.key])}
        </span>
      );
    }

    if (col.type === "date" && row[col.key]) {
      return getFormateDMYDate(row[col.key]);
    }

    return row[col?.key]?.label ?? row[col.key];
  };

  // Reorder columns to make followUpDate the first column
  // const reorderedColumns = React.useMemo(() => {
  //   const followUpDateCol = columns.find(col => col.key === "followUpDate");
  //   const otherColumns = columns.filter(col => col.key !== "followUpDate");

  //   if (followUpDateCol) {
  //     return [followUpDateCol, ...otherColumns];
  //   }
  //   return columns;
  // }, [columns]);

  const reorderedColumns = columns

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="lead-header">
        <div className="lead-header-left">
          <div className="record-info">
            <span className="record-count">{grid?.length} Records</span>
            {loading && <span className="loading-text">Loading...</span>}
          </div>

          <div className="save-status">
            <IoCloudDoneOutline size={16} />
            <span>
              {saving
                ? "Saving..."
                : isDirty
                  ? "Unsaved changes"
                  : "All changes saved"}
            </span>
          </div>
        </div>

        <div className="lead-header-actions">
          <div style={{ marginBottom: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* View Options */}
            <div className="btn-group" style={{ display: "flex", gap: "5px" }}>
              <button
                className={`btn ${textWrap ? "btn-primary" : "btn-secondary"}`}
                onClick={toggleTextWrap}
                title="Toggle text wrapping"
              >
                {textWrap ? "🔤 Wrap On" : "📄 Wrap Off"}
              </button>

              <button
                className={`btn ${autoHeight ? "btn-primary" : "btn-secondary"}`}
                onClick={toggleAutoHeight}
                title="Toggle auto height"
              >
                {autoHeight ? "📏 Auto Height On" : "📐 Auto Height Off"}
              </button>
            </div>

            <button className="btn btn-secondary" onClick={() => handleExport("excel")}>
              Export Excel
            </button>

            <button className="btn btn-secondary" onClick={() => handleExport("csv")}>
              Export CSV
            </button>

            {Object.keys(filters || {}).length > 0 && (
              <button
                onClick={handleResetFilter}
                className="btn btn-secondary"
              >
                Reset Filters
              </button>
            )}

           {Boolean(hasAddColumnAccess) && <button
              onClick={() => setShowAddColumnModal(true)}
              className="btn btn-primary"
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                cursor: "pointer",
                transition: "0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span style={{ fontSize: "16px" }}>+</span> Add Column
            </button>}
            <button
              onClick={addRow}
              className="btn btn-secondary"
            >
              + Add Row
            </button>

            <button
              onClick={saveAll}
              disabled={!isDirty || saving}
              className={`btn btn-save ${isDirty ? "active" : ""}`}
            >
              {isDirty && <span className="unsaved-dot" />} {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyNavigation}
        ref={containerRef}
        style={{
          height: "450px",
          overflowY: "auto",
          overflowX: "auto",
          position: "relative",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "14px",
            tableLayout: "fixed", // Keep this but we'll handle it better
          }}
        >
          <thead>
            <tr>
              {/* Row Number Header */}
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  top: 0,
                  background: "#fafafa",
                  zIndex: 30,
                  padding: "12px 14px",
                  fontWeight: 500,
                  color: "#64748b",
                  borderBottom: "1px solid #e2e8f0",
                  width: 70,
                  minWidth: 70,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  #
                </div>
              </th>

              {reorderedColumns.map((col) => {
                const isFrozen = frozenColumns.includes(col.key);
                const isResizingThis = resizingColumn === col.key;

                return (
                  <th
                    key={col.key}
                    onClick={() => {
                      if (isResizing.current) return;
                      setEditing(null);
                      setActiveColumn(col);
                      setShowModal(true);
                    }}
                    style={{
                      position: isFrozen ? "sticky" : "relative",
                      left: isFrozen ? 70 : "auto",
                      top: 0,
                      background: "#ffffff",
                      padding: "12px 14px",
                      textAlign: "left",
                      fontWeight: 500,
                      color: "#475569",
                      borderBottom: "1px solid #e2e8f0",
                      cursor: "pointer",
                      zIndex: isFrozen ? 20 : 10,
                      width: columnWidths[col.key] || 180, // Use stored width or default
                      minWidth: columnWidths[col.key] || 180, // Ensure minimum width
                      maxWidth: columnWidths[col.key] || 180, // Ensure maximum width
                      backgroundColor: isFrozen ? "#f8fafc" : "#ffffff",
                      borderRight: isFrozen ? "2px solid #cbd5e1" : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>{col.label}</span>

                      <div className="d-flex gap-1 align-items-center">
                        <span
                          className="freeze-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFreezeColumn(col.key);
                          }}
                          style={{
                            cursor: "pointer",
                            color: isFrozen ? "#3b82f6" : "#94a3b8",
                            fontSize: "14px",
                          }}
                          title={isFrozen ? "Unfreeze column" : "Freeze column"}
                        >
                          {isFrozen ? "❄️" : "⛄"}
                        </span>

                        <span style={{ fontSize: "20px", color: "#3b82f6" }}>
                          {Boolean(filters[col.key]) && <CiFilter />}
                        </span>
                        <span style={{ fontSize: "12px", color: "#3b82f6" }}>
                          {sortConfig?.key === col.key &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </span>
                      </div>
                    </div>

                    {/* Resize handle with icon */}
                    {/* Improved Resize handle with better icon */}
                    <div
                      className={`column-resizer ${isResizingThis ? 'resizing' : ''}`}
                      onMouseDown={(e) => startColumnResize(e, col.key)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "20px",
                        height: "100%",
                        cursor: "col-resize",
                        zIndex: 1000, // Increased z-index
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.5, // Always slightly visible
                        transition: "opacity 0.2s ease",
                        background: isResizingThis ? "rgba(59, 130, 246, 0.1)" : "transparent",
                      }}
                      title="Drag to resize column"
                    >
                      {/* Vertical dots/grip indicator */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px",
                          height: "40px",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: isResizingThis ? "#3b82f6" : "#94a3b8",
                            transition: "all 0.2s ease",
                          }}
                        />
                        <div
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: isResizingThis ? "#3b82f6" : "#94a3b8",
                            transition: "all 0.2s ease",
                          }}
                        />
                        <div
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: isResizingThis ? "#3b82f6" : "#94a3b8",
                            transition: "all 0.2s ease",
                          }}
                        />
                      </div>

                      {/* Vertical line indicator */}
                      <div
                        style={{
                          width: "2px",
                          height: "60%",
                          background: isResizingThis ? "#3b82f6" : "#cbd5e1",
                          borderRadius: "2px",
                          marginLeft: "2px",
                          transition: "all 0.2s ease",
                        }}
                      />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {grid.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  transition: "background 0.15s ease",
                  height: rowHeights[rowIndex] || 44,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Row Number */}
                <td
                  className="row-header-cell"
                  style={{
                    position: "sticky",
                    left: 0,
                    width: "70px",
                    minWidth: "70px",
                    background: "#fafafa",
                    zIndex: 25,
                    padding: "10px 14px",
                    borderBottom: "1px solid #f1f5f9",
                    color: "#64748b",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  <span>{rowIndex + 1}</span>

                  {hasDeleteAccess && (
                    <MdDelete
                      className="delete-icon"
                      onClick={() => deleteRow(row._id, rowIndex)}
                    />
                  )}

                  <div
                    onMouseDown={(e) => startRowResize(e, rowIndex)}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "6px",
                      cursor: "row-resize",
                    }}
                  />
                </td>

                {reorderedColumns.map((col, colIndex) => {
                  const isEditing =
                    editing?.row === rowIndex && editing?.key === col.key;

                  const active =
                    activeCell?.row === rowIndex &&
                    activeCell?.col === colIndex;

                  const isFrozen = frozenColumns.includes(col.key);

                  return (
                    <td
                      key={col.key}
                      onClick={() => selectCell(rowIndex, colIndex)}
                      onDoubleClick={() =>
                        setEditing({ row: rowIndex, key: col.key })
                      }
                      style={{
                        padding: "10px 14px",
                        width: columnWidths[col.key] || 180, // Match header width
                        minWidth: columnWidths[col.key] || 180,
                        maxWidth: columnWidths[col.key] || 180,
                        borderBottom: "1px solid #f1f5f9",
                        position: isFrozen ? "sticky" : "relative",
                        left: isFrozen ? 70 : "auto",
                        background: active ? "#f0f9ff" : "transparent",
                        cursor: "pointer",
                        zIndex: isFrozen ? 15 : 1,
                        backgroundColor: isFrozen ? (active ? "#f0f9ff" : "#f8fafc") : (active ? "#f0f9ff" : "transparent"),
                        borderRight: isFrozen ? "1px solid #cbd5e1" : "none",
                        whiteSpace: textWrap ? "normal" : "nowrap",
                        wordWrap: textWrap ? "break-word" : "normal",
                        overflow: textWrap ? "visible" : "hidden",
                        textOverflow: textWrap ? "clip" : "ellipsis",
                        verticalAlign: "top",
                      }}
                    >
                      {active && (
                        <div
                          style={{
                            position: "absolute",
                            inset: "2px",
                            border: "2px solid #3b82f6",
                            borderRadius: "6px",
                            pointerEvents: "none",
                          }}
                        />
                      )}

                      {isEditing ? (
                        renderInputByType(col, row[col.key], rowIndex)
                      ) : (
                        <div
                          style={{
                            whiteSpace: textWrap ? "normal" : "nowrap",
                            overflow: textWrap ? "visible" : "hidden",
                            textOverflow: textWrap ? "clip" : "ellipsis",
                            color: "#1e293b",
                            wordWrap: textWrap ? "break-word" : "normal",
                          }}
                        >
                          {renderInputValue(row, col)}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LeadColumnFilter
        showModal={showModal}
        filters={filters}
        setShowModal={setShowModal}
        activeColumn={activeColumn}
        setSortConfig={setSortConfig}
        sortConfig={sortConfig}
        setFilters={setFilters}
        getSaleEmp={getSaleEmp}
        handleApply={getFilterData}
      />

      <AddLeadColumn show={showAddColumnModal} onClose={()=>setShowAddColumnModal(false)} addColumnApi={addLeadColumnApi} refetchColumnData={refetchColumnData}/>

      <style>
        {`
.modern-input {
  position: absolute;
  inset: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);

  border: 2px solid #3b82f6;
  border-radius: 8px;

  padding: 8px 10px;

  font-size: 14px;
  font-family: inherit;
  color: #1e293b;

  background: #ffffff;

  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);

  transition: all 0.15s ease;
  
  resize: none;
  overflow: auto;
}

.modern-input[type="date"] {
  padding: 6px 10px;
}

.modern-input[type="number"] {
  padding: 6px 10px;
}

.modern-input select,
.modern-input .async-select {
  width: 100%;
  height: 100%;
}

th {
  position: relative;
}

/* Resize handle */
.column-resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.column-resizer::after {
  content: "";
  width: 2px;
  height: 60%;
  background: transparent;
  transition: 0.2s ease;
}

th:hover .column-resizer::after {
  background: #cbd5e1;
}

  th:hover .column-resizer {
    opacity: 1 !important;
  }
  
  .column-resizer:hover {
    background: rgba(59, 130, 246, 0.1) !important;
  }
  
  .column-resizer:hover div div{
     background: #3b82f6 !important;
    transform: scale(1.2);
  }
  .column-resizer:hover div:last-child {
    background: #3b82f6 !important;
  }

   /* Active resizing state */
  .column-resizer.resizing {
    opacity: 1 !important;
    background: rgba(59, 130, 246, 0.15) !important;
  }
  
  .column-resizer.resizing div div {
    background: #3b82f6 !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  .column-resizer.resizing div:last-child {
    background: #3b82f6 !important;
    width: 3px;
  }
  
  /* Visual indicator while dragging */
  .column-resizer::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: transparent;
    transition: all 0.2s ease;
  }
  
  .column-resizer.resizing::after {
    background: #3b82f6;
    box-shadow: 0 0 8px #3b82f6;
  }
  
  /* Prevent text selection during resize */
  body.resizing-active {
    user-select: none;
    cursor: col-resize;
  }

.row-header-cell {
  position: relative;
}

.delete-icon {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.row-header-cell:hover .delete-icon {
  opacity: 0.7;
  color: red;
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  flex-wrap: wrap;
  gap: 12px;
}

.lead-header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.record-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.record-count {
  font-weight: 600;
  font-size: 15px;
  color: #111827;
}

.loading-text {
  font-size: 13px;
  color: #64748b;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.lead-header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 500;
}

.btn-primary {
  background: #111827;
  color: white;
}

.btn-primary:hover {
  background: #1f2937;
}

.btn-secondary {
  background: #f3f4f6;
  color: #111827;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-save {
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-save:hover:not(:disabled) {
  background: #059669;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-group {
  display: flex;
  gap: 5px;
  background: #f3f4f6;
  padding: 3px;
  border-radius: 8px;
}

.btn-group .btn {
  padding: 6px 12px;
}

.unsaved-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  display: inline-block;
}

/* Badge styles */
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.bg-primary { background-color: #3b82f6; }
.bg-success { background-color: #10b981; }
.bg-danger { background-color: #ef4444; }
.bg-warning { background-color: #f59e0b; }
.bg-orange { background-color: #f97316; }
.bg-secondary { background-color: #6b7280; }
.bg-yellow { background-color: #eab308; }

.text-white { color: white; }

/* Frozen column indicator */
th[style*="position: sticky"]::after {
  content: '';
  position: absolute;
  top: 0;
  right: -2px;
  width: 2px;
  height: 100%;
  background: #cbd5e1;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Auto height textarea for editing */
.modern-input[type="text"] {
  resize: vertical;
  min-height: 36px;
}
`}
      </style>
    </div>
  );
}
