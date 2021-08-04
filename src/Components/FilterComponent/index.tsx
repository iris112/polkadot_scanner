import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export type FilterBarProps = { 
  handleChange: (value: string) => void,
  filterEventName: string
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterBar: {
      width: "100%",
      textAlign: "right",
      paddingBottom: theme.spacing(2),
    },
  }),
);

const FilterBar:React.FC<FilterBarProps> = (props) => {
  const { handleChange, filterEventName } = props;
  const classes = useStyles();
  
  return (
    <div className={classes.filterBar}>
      <FormControl>
        <InputLabel htmlFor="component-simple">Filter By Event Name</InputLabel>
        <Input id="component-simple" value={filterEventName} onChange={(e) => handleChange(e.target.value)} />
      </FormControl>
    </div>
  );
}

export default FilterBar;
