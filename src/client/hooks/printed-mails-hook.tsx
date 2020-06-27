import {useState} from 'react';
import {EEndpointStatus, PRINTED_EMAILS_ENDPOINT_PATH} from "../../common";
import {TPrintedMailsResponse} from "../../common";
import axios from "axios";

export type TPrintedMailsApi = {
    status: EEndpointStatus,
    response: TPrintedMailsResponse
    api: {
        downloadMails: () => void;
    }
}
export const usePrintedMails = (): TPrintedMailsApi => {
    const [mails, setMails] = useState<Omit<TPrintedMailsApi, "api">>({
        status: EEndpointStatus.INIT,
        response: []
    });
    const downloadMails = () => {
        setMails({...mails, status: EEndpointStatus.PENDING});
        axios.get<TPrintedMailsResponse>(PRINTED_EMAILS_ENDPOINT_PATH)
            .then(data => {
                setMails({status: EEndpointStatus.SUCCESS, response: data.data})
            });
    };

    return {
        ...mails,
        api: {
            downloadMails
        }
    }
};
