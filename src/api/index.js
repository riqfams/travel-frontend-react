import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({

    //set endpoint api
    baseURL: import.meta.env.VITE_APP_BASEURL,

    //set header axios
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

//handle unauthenthicated
Api.interceptors.response.use(function(response) {
    
    return response;
}, ((error) => {

    //if unauthethicated
    if (401 == error.response.status) {
        
        //remove cookies
        Cookies.remove('token');

        //redirect
        window.location  = 'admin/login';

    } else {
        
        //reject promise error
        return Promise.reject(error);
    }
}))

export default Api