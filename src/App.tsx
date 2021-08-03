import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import {
  Formik, Form, Field, ErrorMessage, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import './App.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      textAlign: "center",
    },
    textField: {
      margin: theme.spacing(5),
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
  const initialValues: MyFormValues = { 
    startNumber: 0, 
    endNumber: 0, 
    endPoint: "wss://rpc.polkadot.io"
  };

  const handleSubmit = (values:MyFormValues, actions:FormikHelpers<MyFormValues>) => {
    console.log({ values, actions });
  };
  const validationSchema = Yup.object().shape({
    startNumber: Yup.number()
      .typeError('Must be a number')
      .positive('Must be greater than zero')
      .required('Required'),
    endNumber: Yup.number()
      .typeError('Must be a number')
      .positive('Must be greater than zero')
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
             
            return (
              <Form>
                <TextField 
                  className={classes.textField}
                  name="startNumber"
                  variant="outlined"
                  label="Start block Number:" 
                  value={values.startNumber}
                  onChange={handleChange}
                  helperText={errors.startNumber}
                  error={errors.startNumber ? true : false}
                  required/>
                <TextField 
                  className={classes.textField} 
                  name="endNumber"
                  variant="outlined"
                  label="End block Number:" 
                  value={values.endNumber}
                  onChange={handleChange}
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
                
                <Box>
                  <Button type="submit" variant="contained" color="primary">Scan</Button>
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
