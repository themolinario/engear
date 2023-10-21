import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Tooltip } from "@mui/material";

export default function BasicTable({ header, rows }: { header: any, rows: any }) {
  return (
    <TableContainer component={Paper} sx={{ marginLeft: "36px", marginTop: "50px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map((value: string) => (
              <TableCell key={value} align="center"><strong>{value}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow
              key={row.ip}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.ip}
              </TableCell>
              <TableCell align="center">{row.userAgent}</TableCell>
              <Tooltip title="HH:MM:SS">
                <TableCell align="center">{row.streamedTime}</TableCell>
              </Tooltip>
              <TableCell align="center">{row.rebufferingEvents}</TableCell>
              <Tooltip title="MM:SS">
                <TableCell align="center">{row.rebufferingTime}</TableCell>
              </Tooltip>
              <TableCell align="center">{row.screenSize}</TableCell>
              <TableCell align="center">{row.speedTest}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}