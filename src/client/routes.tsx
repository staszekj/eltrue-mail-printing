import {HashRouter, Route, Switch} from "react-router-dom";
import React, {FunctionComponent, useContext, useEffect} from "react";
import {PrintedMails} from './printed-mails'
import {AppContext} from "./App";

export const AppRoutes: FunctionComponent = () => {

    const appContext = useContext(AppContext);
    useEffect(() => {
        if (!appContext) {
            return
        }
        appContext.printedMails.api.downloadMails();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!appContext) {
        return null
    }

    return (
        <HashRouter>
            <Switch>
                <Route exact={true} path="/">
                    <PrintedMails printedMailsApi={appContext.printedMails}/>
                </Route>
            </Switch>
        </HashRouter>
    );
};
