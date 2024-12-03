import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 

const AddTicket = () => {
  const [eventName, setEventName] = useState("");
  const [ticketCount, setTicketCount] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleAddTickets = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!eventName || !ticketCount) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (isNaN(ticketCount) || ticketCount <= 0) {
      setMessage("Ticket count must be a positive number.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: eventName,
          ticketQuantity: ticketCount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Ticket added successful!");
        // navigate("/admin");
      } else {
        alert(data.error || "Failed to add ticket.");
      }
    } catch (error) {
      console.error("Error during adding ticket:", error);
      alert("An error occurred, please try again.");
    }

    // Simulate adding tickets to the database
    console.log(`Event: ${eventName}, Tickets: ${ticketCount}`);

    // Reset form
    setEventName("");
    setTicketCount("");
    setMessage(`Successfully added ${ticketCount} tickets for ${eventName}!`);
  };

  return (
    <AddTicketWrapper>
      <div className="add-ticket">
        <div className="add-ticket-header">
          <h1>Add Tickets</h1>
        </div>

        <form className="add-ticket-form" onSubmit={handleAddTickets}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticketCount">Number of Tickets:</label>
            <input
              type="number"
              id="ticketCount"
              value={ticketCount}
              onChange={(e) => setTicketCount(e.target.value)}
              placeholder="Enter ticket count"
            />
          </div>

          <button type="submit" className="submit-button">
            Add Tickets
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </AddTicketWrapper>
  );
};

const AddTicketWrapper = styled.div`
  .add-ticket {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .add-ticket-header h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .add-ticket-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .form-group input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  .submit-button {
    padding: 10px 15px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .submit-button:hover {
    background: #0056b3;
  }

  .message {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    color: green;
  }
`;

export default AddTicket;
