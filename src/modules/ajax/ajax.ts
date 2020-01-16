import axios from 'axios';
import { getNested } from '../../utils';
import { loadingService } from '../loading/loadingService';


export interface ajaxResponse {
  success: boolean,
  data: any,
  status?: number,
  errors?: errorMessage[]
}

export const getAjaxMessage = (success:boolean, data:any, status:number = 0, errors = []): ajaxResponse => {
  return {success, data, status, errors}
}

export interface errorMessage {
  location: string,
  msg: string
}

export interface postRequest {
  url: string,
  form: object,
  options?: object,
  showProgress?: boolean,
  progressMessage?: string
}

export const getPostRequest = (url:string, form:object, options:object, 
  showProgress:boolean = true, progressMessage:string = "Making request, please wait.") => {
    return {url, form, options, showProgress, progressMessage};
}



export const getErrorMessage = (msg: string, location:string = "Server"):errorMessage => {
  return {msg, location};
}

export const post = async (req: postRequest):Promise<ajaxResponse> => {
  try {
    loadingService.loading = true;
    const res = await axios.post(req.url, req.form, req.options);

    loadingService.loading = false;
    console.log(res);
    return getAjaxMessage(true, res.data, 200);
  }
  catch(err) {
    loadingService.loading = false;
    console.log(err.response);
    const response = getNested(err, 'response');
    if(response.status === 422){
      return getAjaxMessage(false, null, response.data.status, response.data.errors);
    }
    else if(response.status === 404) {
      return getAjaxMessage(false, null, 404, [getErrorMessage("Could not connect to server")]);
    }
    else {
      return getAjaxMessage(false, null, response.status, [getErrorMessage("Could not connect to server")]);
    }
  }
}