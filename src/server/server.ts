import express from 'express';
import bodyParser from 'body-parser';
import {
    PRINTED_EMAILS_ENDPOINT_PATH
} from "../common";

import {ParamsDictionary} from "express-serve-static-core";
import {processMessages, readProcessedMessages} from "./gmail";
import {TPrintedMailsResponse} from "../common";

export const PORT = process.env.PORT || 8001;
export const app = express();

app.use(bodyParser.json());
app.use('/', express.static("build"));


app.get<ParamsDictionary, TPrintedMailsResponse>(PRINTED_EMAILS_ENDPOINT_PATH, async (req, res) => {
    const results = await readProcessedMessages();
    res.send(results)
});

processMessages();
console.log(`Server is started on port ${PORT}`);
app.listen(PORT);




