import React from 'react'
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                return localStorage.getItem('token') ? <Component {...props} /> : <Navigate to='/' />;
            }}
        />
    );
};


export default PrivateRoute;