import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import {
  Formik, Form, Field, ErrorMessage, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { ApiPromise, WsProvider } from '@polkadot/api';
import './App.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      textAlign: "center",
    },
    textField: {
      margin: theme.spacing(5),
    },
    errorField: {
      color: "red"
    },
  }),
);

interface MyFormValues {
  startNumber: number;
  endNumber: number;
  endPoint: string;
}

interface MyEventInfos {
  name: string;
  argument: string;
  docs: string;
}

interface MyBlockEvents {
  blockNumber: number,
  events: Array<MyEventInfos>
}

const App:React.FC = () => {
  const classes = useStyles();
  const [resultData, setResultData] = useState<Array<MyBlockEvents>>([]);
  const [submitDisable, setSubmitDisable] = useState<boolean>(true);
  const [errorString, setErrorString] = useState<string>("");
  const initialValues: MyFormValues = { 
    startNumber: 0, 
    endNumber: 0, 
    endPoint: "wss://rpc.polkadot.io"
  };
  
  const handleSubmit = (values:MyFormValues, actions:FormikHelpers<MyFormValues>) => {
    const wsProvider = new WsProvider(values.endPoint);
    
    setSubmitDisable(true);
    ApiPromise.create({ provider: wsProvider })
      .then(async (api) => {
        const resultData = new Array<MyBlockEvents>();
        for (let i = values.startNumber; i <= values.endNumber; i++) {
          const blockHash = await api.rpc.chain.getBlockHash(i);
          const allRecords = await api.query.system.events.at(blockHash);
          const blockEvents: MyBlockEvents = { blockNumber: i, events: [] }
          allRecords.forEach((record) => {
            // Extract the phase, event and the event types
            const { event, phase } = record;
            const types = event.typeDef;

            // Extract the arguments info
            const args: string = event.data.map((data, index) => `${types[index].type}: ${data.toString()}`).join("\n");

            blockEvents.events.push({
              name: event.method ?? event.meta.name.toString(),
              argument: args,
              docs: event.meta.docs.toString()
            })
          })
          resultData.push(blockEvents);
        }
        setResultData(resultData);
        setSubmitDisable(false);
      })
      .catch((error) => {
        setErrorString(error.toString());
        setSubmitDisable(false);
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
      .moreThan(Yup.ref('startNumber'), "Should be begger than start block number")
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
      
      <Container className={classes.container}>
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
              setSubmitDisable(values === initialValues);
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
              </Form>
            );
          }}
        </Formik>
      </Container>
    </>
  );
}

export default App;
