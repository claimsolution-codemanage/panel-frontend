

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { formatDateToISO, getFormateDMYDate } from "../../../../utils/helperFunction";
import AsyncSelect from 'react-select/async';
import { MdDelete, MdOutlineWidthNormal, MdWidthNormal } from "react-icons/md";
import LeadColumnFilter from "./LeadColumnFilter";
import { CiFilter } from "react-icons/ci";
import { toast } from "react-toastify";
import { BiMessageSquareEdit } from "react-icons/bi";
import AddLeadColumn from "./AddLeadColumn";
import EditColumnModal from "./EditColumnModal";
import LeadFollowUpModal from "./LeadFollowUpModal";
import { BsChatDots } from "react-icons/bs";
const STORAGE_KEY = "leadEngine_columnWidths_v1";
import { debounce } from 'lodash';
import LeadTableHeader from "./LeadTableHeader";
import "../../../../styles/lead/leadTable.css"
import LeadDetailOffcanvas from "./LeadDetailOffcanvas";

export default function LeadExcelTable({ columns, setRows, rows, addOrUpdateLeadApi, getSaleEmp, deleteLeadApi, getFilterData, filters, sortConfig,
  setFilters, setSortConfig, containerRef, loading, handleExport, hasDeleteAccess, addLeadColumnApi, refetchColumnData, hasAddColumnAccess,
  hasUpdateColumnAccess, updateColumnApi, refetchColumn, addOrUpdateLeadFollowUpApi, getLeadFollowUpsApi
}) {
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
  const [showEditColumnModal, setShowEditColumnModal] = useState(false);
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

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

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
  const [templateDropdown, setTemplateDropdown] = useState(null)
  const [showDetailOffcanvas, setShowDetailOffcanvas] = useState(false);
  const [selectedLeadIndex, setSelectedLeadIndex] = useState(-1);
  const [selectedLeadData, setSelectedLeadData] = useState({});


  // Track if auto-save is in progress
  const autoSaveTimeoutRef = useRef(null);
  const isAutoSavingRef = useRef(false);

  const toggleTemplateDropdown = (row, key) => {
    const id = `${row}-${key}`
    setTemplateDropdown(prev => (prev === id ? null : id))
  }

  const isTemplateOpen = (row, key) => {
    return templateDropdown === `${row}-${key}`
  }

  const closeTemplateDropdown = () => setTemplateDropdown(null)

  const today = new Date().toISOString().split("T")[0];

  const debouncedAutoSave = useCallback(
    debounce(async () => {
      if (dirtyRows.size === 0 || isAutoSavingRef.current) {
        return;
      }

      console.log('Auto-saving...', dirtyRows.size, 'rows');
      await saveAll(true); // true indicates auto-save
    }, 3000), // 3 seconds delay
    [dirtyRows]
  );

  // Trigger auto-save when dirtyRows changes
  useEffect(() => {
    if (dirtyRows.size > 0) {
      debouncedAutoSave();
    }

    // Cleanup on unmount
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [dirtyRows, debouncedAutoSave, isDirty]);


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
      createdAt: r?.createdAt ? formatDateToISO(r?.createdAt) : new Date(),
      updatedAt: r?.updatedAt ? formatDateToISO(r?.updatedAt) : new Date(),
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

  async function saveAll(isAutoSave = false) {
    if (dirtyRows.size === 0) return;

    if (isAutoSave) {
      if (isAutoSavingRef.current) {
        console.log('Auto-save already in progress');
        return;
      }
      isAutoSavingRef.current = true;
      console.log('Starting auto-save...');
    } else {
      setSaving(true);
    }
    try {

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
      isAutoSavingRef.current = false;
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
              commonProps?.value?.trim()
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

      case "textTemplate":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              position: "relative"
            }}
            className="m-0 p-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* ✅ Always text input */}
            <input type="text" {...commonProps} />

            {/* ✅ Template dropdown trigger */}
            <div style={{ position: "relative" }}>
              <span
                style={{
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "100%",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px"
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTemplateDropdown(rowIndex, col.key)
                }}
              >
                ⚡
              </span>

              {/* ✅ Dropdown */}
              {isTemplateOpen(rowIndex, col.key) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    // background: "#fff",
                    backgroundColor: 'white',
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 9999,
                    minWidth: "200px",
                    maxHeight: "200px",
                    overflowY: "auto"
                  }}
                >
                  {col.options?.map((tpl, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        updateCell(rowIndex, col.key, tpl)
                        closeTemplateDropdown()
                      }}
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontSize: "13px"
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f8fafc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {tpl}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const addRow = () => {
    const empty = {};
    columns.forEach((c) => (empty[c.key] = ""));
    empty.createdAt = new Date().toISOString()
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
        <span className={col.systemField ? "" : getFollowUpClass(row[col.key])}>
          {getFormateDMYDate(row[col.key])}
        </span>
      );
    }

    // if (col.type === "date" && row[col.key]) {
    //   return getFormateDMYDate(row[col.key]);
    // }

    return row[col?.key]?.label ?? row[col.key];
  };


  // Handle follow-up added - Update grid state without refreshing all rows
  const handleFollowUpAdded = (updatedLead, rowIndex) => {
    if (!updatedLead || rowIndex === undefined) return;

    // Update grid state directly (without waiting for rows useEffect)
    setGrid(prev => {
      const updatedGrid = [...prev];
      if (updatedGrid[rowIndex]) {
        if (updatedLead._id && !updatedGrid[rowIndex]._id) {
          updatedGrid[rowIndex]._id = updatedLead._id;
        }

        if (updatedLead.next_follow_up_date) {
          updatedGrid[rowIndex].next_follow_up_date = updatedLead.next_follow_up_date;
        }

        if (updatedLead.data) {
          Object.keys(updatedLead.data).forEach(key => {
            if (updatedGrid[rowIndex].hasOwnProperty(key)) {
              updatedGrid[rowIndex][key] = updatedLead.data[key];
            }
          });
        }
      }
      return updatedGrid;
    });

    if (dirtyRows.has(rowIndex)) {
      setDirtyRows(prev => {
        const updatedDirtyRows = new Set(prev);
        updatedDirtyRows.delete(rowIndex);
        return updatedDirtyRows;
      });
      if (dirtyRows.size === 0) {
        setIsDirty(false);
      }
    }
  };

  // Add function to open modal
  const openFollowUpModal = (lead, rowIndex) => {
    setSelectedLead({ ...lead, rowIndex });
    setShowFollowUpModal(true);
  };

  const renderFollowUpCell = (row, col, rowIndex) => {
    return (
      <button
        onClick={() => openFollowUpModal(row, rowIndex)}
        className="follow-up-btn"
        style={{
          background: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "12px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <BsChatDots size={14} />
        {row[col.key] && <span className={getFollowUpClass(row[col.key])}>
          {getFormateDMYDate(row[col.key])}
        </span>}
      </button>
    );
  };

  // offcanvas
  const handleRowClick = (rowIndex) => {
    const rowData = grid[rowIndex];
    if (rowData) {
      setSelectedLeadIndex(rowIndex);
      setSelectedLeadData(rowData);
      setShowDetailOffcanvas(true);
    }
  };

  const reorderedColumns = columns

  return (
    <div>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}
      >

        <LeadTableHeader columns={columns} grid={grid} loading={loading} isDirty={isDirty} saving={saving} addRow={addRow} saveAll={saveAll} toggleTextWrap={toggleTextWrap} textWrap={textWrap} toggleAutoHeight={toggleAutoHeight} autoHeight={autoHeight} hasAddColumnAccess={hasAddColumnAccess} setShowAddColumnModal={setShowAddColumnModal} handleExport={handleExport} filters={filters} handleResetFilter={handleResetFilter} />

        {/* Grid */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyNavigation}
          ref={containerRef}
          style={{
            height: "450px",
            overflow: "auto", // Changed to auto for both scrollbars
            position: "relative",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: "14px",
              tableLayout: "fixed",
              minWidth: "100%", // Ensure table takes full width
            }}
          >
            <thead>
              <tr>
                {/* Row Number Header - Sticky both left and top */}
                <th
                  style={{
                    position: "sticky",
                    left: 0,
                    top: 0,
                    background: "#fafafa",
                    zIndex: 40, // Higher z-index to stay above frozen columns
                    padding: "12px 14px",
                    fontWeight: 500,
                    color: "#64748b",
                    borderBottom: "1px solid #e2e8f0",
                    borderRight: "1px solid #e2e8f0",
                    width: 70,
                    minWidth: 70,
                    maxWidth: 70,
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
                        position: "sticky", // Always sticky for header
                        top: 0, // Sticky top for all headers
                        left: isFrozen ? 70 : "auto", // Left position only for frozen columns
                        background: "#ffffff",
                        padding: "12px 14px",
                        textAlign: "left",
                        fontWeight: 500,
                        color: "#475569",
                        borderBottom: "1px solid #e2e8f0",
                        cursor: "pointer",
                        zIndex: isFrozen ? 35 : 30, // Frozen columns higher z-index
                        width: columnWidths[col.key] || 180,
                        minWidth: columnWidths[col.key] || 180,
                        maxWidth: columnWidths[col.key] || 180,
                        backgroundColor: isFrozen ? "#f8fafc" : "#ffffff",
                        borderRight: isFrozen ? "2px solid #cbd5e1" : "none",
                        boxShadow: isFrozen ? "2px 0 5px -2px rgba(0,0,0,0.1)" : "none",
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
                          {Boolean(hasUpdateColumnAccess) && <span
                            data-tooltip="Edit"
                            data-tooltip-position="bottom"
                            className="freeze-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveColumn(col);
                              setShowEditColumnModal(true);
                            }}
                            style={{
                              cursor: "pointer",
                              color: "#94a3b8",
                              fontSize: "14px",
                            }}
                          >
                            <BiMessageSquareEdit className="fs-5" />
                          </span>
                          }
                          <span
                            className="freeze-icon"
                            data-tooltip={isFrozen ? "Unfreeze column" : "Freeze column"}
                            data-tooltip-position="bottom"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFreezeColumn(col.key);
                            }}
                            style={{
                              cursor: "pointer",
                              color: isFrozen ? "#3b82f6" : "#94a3b8",
                              fontSize: "14px",
                            }}
                          // title={isFrozen ? "Unfreeze column" : "Freeze column"}
                          >
                            {isFrozen ? <MdWidthNormal className="fs-5" /> : <MdOutlineWidthNormal className="fs-5" />}
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
                      <div
                        className={`column-resizer ${isResizingThis ? 'resizing' : ''}`}
                        onMouseDown={(e) => startColumnResize(e, col.key)}
                        data-tooltip="Resize"
                        data-tooltip-position="bottom"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "20px",
                          height: "100%",
                          cursor: "col-resize",
                          zIndex: 1000,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.5,
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
                  {/* Row Number - Sticky left only */}
                  <td
                    className="row-header-cell"
                    onClick={() => handleRowClick(rowIndex)}
                    style={{
                      position: "sticky",
                      left: 0,
                      background: "#fafafa",
                      zIndex: 25,
                      padding: "10px 14px",
                      borderBottom: "1px solid #f1f5f9",
                      borderRight: "1px solid #e2e8f0",
                      color: "#64748b",
                      fontWeight: 500,
                      textAlign: "center",
                      width: "70px",
                      minWidth: "70px",
                      maxWidth: "70px",
                      boxShadow: "2px 0 5px -2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span>{rowIndex + 1}</span>

                    {hasDeleteAccess && (
                      <MdDelete
                        className="delete-icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening offcanvas
                          deleteRow(row._id, rowIndex);
                        }}
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
                        onDoubleClick={() => {
                          if (col?.systemField) {
                            handleRowClick(rowIndex)
                          } else {
                            setEditing({ row: rowIndex, key: col.key })
                          }

                        }}
                        style={{
                          padding: "10px 14px",
                          width: columnWidths[col.key] || 180,
                          minWidth: columnWidths[col.key] || 180,
                          maxWidth: columnWidths[col.key] || 180,
                          borderBottom: "1px solid #f1f5f9",
                          position: isFrozen ? "sticky" : "relative",
                          left: isFrozen ? 70 : "auto",
                          background: active ? "#f0f9ff" : "transparent",
                          cursor: "pointer",
                          // zIndex: isFrozen ? 20 : 1,
                          zIndex: active ? 999 : (isFrozen ? 20 : 1),
                          backgroundColor: isFrozen
                            ? (active ? "#f0f9ff" : "#f8fafc")
                            : (active ? "#f0f9ff" : "transparent"),
                          borderRight: isFrozen ? "2px solid #cbd5e1" : "none",
                          whiteSpace: textWrap ? "normal" : "nowrap",
                          wordWrap: textWrap ? "break-word" : "normal",
                          // overflow: textWrap ? "visible" : "hidden",
                          overflow: active ? "visible" : (textWrap ? "visible" : "hidden"),
                          textOverflow: textWrap ? "clip" : "ellipsis",
                          verticalAlign: "top",
                          boxShadow: isFrozen ? "2px 0 5px -2px rgba(0,0,0,0.1)" : "none",
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
                              // overflow: textWrap ? "visible" : "hidden",
                              textOverflow: textWrap ? "clip" : "ellipsis",
                              color: "#1e293b",
                              wordWrap: textWrap ? "break-word" : "normal",
                              zIndex: 999
                            }}
                          >
                            {col.key === 'next_follow_up_date'
                              ? renderFollowUpCell(row, col, rowIndex)
                              : renderInputValue(row, col)
                            }
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

        <EditColumnModal showModal={showEditColumnModal} setShowModal={setShowEditColumnModal} column={activeColumn} refetchColumn={refetchColumn} updateColumnApi={updateColumnApi} />

        <AddLeadColumn show={showAddColumnModal} onClose={() => setShowAddColumnModal(false)} addColumnApi={addLeadColumnApi} refetchColumnData={refetchColumnData} />

      </div>
      <LeadFollowUpModal
        show={showFollowUpModal}
        onHide={() => setShowFollowUpModal(false)}
        lead={selectedLead}
        onFollowUpAdded={handleFollowUpAdded}
        addOrUpdateLeadFollowUpApi={addOrUpdateLeadFollowUpApi}
        getLeadFollowUpsApi={getLeadFollowUpsApi}
        columns={columns}
      />

      <LeadDetailOffcanvas
        show={showDetailOffcanvas}
        onHide={() => {
          setShowDetailOffcanvas(false);
          setSelectedLeadData({});
          setSelectedLeadIndex(-1);
        }}
        leadData={selectedLeadData}
        rowIndex={selectedLeadIndex}
        columns={columns}
        grid={grid}
        onUpdateCell={updateCell}
        fetchOptions={fetchOptions}
        formatDateToISO={formatDateToISO}
        getFormateDMYDate={getFormateDMYDate}
        getStatusClass={getStatusClass}
        getFollowUpClass={getFollowUpClass}
        toggleTemplateDropdown={toggleTemplateDropdown}
        closeTemplateDropdown={closeTemplateDropdown}
        isTemplateOpen={isTemplateOpen}
        isSaving={saving}
        renderFollowUpCell={renderFollowUpCell}
      />
    </div>
  );
}
