// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const request = async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response;
};

export const get = async (url, params) => {
    const query = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
    const response = await request(`${url}${query}`);
    return response.json();
};

export const post = async (url, data, customOptions = {}) => {
    const response = await request(url, {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
        ...customOptions,
    });
    return response.json();
};

export const put = async (url, data) => {
    const response = await request(url, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
};

export const del = async (url) => {
    const response = await request(url, {
        method: 'DELETE',
    });
    return response.json();
};

export const getStream = async (url, params) => {
    const query = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
    const response = await request(`${url}${query}`);
    return response.body;
};
