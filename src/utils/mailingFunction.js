function welcomeMailTemplate(data) {
  const { otp } = data; // Destructure the otp value from the data object

  return `
    <html>
        <body>
          <h2>Welcome!</h2>
          <p>Thank you for registering with us. Your One-Time Password (OTP) for verifying your account is:</p>
          <h3 style="color: #4CAF50; font-size: 24px;">${otp}</h3>
          <p>This OTP will expire in 10 minutes. Please enter it within that time frame to complete your registration.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>Your Company Team</p>
        </body>
    </html>`;
}

// Define the OTP email template function
function otpMailTemplate(data) {
  const { otp } = data; // Destructure the otp value from the data object

  return `
    <html>
        <body>
          <h2>Welcome!</h2>
          <p>Thank you for registering with us. Your One-Time Password (OTP) for verifying your account is:</p>
          <h3 style="color: #4CAF50; font-size: 24px;">${otp}</h3>
          <p>This OTP will expire in 10 minutes. Please enter it within that time frame to complete your registration.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>Your Company Team</p>
        </body>
    </html>`;
}

function AdminBookingMailTemplate(data) {
  const {
    pnr = "NA",
    email,
    phoneNumber,
    totalAmount,
    passengerDetails = [],
    onward = {},
    return: returnData = null,
    status,
    paymentStatus,
  } = data;

  const formatFlightDetails = (flights) => {
    return flights
      .map(
        (flight) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <div><strong>Flight:</strong> ${flight.carrier} ${flight.number}</div>
          <div><strong>Departure:</strong> ${flight.departure.location} | ${
          flight.departure.date
        } ${flight.departure.time} Terminal: ${
          flight.departure.terminal || "N/A"
        }</div>
          <div><strong>Arrival:</strong> ${flight.arrival.location} | ${
          flight.arrival.date
        } ${flight.arrival.time} Terminal: ${
          flight.arrival.terminal || "N/A"
        }</div>
          <div><strong>Duration:</strong> ${flight.duration}</div>
        </div>`
      )
      .join("");
  };

  // <td style="border: 1px solid #ddd; padding: 8px;">₹${pax.amount}</td>
  const formatPassengers = () => {
    return passengerDetails
      .map(
        (pax) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${pax.title} ${pax.firstName} ${pax.lastName}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${pax.gender}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${pax.dob}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${pax.passportNumber}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${pax.paxType}</td>
          </tr>`
      )
      .join("");
  };

  return `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="max-width: 700px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="text-align: center; color: #007bff;">Flight Booking Summary</h2>

        <p><strong>PNR:</strong> ${pnr}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Total Amount:</strong> AUD ${totalAmount}</p>

        <h3 style="color: #444;">Passengers</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Gender</th>
              <th style="border: 1px solid #ddd; padding: 8px;">DOB</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Passport</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Type</th>
             
            </tr>
          </thead>
          <tbody>
            ${formatPassengers()}
          </tbody>
        </table>

        <h3 style="color: #444;">Onward Flight (${onward.origin} → ${
    onward.destination
  })</h3>
        ${formatFlightDetails(onward.airlineDetails || [])}

        ${
          returnData && returnData.origin && returnData.destination
            ? `
          <h3 style="color: #444;">Return Flight (${returnData.origin} → ${
                returnData.destination
              })</h3>
          ${formatFlightDetails(returnData.airlineDetails || [])}
        `
            : ""
        }

        <div style="margin-top: 20px;">
          <p><strong>Booking Status:</strong> ${status}</p>
          <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        </div>
      </div>
    </body>
  </html>
  `;
}

// Export the function so it can be used in other files
module.exports = {
  welcomeMailTemplate,
  otpMailTemplate,
  AdminBookingMailTemplate,
};
