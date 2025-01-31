import { getUserToken } from "./auth";

export const API_URL = window.location.hostname === 'beFit-deployed-front' ? "beFit-deployed-backend" : "http://localhost:3001";

// Custom API error to throw
class ApiError {
    constructor(message, data, status) {
        let response = null;
        let isObject = false;

        // We are trying to parse response
        try {
            response = JSON.parse(data);
            isObject = true;
        } catch (e) {
            response = data;
        }

        this.response = response;
        this.message = message;
        this.status = status;
        this.toString = function () {
            return `${this.message}\nResponse:\n${isObject ? JSON.stringify(this.response, null, 2) : this.response}`;
        };
    }
}

// API wrapper function
const fetchResource = (method = "GET", path, userOptions = {}) => {
    // Define default options
    const defaultOptions = {
        mode: 'cors',
        method,
    };

    // Get the user token
    const token = getUserToken();

    // Define default headers
    const defaultHeaders = {
        ...(token && { "authorization": `Bearer ${token}` }),
    };
    
    const options = {
        ...defaultOptions,
        ...userOptions,
        headers: {
            ...defaultHeaders,
            ...(userOptions.headers?.['content-type'] ? {} : { "content-type": "application/json" }),
            ...userOptions.headers,
        },
        
    };
    console.log('Request Headers:', options.headers);


    // Build URL
    const url = `${API_URL}/${path}`;

    // Detect if we are uploading a file
    const isFile = options.body instanceof File;

    // Stringify JSON data if the body is not a file
    if (options.body && typeof options.body === 'object' && !isFile) {
        options.body = JSON.stringify(options.body);
    }

    // Variable to store response
    let response = null;

    return fetch(url, options)
        .then(responseObject => {
            // Save response for later use in lower scopes
            response = responseObject;

            // HTTP unauthorized
            if (response.status === 401) {
                // Handle unauthorized requests, maybe redirect to login page?
                return { authError: true };
            }

            // Get response as JSON
            return response.json();
        })
        .then(parsedResponse => {
            // Check for HTTP error codes
            if (response.status < 200 || response.status >= 300) {
                // Throw error
                throw parsedResponse;
            }

            // Request succeeded
            return parsedResponse;
        })
        .catch(error => {
            // Throw custom API error
            // If response exists, it means HTTP error occurred
            if (response) {
                throw new ApiError(`Request failed with status ${response.status}.`, error, response.status);
            } else {
                throw new ApiError(error.toString(), null, 'REQUEST_FAILED');
            }
        });
};

export default fetchResource;
