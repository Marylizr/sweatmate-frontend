export const API_URL = window.location.hostname === 'sweatmateapp.netlify.app'
  ? process.env.REACT_APP_API_URL
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
    // Default fetch options
    const defaultOptions = {
        mode: 'cors',
        method,
        credentials: 'include',  // Always include cookies in requests
    };

    // Default headers
    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    // Merge default and user-provided options
    const options = {
        ...defaultOptions,
        ...userOptions,
        headers: {
            ...defaultHeaders,
            ...userOptions.headers,
        },
    };

    console.log("Final Request Headers:", options.headers);

    // Build the request URL
    const url = `${API_URL}/${path}`;

    // Convert JSON body to string format (if not already done)
    if (options.body && typeof options.body === 'object' && !(options.body instanceof File)) {
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

        // Parse JSON response
        const parsedResponse = await response.json();

        // Handle non-2xx responses
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
