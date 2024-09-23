import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addBudget, updateBudget } from "./api";

const BudgetForm = ({ show, handleClose, existingBudget, refreshBudgets }) => {
  const [budget, setBudget] = useState(
    existingBudget || {
      name: "",
      amount: "",
      duration: "monthly",
      startDate: "",
      endDate: "",
    }
  );

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingBudget) {
      await updateBudget(existingBudget._id, budget);
    } else {
      await addBudget(budget);
    }
    refreshBudgets();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{existingBudget ? "Edit" : "Add"} Budget</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Budget Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={budget.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={budget.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="duration">
            <Form.Label>Duration</Form.Label>
            <Form.Select
              name="duration"
              value={budget.duration}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={budget.startDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={budget.endDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Budget
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BudgetForm;
