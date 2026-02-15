

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
import { exportToCSV, exportToExcel } from "../../../../utils/exportUtils";
const STORAGE_KEY = "leadEngine_columnWidths_v1";

export default function LeadExcelTable({ columns, rows, addOrUpdateLeadApi, getSaleEmp, deleteLeadApi, getFilterData, filters, sortConfig, setFilters, setSortConfig, containerRef, loading, handleExport, hasDeleteAccess }) {
  const inputRef = useRef();
  const [grid, setGrid] = useState([]);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [editing, setEditing] = useState(null); // {row, key}
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [rowHeights, setRowHeights] = useState({});
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnWidths));
  }, [columnWidths]);


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
  }, [rows]);

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
          // saveRow(rowIndex);

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
              menuPortalTarget={document.body}   // 🔥 important for z-index issues
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
  };

  const deleteRow = async (id, index) => {
    if (id) {
      try {
        const result = await deleteLeadApi({ _id: id });
        setGrid((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        toast.error(error?.response?.data?.message ?? "Failed to delete lead")
      }
    }
  };

  const selectCell = async (rowIndex, colIndex) => {
    if (editing) {
      const editingRow = editing.row;
      setEditing(null);

      // await saveRow(editingRow); // ✅ single save point
    }

    setActiveCell({ row: rowIndex, col: colIndex });
  };


  const moveActive = (row, col) => {
    // if (editing) return;
    const maxRow = grid.length - 1;
    const maxCol = columns.length - 1;

    if (row < 0) row = 0;
    if (col < 0) col = 0;
    if (row > maxRow) row = maxRow;
    if (col > maxCol) col = maxCol;

    selectCell(row, col);   //
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

      // setTimeout(() => {
      //   if (inputRef.current) {
      //     inputRef.current.focus();
      //     inputRef.current.value = e.key;
      //   }
      // }, 0);
      setTimeout(() => {
        updateCell(activeCell.row, colKey, e.key);
      }, 0);
    }

  };

  const startColumnResize = (e, key) => {
    e.stopPropagation();
    isResizing.current = true;

    const startX = e.clientX;
    const startWidth = columnWidths[key];

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.max(120, startWidth + (moveEvent.clientX - startX));

      setColumnWidths((prev) => ({
        ...prev,
        [key]: newWidth,
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Small delay so click doesn't trigger
      setTimeout(() => {
        isResizing.current = false;
      }, 0);
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
      {/* Toolbar */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
          borderBottom: "1px solid #f1f5f9",
          background: "#fafafa",
        }}
      >
        <div>
          <span>{totalRecord} Records</span>
          <span>{loading ? "Loading..." : ""}</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <IoCloudDoneOutline />
            {saving ? "Saving..." : "All changes saved"}
          </div>
        </div>

        <div className="d-flex gap-2">


          {Boolean(filters) && Boolean(Object.keys(filters).length) && <button
            onClick={handleResetFilter}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
          >
            Reset Filters
          </button>}
          <button
            onClick={addRow}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
          >
            + Add Row
          </button>
        </div>
      </div> */}
      <div className="lead-header">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <div className="lead-header-actions">
          <div style={{ marginBottom: "12px", display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={() =>handleExport("excel")}>
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

          <button
            onClick={addRow}
            className="btn btn-secondary"
          >
            + Add Row
          </button>

          {/* 🔥 SAVE BUTTON */}
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
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "14px",
            tableLayout: "fixed",
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
                  zIndex: 20,
                  padding: "12px 14px",
                  fontWeight: 500,
                  color: "#64748b",
                  borderBottom: "1px solid #e2e8f0",
                  width: 50,
                  // position: "relative",
                }}
              >
                #
              </th>

              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => {
                    if (isResizing.current) return; //
                    setEditing(null);
                    setActiveColumn(col);
                    setShowModal(true);
                  }}
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#ffffff",
                    padding: "12px 14px",
                    textAlign: "left",
                    fontWeight: 500,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                    cursor: "pointer",
                    zIndex: 10,
                    width: columnWidths[col.key],

                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{col.label}</span>

                    <div className="d-flex gap-1 align-items-center">
                      <span style={{ fontSize: "20px", color: "#3b82f6" }}>
                        {Boolean(filters[col.key]) && <CiFilter />}
                      </span>
                      <span style={{ fontSize: "12px", color: "#3b82f6" }}>
                        {sortConfig?.key === col.key &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </div>
                  <div
                    className="column-resizer"
                    onMouseDown={(e) => { e.stopPropagation(); startColumnResize(e, col.key) }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "6px",
                      height: "100%",
                      cursor: "col-resize",
                      zIndex: 30,
                    }}
                  />
                </th>
              ))}
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
                    zIndex: 50,
                    padding: "10px 14px",
                    borderBottom: "1px solid #f1f5f9",
                    color: "#64748b",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  <span>{rowIndex + 1}</span>

                  {hasDeleteAccess && <MdDelete
                    className="delete-icon"
                    onClick={() => deleteRow(row._id, rowIndex)}
                  />}

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


                {columns.map((col, colIndex) => {
                  const isEditing =
                    editing?.row === rowIndex && editing?.key === col.key;

                  const active =
                    activeCell?.row === rowIndex &&
                    activeCell?.col === colIndex;

                  return (
                    <td
                      key={col.key}
                      onClick={() => selectCell(rowIndex, colIndex)}
                      onDoubleClick={() =>
                        setEditing({ row: rowIndex, key: col.key })
                      }
                      style={{
                        padding: "10px 14px",
                        minWidth: "180px",
                        borderBottom: "1px solid #f1f5f9",
                        position: "relative",
                        background: active ? "#f0f9ff" : "transparent",
                        cursor: "pointer",
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
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#1e293b",
                          }}
                        >
                          {col?.type === "date" && row[col.key]
                            ? getFormateDMYDate(row[col.key])
                            : row[col?.key]?.label ?? row[col.key]}
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
      <style>
        {
          `.modern-input {
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
  color:red;
}


/* Show visual line only on hover */
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

.unsaved-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  margin-left: 6px;
}


`
        }
      </style>
    </div>
  );

}
