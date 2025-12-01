import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import brevoEmailService from '../services/brevoEmailService.js';

const router = express.Router();

// Get all bookings (admin only) with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};

    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
          { bookingReference: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / limit);

    const bookings = await Booking.find(query)
      .populate('serviceCategory', 'name')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform the data to include service names
    const transformedBookings = bookings.map(booking => ({
      ...booking.toObject(),
      serviceCategory: booking.serviceCategory?.name || booking.serviceCategory,
      serviceId: booking.serviceId?.title || booking.serviceId,
    }));

    res.json({
      success: true,
      data: transformedBookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, address, bookingDate, bookingTime, serviceCategory, serviceId, serviceDuration, servicePrice, notes } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !address || !bookingDate || !bookingTime || !serviceCategory || !serviceId || !serviceDuration || servicePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All required fields are required',
      });
    }

    // Validate booking date is not in the past
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Booking date and time cannot be in the past',
      });
    }

    const booking = new Booking({
      name,
      email,
      mobile,
      address,
      bookingDate,
      bookingTime,
      serviceCategory,
      serviceId,
      serviceDuration,
      servicePrice,
      notes,
    });

    await booking.save();

    // Fetch service and category details for email
    try {
      const service = await Service.findById(serviceId).populate('category');
      const category = await Category.findById(serviceCategory);

      if (service && category) {
        const serviceDetails = {
          title: service.title,
          category: category.name,
          duration: serviceDuration,
          price: servicePrice,
          benefits: service.benefits || [],
          longDesc: service.longDesc || '',
        };

        const bookingData = {
          name,
          email,
          mobile,
          address,
          bookingDate,
          bookingTime,
          serviceCategory: category.name,
          serviceId: service.title,
          serviceDuration,
          servicePrice,
          notes,
          bookingReference: booking.bookingReference,
        };

        // Send confirmation email (don't fail booking if email fails)
        const emailSent = await brevoEmailService.sendBookingConfirmationEmail(bookingData, serviceDetails);
        if (!emailSent) {
          console.warn(`Failed to send confirmation email to ${email}, but booking was successful`);
        }
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email sending fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit booking',
    });
  }
});

// Update booking status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
    });
  }
});

// Delete booking (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
    });
  }
});

export default router;