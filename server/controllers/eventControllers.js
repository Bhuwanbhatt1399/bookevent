
//Ye file Event controller hai.
// Events fetch karna
// Event create karna
// Event update karna
// Event delete karna

// Matlab ye CRUD operations handle kar raha hai.

import Event from "../models/eventModel.js";

export const getAllEvent = async (req, res) => {
  try {
    const filters = {};

    if (req.query.search) {
      filters.title = {
        $regex: req.query.search,
        $options: "i"
      };
    }

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.location) {
      filters.location = req.query.location;
    }

    const events = await Event.find(filters);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      totalSeats,
      ticketPrice
    } = req.body;

    let imagePath = "";

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats,
      ticketPrice,
      image: imagePath,
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      totalSeats,
      ticketPrice
    } = req.body;

    const updateData = {
      title,
      description,
      date,
      time,
      location,
      category,
      totalSeats,
      ticketPrice
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};