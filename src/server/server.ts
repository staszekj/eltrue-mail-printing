import express from 'express';
import bodyParser from 'body-parser';
import {
  PRINTED_EMAILS_ENDPOINT_PATH
} from "../common";

import { ParamsDictionary } from "express-serve-static-core";
import * as mainComponent from "./main";
import { TPrintedMailsResponse } from "../common/types";

export const PORT = process.env.PORT || 8001;
export const app = express();

app.use(bodyParser.json());
app.use('/', express.static("build"));


app.get<ParamsDictionary, TPrintedMailsResponse>(PRINTED_EMAILS_ENDPOINT_PATH, async (req, res) => {
  const results = await mainComponent.process();
  res.send(results)
});

console.log(`Server is started on port ${PORT}`);
app.listen(PORT);
