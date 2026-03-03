import { API_URL } from './api';

/**
 * Fetches all active categories from the backend.
 * @returns {Promise<Array>} - List of categories
 */
export const getAllCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in getAllCategories service:', error);
        throw error;
    }
};

/**
 * Creates a new category.
 * @param {FormData} formData - FormData containing name, description, and image file
 * @returns {Promise<Object>} - Created category object
 */
export const createCategory = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/categories/create`, {
            method: 'POST',
            body: formData, // No headers needed for FormData, browser sets them
        });
        if (!response.ok) {
            throw new Error('Failed to create category');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in createCategory service:', error);
        throw error;
    }
};
