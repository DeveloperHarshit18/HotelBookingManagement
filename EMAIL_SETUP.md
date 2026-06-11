# Email Notification System Setup Guide

## Overview
The Hotel Booking System now includes automated email notifications for:
- **User**: Receives confirmation when booking is created
- **User**: Receives approval email when admin confirms the booking
- **User**: Receives cancellation email when booking is cancelled
- **Admin**: Receives notification when a new booking is created

## Prerequisites
- Gmail account (or any SMTP-compatible email service)
- Generated App Password for Gmail

## Step 1: Generate Gmail App Password

1. Go to [Google Account Security Settings](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go back to Security settings
4. Find **App passwords** section
5. Select "Mail" and "Windows Computer" (or your device)
6. Google will generate a 16-character password
7. Copy this password (you'll use it in step 2)

## Step 2: Configure .env File

Update `backend/.env` with your Gmail credentials:

```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com        # Your Gmail address
EMAIL_PASS=your-app-password           # 16-character app password from step 1
EMAIL_FROM=noreply@luxestay.com        # Display name for sent emails
ADMIN_EMAIL=admin@hotel.com            # Admin email for notifications
```

### Example:
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop        # (spaces are normal)
ADMIN_EMAIL=admin@hotel.com
```

## Step 3: Test Email Configuration

1. Start the backend server: `npm run dev`
2. The email service will verify on startup with message:
   - ✅ `Email service is ready to send messages` (Success)
   - ❌ `Email service configuration error:` (Check credentials)

## Email Flow

### 1. User Creates Booking
```
User fills booking form → Creates booking
                       ↓
          Booking saved to database
                       ↓
         ✉️ Confirmation email sent to user
         ✉️ Notification email sent to admin
```

### 2. Admin Approves Booking
```
Admin approves booking → Updates status to "confirmed"
                              ↓
                  Booking saved with "confirmed" status
                              ↓
                   ✉️ Approval email sent to user
```

### 3. User Cancels Booking
```
User cancels booking → Updates status to "cancelled"
                              ↓
                  Booking saved with "cancelled" status
                              ↓
                   ✉️ Cancellation email sent to user
```

## Email Templates

### 1. Booking Confirmation Email (User)
- Sent when user creates a booking
- Contains: Hotel details, room info, check-in/out dates, price, status
- Status shows: "Pending Approval"

### 2. Admin Notification Email (Admin)
- Sent when user creates a booking
- Contains: Guest details, room details, special requests
- Action: Admin reviews and approves/rejects

### 3. Booking Approval Email (User)
- Sent when admin confirms the booking
- Contains: Confirmed details, check-in/out times, contact info
- Includes: Important information about check-in requirements

### 4. Cancellation Email (User)
- Sent when booking is cancelled
- Contains: Cancelled booking details
- Includes: Instruction to contact support if needed

## Troubleshooting

### Issue: "Not authorized, no token" when accessing API
**Solution**: Ensure you're sending the JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Issue: "Email service configuration error"
**Solution**: Check your .env file:
- Verify EMAIL_USER is correct Gmail address
- Verify EMAIL_PASS is the 16-character app password (not your Gmail password)
- Check if 2-Step Verification is enabled on your Google Account
- Restart the backend after updating .env

### Issue: Emails not being sent but no error message
**Solution**:
- Check Gmail Account Security settings
- Verify the app password is correct
- Check console logs for detailed error messages
- Try sending a test email manually

### Issue: "Less secure app access" error
**Solution**: 
- Use **App Passwords** instead of plain Gmail password
- Never use your actual Gmail password in .env
- Generate a new App Password if the previous one is old

## Using Different Email Services

### For Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### For AWS SES:
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
EMAIL_USER=your-ses-username
EMAIL_PASS=your-ses-password
```

### For Custom SMTP Server:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## Testing Endpoints

### Create a Booking (Triggers confirmation + admin notification)
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "hotel": "hotel-id",
  "room": "room-id",
  "checkIn": "2026-06-20T00:00:00Z",
  "checkOut": "2026-06-22T00:00:00Z",
  "guests": 2,
  "specialRequests": "Extra pillows please"
}
```

### Update Booking Status (Triggers approval email if confirmed)
```bash
PUT /api/bookings/:bookingId/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Cancel Booking (Triggers cancellation email)
```bash
PUT /api/bookings/:bookingId/cancel
Authorization: Bearer <token>
Content-Type: application/json
```

## Email Customization

To customize email templates, edit `backend/utils/emailService.js`:
- Modify HTML templates in each email function
- Update sender name in EMAIL_FROM
- Adjust colors, fonts, and layout as needed
- Add your company logo URL in HTML

## Security Notes

1. **Never commit .env file** with real credentials
2. Use environment-specific .env files in production
3. Store passwords in secure environment variable management
4. Rotate app passwords periodically
5. Monitor email sending logs in console

## Support

For issues or questions:
- Check Gmail Account Security settings
- Review console logs for error messages
- Test SMTP connection with a mail client
- Verify sender email address has permission to send from the domain
