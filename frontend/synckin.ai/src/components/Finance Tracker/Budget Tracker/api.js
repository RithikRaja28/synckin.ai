import axios from "axios";

const API_URL = "http://localhost:5000/api/budget"; // Update with your backend URL

// Fetch all budgets
export const getBudgets = async () => {
  const response = await axios.get(`${API_URL}/show`, {
    headers: { "x-auth-token": localStorage.getItem("token") },
  });
  return response.data;
};

// Add a new budget
export const addBudget = async (budgetData) => {
  const response = await axios.post(`${API_URL}/add`, budgetData, {
    headers: { "x-auth-token": localStorage.getItem("token") },
  });
  return response.data;
};

// Update an existing budget
export const updateBudget = async (id, budgetData) => {
  const response = await axios.put(`${API_URL}/update/${id}`, budgetData, {
    headers: { "x-auth-token": localStorage.getItem("token") },
  });
  return response.data;
};

// Delete a budget
export const deleteBudget = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: { "x-auth-token": localStorage.getItem("token") },
  });
  return response.data;
};

// Fetch budget progress
export const getBudgetProgress = async (id) => {
  const response = await axios.get(`${API_URL}/progress/${id}`, {
    headers: { "x-auth-token": localStorage.getItem("token") },
  });
  return response.data;
};
