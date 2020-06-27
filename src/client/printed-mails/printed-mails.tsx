import React, {MouseEventHandler} from "react";
import {FunctionComponent} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {TPrintedMailsApi} from "../hooks/printed-mails-hook";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from "@material-ui/icons/Search";
import {TTheme} from "../theme";
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: TTheme) => {
    return {
        MainVertical: {
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 20px)'
        },
        Header: {
            height: '70px',
        },
        Main: {
            flex: 1,
            position: 'relative',
            backgroundColor: theme.palette.background.level2
        },
        ScrollContainer: {
            position: 'absolute',
            height: '100%',
            overflowY: 'auto'
        },
        FooterContent: {
            paddingTop: '10px',
            paddingLeft: '10px',
            fontSize: '10px',
            fontWeight: 200
        },
        table: {
            minWidth: 650,
        }
    }
});

export type TPrintedMailsProps = {
    printedMailsApi: TPrintedMailsApi
}

export const PrintedMails: FunctionComponent<TPrintedMailsProps> = ({printedMailsApi}) => {
    const cs = useStyles();
    const rows = printedMailsApi.response;

    const clickHandle: MouseEventHandler = (e) => {
        printedMailsApi.api.downloadMails();
    };

    return (
        <div className={cs.MainVertical}>
            <div className={cs.Header}>
                <AppBar>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="search" onClick={clickHandle}>
                            <SearchIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
            <div className={cs.Main}>
                <TableContainer className={cs.ScrollContainer} component={Paper}>
                    <Table className={cs.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>timeStamp</TableCell>
                                <TableCell align="right">pagesRanges</TableCell>
                                <TableCell align="right">reason</TableCell>
                                <TableCell align="right">sentDateMmtUtc</TableCell>
                                <TableCell align="right">from</TableCell>
                                <TableCell align="right">subject</TableCell>
                                <TableCell align="right">filename</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.messageId}>
                                    <TableCell component="th" scope="row">
                                        {row.timeStamp}
                                    </TableCell>
                                    <TableCell align="right">{row.pagesRanges}</TableCell>
                                    <TableCell align="right">{row.reason}</TableCell>
                                    <TableCell align="right">{row.sentDateMmtUtc}</TableCell>
                                    <TableCell align="right">{row.from}</TableCell>
                                    <TableCell align="right">{row.subject}</TableCell>
                                    <TableCell align="right">{row.fileName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className={cs.FooterContent}>
                {"Version: 0.0.2"}
            </div>
        </div>
    );

};
