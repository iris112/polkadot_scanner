import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { selectFilterEventName, setFilterEventName } from '../../Store/filterEventSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterBar: {
      width: "100%",
      textAlign: "right",
      paddingBottom: theme.spacing(2),
    },
  }),
);

const FilterBar:React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterEventName = useSelector(selectFilterEventName);
  
  return (
    <div className={classes.filterBar}>
      <FormControl>
        <InputLabel htmlFor="component-simple">Filter By Event Name</InputLabel>
        <Input id="component-simple" value={filterEventName} data-testid="filter-event" onChange={(e) => dispatch(setFilterEventName(e.target.value))} />
      </FormControl>
    </div>
  );
}

export default FilterBar;
