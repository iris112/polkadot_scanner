import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import {
  Formik, Form, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { ApiPromise, WsProvider } from '@polkadot/api';
import parseData, { BlockEvent } from './Data';
import EventDataTable from './Components/EventDataTable';
import FilterBar from './Components/FilterComponent';
import debounce from 'lodash/debounce';
import _ from "lodash";
import './App.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      paddingTop: theme.spacing(10),
      textAlign: "center",
    },
    dataContainer: {
      marginTop: theme.spacing(10),
    },
    textField: {
      margin: theme.spacing(5),
    },
    errorField: {
      color: "red"
    },
    progressBar: {
      marginTop: theme.spacing(3),
    },
  }),
);

interface MyFormValues {
  startNumber: number;
  endNumber: number;
  endPoint: string;
}

const App:React.FC = () => {
  const classes = useStyles();
  const [resultData, setResultData] = useState<Array<BlockEvent>>([]);
  const [filteredData, setFilteredData] = useState<Array<BlockEvent>>([]);
  const [filterEventName, setFilterEventName] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [submitDisable, setSubmitDisable] = useState<boolean>(true);
  const [errorString, setErrorString] = useState<string>("");
  const initialValues: MyFormValues = { 
    startNumber: 0, 
    endNumber: 0, 
    endPoint: "wss://rpc.polkadot.io"
  };

  useEffect(debounce(() => {
    if (filterEventName != '')
      filteringData();
    else
      setFilteredData([...resultData]);
  }, 800), [resultData, filterEventName])

  const filteringData = () => {
    setFilteredData(_.filter(resultData, (item) => item.eventName.includes(filterEventName) ));
  }

  const fetchStart = () => {
    setSubmitDisable(true);
    setResultData([]);
    setProgress(1);
  }

  const fetchEnd = () => {
    setSubmitDisable(false);
    setTimeout(() => setProgress(0), 800);
  }
  
  const handleSubmit = (values:MyFormValues, actions:FormikHelpers<MyFormValues>) => {
    const wsProvider = new WsProvider(values.endPoint);
    
    fetchStart();
    
    ApiPromise.create({ provider: wsProvider })
      .then(async (api) => {
        const resultData = new Array<BlockEvent>();
        for (let i = values.startNumber; i <= values.endNumber; i++) {
          resultData.push(...await parseData(api, i));
          setProgress(100 * (i - values.startNumber + 1) / (values.endNumber - values.startNumber + 1));
        }

        fetchEnd();
        setTimeout(() => setResultData(resultData), 800);
      })
      .catch((error) => {
        setErrorString(error.toString());
        fetchEnd();
      });
  };

  const validationSchema = Yup.object().shape({
    startNumber: Yup.number()
      .typeError('Must be a number')
      .positive('Must be greater than zero')
      .required('Required'),
    endNumber: Yup.number()
      .typeError('Must be a number')
      .positive('Must be greater than zero')
      .min(Yup.ref('startNumber'), "Should be begger than start block number")
      .required('Required'),
    endPoint: Yup.string()
      .matches(
        /(^((wss?|https?):\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|(?=[^\/]{1,254}(?![^\/]))(?:(?=[a-zA-Z0-9-]{1,63}\.)(?:xn--+)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}):([0-9]{1,5})$)|(((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$)/,
        'Must be a URL format!'
      )
      .required('Required'),
  })

  return (
    <>
      
      <Container className={classes.formContainer}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {props => {
            const {
              values,
              errors,
              handleChange,
            } = props;

            const onChange = (e: React.ChangeEvent<any>) => {
              setSubmitDisable(values === initialValues || progress > 0);
              handleChange(e);
            }

            return (
              <Form>
                <TextField 
                  className={classes.textField}
                  name="startNumber"
                  variant="outlined"
                  label="Start block Number:" 
                  value={values.startNumber}
                  onChange={onChange}
                  helperText={errors.startNumber}
                  error={errors.startNumber ? true : false}
                  required/>
                <TextField 
                  className={classes.textField} 
                  name="endNumber"
                  variant="outlined"
                  label="End block Number:" 
                  value={values.endNumber}
                  onChange={onChange}
                  helperText={errors.endNumber}
                  error={errors.endNumber ? true : false}
                  required/>
                <TextField 
                  className={classes.textField} 
                  name="endPoint"
                  variant="outlined"
                  label="End point:"
                  value={values.endPoint} 
                  onChange={handleChange}
                  helperText={errors.endPoint}
                  error={errors.endPoint ? true : false}
                  required/>
                <p className={classes.errorField}>{errorString}</p>
                <Box>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={submitDisable || errors.startNumber || errors.endNumber || errors.endPoint ? true : false}>
                      Scan
                  </Button>
                </Box>
                
                {progress > 0 && (
                  <LinearProgress className={classes.progressBar} variant="determinate" value={progress}/>
                )}
              </Form>
            );
          }}
        </Formik>
      </Container>
      {resultData.length > 0 && (
          <Container className={classes.dataContainer}>
            <FilterBar handleChange={setFilterEventName} filterEventName={filterEventName}/>
            <EventDataTable rows={filteredData}/>
          </Container>
      )}
    </>
  );
}

export default App;
