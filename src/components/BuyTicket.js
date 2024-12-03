import React, { useState, useEffect } from "react";
import axios from "axios";

const BuyTicket = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch available events from the server when the component loads
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tickets");
        setEvents(response.data); // Populate the events array
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage("Failed to load events. Please try again later.");
      }
    };

    fetchEvents();
  }, []);

  const handleBuyTicket = async () => {
    if (!selectedEvent) {
      setMessage("Please select an event.");
      return;
    }

    if (quantity <= 0) {
      setMessage("Please enter a valid ticket quantity.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/buy-ticket", {
        eventName: selectedEvent,
        quantity,
      });

      setMessage(response.data.message); // Display success message
      setQuantity(1); // Reset quantity after purchase
    } catch (error) {
      console.error("Error buying tickets:", error);
      const errorMsg =
        error.response?.data?.error || "Something went wrong. Please try again.";
      setMessage(errorMsg); // Display error message
    }
  };

  return (
    <div style={styles.buyTicket}>
      <h1 style={styles.heading}>Buy Tickets</h1>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.formGroup}>
        <label htmlFor="event" style={styles.label}>
          Select Event:
        </label>
        <select
          id="event"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.eventName}>
              {event.eventName} ({event.ticketQuantity} tickets available)
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="quantity" style={styles.label}>
          Number of Tickets:
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          style={styles.input}
        />
      </div>

      <button style={styles.buyButton} onClick={handleBuyTicket}>
        Buy Tickets
      </button>
    </div>
  );
};

const styles = {
  buyTicket: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  select: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  buyButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 15px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginBottom: "15px",
    fontSize: "14px",
    color: "#333",
  },
};

export default BuyTicket;
