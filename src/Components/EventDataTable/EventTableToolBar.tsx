import React from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useToolbarStyles } from './EventTableStyle';

const TableToolbar:React.FC = () => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {})}
    >
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Events
      </Typography>
    </Toolbar>
  );
};

export default TableToolbar;