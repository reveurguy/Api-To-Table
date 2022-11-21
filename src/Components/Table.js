import React, { useState, useMemo } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableTableRow } from "./DraggableTableRow";
import { StaticTableRow } from "./StaticTableRow";

export default function Table({ columns, data, setData }) {
  const [activeId, setActiveId] = useState();
  const [Name, setName] = useState("");
  const [Gender, setGender] = useState("");
  const [Status, setStatus] = useState("");
  const [Address, setAddress] = useState("");
  const [Count, setCount] = useState("");

  const items = useMemo(() => data.map(({ id }) => id), [data]);


  const genderList = ["Male", "Female", "Polygender", "Agender", "Genderfluid", "Non-binary", "Genderqueer", "Bigender"];
  const statusList = ["Active", "Idle", "Blocked", "Pending"];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    nextPage,
    setPageSize,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      data,
      columns,
      initialState: { pageIndex: 1}
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setData((data) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const selectedRow = useMemo(() => {
    if (!activeId) {
      return null;
    }
    const row = page.find(({ original }) => original.id === activeId);
    prepareRow(row);
    return row;
  }, [activeId, page, prepareRow]);

  const handleName = e => {
    const value = e.target.value || undefined;
    setFilter("name", value);
    setName(value);
  };

  const handleAddress = e => {
    const value = e.target.value || undefined;
    setFilter("address.combined", value);
    setAddress(value);
  };

  const handleCount = e => {
    const value = setPageSize(Number(e.target.value));
    setCount(value);

  };

  const handleGender = e => {
    const value = e.target.value || undefined;
    setFilter("gender", value);
    setGender(value);
  };

  const handleStatus = e => {
    const value = e.target.value || undefined;
    setFilter("subscription.status", value);
    setStatus(value);
  };

  function Reset() {
    const reset = ""
    setPageSize(Number(10));
    setFilter("name", reset);
    setName(reset);
    setFilter("address.combined", reset);
    setAddress(reset);
    setCount(reset);
    setFilter("gender", reset);
    setGender(reset);
    setFilter("subscription.status", reset);
    setStatus(reset);
  }

  return (
    <>
      <div className="users">
        <h2>Users ({data.length})</h2>
        <button id="reset" type="reset" onClick={Reset}>Reset</button>
      </div>

      <div className="row">
        <div>
          <label>Search by Name</label>
          <input
            value={Name}
            onChange={handleName}
            placeholder={"Search by Name"}
          />
        </div>

        <div>
          <label>Search by Address</label>
          <input
            value={Address}
            onChange={handleAddress}
            placeholder={"Search by Address"}
          />
        </div>

        <div>
          <label>Count</label>
          <select
            value={Count}
            onChange={handleCount}
            placeholder={"10"}
          >
            <option value="" disabled selected>Select count</option>
            {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
          </select>
        </div>

        <div>
          <label>Gender</label>
          <select
            value={Gender}
            onChange={handleGender}
            placeholder={"Search by Address"}
          >
            <option value="" disabled selected>Select gender</option>
            <option value="">All</option>
            {genderList.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Subscription Status</label>
          <select
            value={Status}
            onChange={handleStatus}
          >
            <option value="" disabled selected>Select status</option>
            <option value="">All</option>
            {statusList.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

      </div>

      <span id="count">
        <strong>
          Showing {' '}
          { data.length === 0 ? pageSize * 0 : pageSize * pageIndex + 1 } - { data.length === 0 ? pageSize * 0 : pageSize * pageIndex + page.length} of {data.length}
        </strong>{' '}
      </span>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} id='tint'>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "sort-desc"
                          : "sort-asc"
                        : ""
                    }
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <DraggableTableRow key={row.original.id} row={row}></DraggableTableRow>
                );

              })}
            </SortableContext>
          </tbody>
        </table>
        <DragOverlay>
          {activeId && (
            <table style={{ width: "100%" }}>
              <tbody>
                <StaticTableRow row={selectedRow} />
              </tbody>
            </table>
          )}
        </DragOverlay>
      </DndContext>

      <div className="pagination">
        <button id="btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button id="btn" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
      </div>
    </>
  );
}