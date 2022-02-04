import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './index.css';

import App from './views/App';
import reportWebVitals from './reportWebVitals';

import {Grommet} from "grommet";
import {RecoilRoot} from "recoil";

const theme = {
    global: {
        colors: {
            serverButton: "#9a9a9a",
            roomButton: "#9a9a9a",
        },
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px'
        },
    },
    button: {
        border: {
            radius: "4px"
        }
    }
};

ReactDOM.render(
    <React.StrictMode>
        <Grommet theme={theme}>
            <RecoilRoot>
                <App/>
            </RecoilRoot>
        </Grommet>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
