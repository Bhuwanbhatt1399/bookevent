    import mongoose from "mongoose";

    const eventSchema = new mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            time: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            ticketPrice: {
                type: Number,
                required: true,
                default: 0
            },
            category: {
                type: String,
                required: true
            },
            totalSeats: {
                type: Number,
                required: true
            },
            availableSeats: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                default: ""
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
        {
            timestamps: true    
        }
    );

    const Event = mongoose.model("Event", eventSchema);
    export default Event;