import { getUserToken } from "./auth";


export const API_URL = window.location.hostname === 'beFit-deployed-front' 
    ? "https://sweatmate-app-b74e82edf23b.herokuapp.com/" 
    : "http://localhost:3001";

// Custom API error class
class ApiError {
    constructor(message, data, status) {
        let response = null;
        let isObject = false;

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
const fetchResource = async (method = "GET", path, userOptions = {}) => {
    // Define default options
    const defaultOptions = {
        mode: 'cors',
        method,
    };

    // Get the user token from storage
    let token = getUserToken();
    if (!token) {
        token = localStorage.getItem("token");  // Fallback to local storage
    }

    console.log(`Token being used for request: ${token ? "Exists" : "Missing"}`);

    // Define default headers
    const defaultHeaders = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };

    // Merge user-provided options with defaults
    const options = {
        ...defaultOptions,
        ...userOptions,
        headers: {
            ...defaultHeaders,
            ...(userOptions.headers?.['content-type'] ? {} : { "Content-Type": "application/json" }),
            ...userOptions.headers,
        },
    };

    console.log("Final Request Headers:", options.headers);

    // Build the request URL
    const url = `${API_URL}/${path}`;

    // Detect if the request body contains a file
    const isFile = options.body instanceof File;

    // Convert JSON data to string format if not a file
    if (options.body && typeof options.body === 'object' && !isFile) {
        options.body = JSON.stringify(options.body);
    }

    let response = null;

    try {
        response = await fetch(url, options);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.warn("Unauthorized request (401). Token might be expired.");
            return { authError: true };
        }

        // Convert response to JSON
        const parsedResponse = await response.json();

        // Handle non-2xx status codes
        if (response.status < 200 || response.status >= 300) {
            throw parsedResponse;
        }

        return parsedResponse;
    } catch (error) {
        if (response) {
            throw new ApiError(`Request failed with status ${response.status}.`, error, response.status);
        } else {
            throw new ApiError(error.toString(), null, 'REQUEST_FAILED');
        }
    }
};

export default fetchResource;
