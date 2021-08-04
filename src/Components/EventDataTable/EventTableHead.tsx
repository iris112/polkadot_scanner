import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { BlockEvent } from '../../Data';
import useStyles from './EventTableStyle';

interface HeadCell {
  disablePadding: boolean;
  id: keyof BlockEvent;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof BlockEvent) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export type Order = 'asc' | 'desc';

const headCells: HeadCell[] = [
  { id: 'blockNumber', numeric: true, disablePadding: false, label: 'Block Number' },
  { id: 'eventName', numeric: false, disablePadding: false, label: 'Event Name' },
  { id: 'eventArgs', numeric: false, disablePadding: false, label: 'Event Args' },
  { id: 'additionals', numeric: false, disablePadding: false, label: 'Additionals' },
];

const EnhancedTableHead:React.FC<EnhancedTableProps> = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof BlockEvent) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.head}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;