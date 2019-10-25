import React, { useEffect, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from "react-router-dom";

import Layout from '../src/containers/Layout/Layout'


const app = props => {
    return (
        <div>
          <div>
            <h1>Manager</h1>
          </div>
            <Layout />
        </div>
    );
}

export default app;
