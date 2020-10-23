import React, { useState, useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import {
  Button,
  Link,
} from '@material-ui/core';
import { EntUser } from '../../services/models/EntUser';
import { DefaultApi } from '../../services/apis'; // Api Gennerate From Command
import { Link as RouterLink } from 'react-router-dom';

import Swal from 'sweetalert2';
const api = new DefaultApi();
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

//state type

type State = {
  username: string
  password: string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialState: State = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUsername':
      return {
        ...state,
        username: action.payload
      };
    case 'setPassword':
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled':
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess':
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed':
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError':
      return {
        ...state,
        isError: action.payload
      };
  }
}

const Login = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.trim() && state.password.trim()) {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: false
      });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.username, state.password]);

  interface user {
    email: string;
    password: string;
  }

  const [users, setUser] = React.useState<
    Partial<user>
  >({});

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  function clear() {
    setUser({});
  }
  const checkLoginStatus = () => {

    const apiUrl = 'http://localhost:8080/api/v1/users';
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify(users),
    };

    console.log(users);
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        var num = parseInt(`${data.length}`);
        for (var i = 0;i < num;i++) {
          var email = (`${data[i].Email}`).toString();
          var pw = (`${data[i].Password}`).toString();
          if (state.username === email && state.password === pw) {
            clear();
            Toast.fire({
              icon: 'success',
              title: "LOGIN SUCCESS",
            });
            break
          } else
            Toast.fire({
              icon: 'error',
              title: "Email / Password are not correct.",
            });
        }
      }
      )
  };



  const handleLogin = () => {
    if (state.username === "1" && state.password === '1') {
      dispatch({
        type: 'loginSuccess',
        payload: 'Login Successfully'
      });

    } else {
      dispatch({
        type: 'loginFailed',
        payload: 'Incorrect username or password'
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setUsername',
        payload: event.target.value
      });
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Login App" />
        <CardContent>
          <div>
            <TextField
              error={state.isError}
              fullWidth
              id="username"
              type="email"
              label="Username"
              placeholder="Username"
              margin="normal"
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>

        <CardActions>
          <Link component={RouterLink} to="/Table">
            <Button variant="contained"
              size="large"
              color="secondary"
              className={classes.loginBtn}
              onClick={checkLoginStatus}
              disabled={state.isButtonDisabled}>
              LOGIN
            </Button>
          </Link>



        </CardActions>
      </Card>
    </form>
  );
}

export default Login;