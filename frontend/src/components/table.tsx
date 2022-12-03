import * as React from "react";
import { useMemo } from "react";
import capitalize from "lodash/capitalize";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type TableProps = {
  data: any[] | undefined;
  sx?: {};
};

function SkeletonRow() {
  return (
    <>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
    </>
  );
}

function SkeletonTable() {
  return (
    <>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
      <TableRow>
        <SkeletonRow />
      </TableRow>
    </>
  );
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

export default function Table({ data, sx }: TableProps) {
  const loading = useMemo(() => isUndefined(data) || isEmpty(data), [data]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid rgb(229, 231, 235)",
        borderRadius: 3,
        boxShadow: "0 2px 5px -4px rgba(0,0,0,0.34)",
        maxHeight: 800,
        ...sx,
      }}
    >
      <MuiTable sx={{ minWidth: 500 }} aria-label="simple table" stickyHeader>
        <TableHead sx={{ bgcolor: "grey.100" }}>
          <TableRow>
            {loading ? (
              <SkeletonRow />
            ) : (
              Object.entries(data[0])
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <TableCell key={`${data[0]["id"]}-${key}`}>
                    {capitalize(key)}
                  </TableCell>
                ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <SkeletonTable />
          ) : (
            data.map((datum) => (
              <TableRow
                key={datum["id"]}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {Object.entries(datum)
                  .filter(([key]) => key !== "id")
                  .map(([key]) => (
                    <TableCell key={`${datum["id"]}-${datum[key]}`}>
                      {datum[key]}
                    </TableCell>
                  ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
