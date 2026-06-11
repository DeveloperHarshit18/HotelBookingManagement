const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email service configuration error:", error.message);
  } else {
    console.log("✅ Email service is ready to send messages");
  }
});

/**
 * Send booking confirmation email to user
 */
const sendBookingConfirmationEmail = async (user, booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: "✅ Booking Confirmation - LuxeStay",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🎉 Booking Confirmed!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
            <p style="font-size: 16px; color: #333;">Hello ${user.name},</p>
            
            <p style="color: #555;">Thank you for booking with <strong>LuxeStay</strong>! Your booking has been successfully created and is awaiting admin approval.</p>
            
            <h2 style="color: #667eea; margin-top: 30px;">📋 Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Hotel</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.hotel.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Room</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.room.title} (${booking.room.roomType})</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-in</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-out</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Guests</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.guests}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Price</td>
                <td style="padding: 12px; border: 1px solid #ddd; color: #667eea; font-weight: bold;">₹${booking.totalPrice}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Status</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                  <span style="background: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 4px; font-weight: bold;">Pending Approval</span>
                </td>
              </tr>
            </table>
            
            <h2 style="color: #667eea; margin-top: 30px;">📞 Next Steps</h2>
            <p style="color: #555;">
              Our admin team will review your booking shortly. You will receive another email once your booking is approved. 
              If you have any questions, please contact our support team.
            </p>
            
            <p style="color: #555; margin-top: 20px;">
              <strong>Contact:</strong> support@luxestay.com | +91 9876543210
            </p>
          </div>
          
          <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© 2026 LuxeStay Hotel Management. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending booking confirmation email:", error.message);
    return false;
  }
};

/**
 * Send booking notification email to admin
 */
const sendAdminNotificationEmail = async (admin, booking, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: admin,
      subject: "🔔 New Booking Request - LuxeStay Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🔔 New Booking Request</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
            <p style="font-size: 16px; color: #333;">A new booking request has been received.</p>
            
            <h2 style="color: #667eea; margin-top: 30px;">📋 Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Guest Name</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Guest Email</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.email}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Guest Phone</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Hotel</td>
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>${booking.hotel.name}</strong> (${booking.hotel.city})</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Room</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.room.title} (${booking.room.roomType})</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-in</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-out</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Guests</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.guests}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Price</td>
                <td style="padding: 12px; border: 1px solid #ddd; color: #667eea; font-weight: bold;">₹${booking.totalPrice}</td>
              </tr>
            </table>
            
            ${booking.specialRequests ? `
              <h2 style="color: #667eea; margin-top: 30px;">📝 Special Requests</h2>
              <p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; color: #333;">
                ${booking.specialRequests}
              </p>
            ` : ""}
            
            <p style="color: #555; margin-top: 20px;">
              Please review this booking and approve or reject it from the admin panel.
            </p>
          </div>
          
          <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© 2026 LuxeStay Hotel Management. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification email sent to ${admin}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending admin notification email:", error.message);
    return false;
  }
};

/**
 * Send booking approval email to user
 */
const sendBookingApprovalEmail = async (user, booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: "✅ Your Booking is Confirmed! - LuxeStay",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">✅ Booking Approved!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
            <p style="font-size: 16px; color: #333;">Hello ${user.name},</p>
            
            <p style="color: #555;">Great news! Your booking has been <strong>approved and confirmed</strong> by our admin team. Get ready for an amazing stay!</p>
            
            <h2 style="color: #667eea; margin-top: 30px;">🎫 Confirmed Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Hotel</td>
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>${booking.hotel.name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Address</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.hotel.address}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Room</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.room.title}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-in</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} - 2:00 PM</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-out</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} - 11:00 AM</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Number of Guests</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.guests}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Amount</td>
                <td style="padding: 12px; border: 1px solid #ddd; color: #28a745; font-weight: bold; font-size: 18px;">₹${booking.totalPrice}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Payment Status</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                  <span style="background: #d4edda; color: #155724; padding: 5px 10px; border-radius: 4px; font-weight: bold;">Paid</span>
                </td>
              </tr>
            </table>
            
            <h2 style="color: #667eea; margin-top: 30px;">💡 Important Information</h2>
            <ul style="color: #555;">
              <li>Please arrive 30 minutes before your scheduled check-in time</li>
              <li>Valid photo ID is required at check-in</li>
              <li>Check-in time: 2:00 PM | Check-out time: 11:00 AM</li>
              <li>For any assistance, contact the front desk 24/7</li>
            </ul>
            
            <p style="color: #555; margin-top: 20px; background: #e8f4f8; padding: 15px; border-radius: 4px;">
              <strong>📞 Hotel Contact:</strong> +91 9876543210 | <strong>📧 Email:</strong> support@luxestay.com
            </p>
          </div>
          
          <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© 2026 LuxeStay Hotel Management. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking approval email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending booking approval email:", error.message);
    return false;
  }
};

/**
 * Send booking cancellation email to user
 */
const sendCancellationEmail = async (user, booking) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: "❌ Your Booking has been Cancelled - LuxeStay",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">❌ Booking Cancelled</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
            <p style="font-size: 16px; color: #333;">Hello ${user.name},</p>
            
            <p style="color: #555;">Your booking for <strong>${booking.hotel.name}</strong> has been cancelled.</p>
            
            <h2 style="color: #f5576c; margin-top: 30px;">📋 Cancelled Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Hotel</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${booking.hotel.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-in</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkIn).toLocaleDateString("en-IN")}</td>
              </tr>
              <tr style="background: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Check-out</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(booking.checkOut).toLocaleDateString("en-IN")}</td>
              </tr>
            </table>
            
            <p style="color: #555; margin-top: 20px;">
              If you would like to make another reservation or have any questions, please don't hesitate to contact us.
            </p>
          </div>
          
          <div style="background: #f5576c; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© 2026 LuxeStay Hotel Management. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending cancellation email:", error.message);
    return false;
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
  sendBookingApprovalEmail,
  sendCancellationEmail,
};
