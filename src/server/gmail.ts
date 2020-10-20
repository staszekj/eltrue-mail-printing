import fs from "fs";
import readline from "readline";
import { google, gmail_v1 } from "googleapis";
import { OAuth2Client, Credentials } from "google-auth-library";
import * as credentials from "../../credentials.json";
import _ from "lodash";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "token.json";
const { client_secret, client_id, redirect_uris } = credentials.installed;

const getAuthClientFromToken = (token: Credentials) => {
  const oAuth2Client = new OAuth2Client(
    client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(token);

  return oAuth2Client;
};

const readToken = () => new Promise<Credentials>((resolve, reject) => {
  fs.readFile(TOKEN_PATH, (err, savedToken) => {
    if (err) return reject("Error with token");
    const parsedToken: Credentials = JSON.parse(savedToken.toString());
    resolve(parsedToken);
  });
});

const writeToken = (token: Credentials) => new Promise<Credentials>((resolve, reject) => {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return reject(err);
    console.log("Token stored to", TOKEN_PATH);
    resolve(token);
  });
});

const askUserForCode: () => Promise<string> = () => {
  const oAuth2Client = new OAuth2Client(
    client_id, client_secret, redirect_uris[0]);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  return new Promise<string>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      resolve(code);
    });
  });
};

const getToken = (code: string) => new Promise<Credentials>((resolve, reject) => {
  const oAuth2Client = new OAuth2Client(
    client_id, client_secret, redirect_uris[0]);
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return reject("Error retrieving access token" + err);
    if (!token) return reject("Token is empty");
    resolve(token);
  });
});

const getSavedOAuthClient: () => Promise<OAuth2Client> = async () => {
  const token = fs.existsSync(TOKEN_PATH) ? await readToken() : await getNewToken();
  return getAuthClientFromToken(token);
};

export const getGmailApi = async () => {
  const auth = await getSavedOAuthClient();
  return google.gmail({ version: "v1", auth });
};

export const getNewToken: () => Promise<Credentials> = async () => {
  const code = await askUserForCode();
  const token = await getToken(code);

  await writeToken(token);

  return token;
};
