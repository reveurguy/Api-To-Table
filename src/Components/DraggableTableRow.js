import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";
import styled from "styled-components";

const DraggingRow = styled.td`
  background: rgb(220 232 254 / 30%);
`;

const TableData = styled.td`
  background: white;
`;

export const DraggableTableRow = ({ row }) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging
  } = useSortable({
    id: row.original.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
  };
  return (
    <tr ref={setNodeRef} style={style} {...row.getRowProps()}>
      {isDragging ? (
        <DraggingRow colSpan={row.cells.length}>&nbsp;</DraggingRow>
      ) : (
        row.cells.map((cell, i) => {
          if (i === 0) {
            return (
              <TableData {...cell.getCellProps()}>
                <DragHandle {...attributes} {...listeners} />
                <span>{cell.render("Cell")}</span>
              </TableData>
            );
          }
          return (
            <TableData {...cell.getCellProps()}>
              {cell.render("Cell")}
            </TableData>
          );
        })
      )}
    </tr>
  );
};
