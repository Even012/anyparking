# **Car Space Renting Management System**

## **Project Description**
The **Car Space Renting Management System** is a web-based platform that facilitates the renting and booking of car spaces. In densely populated urban areas where parking is scarce, this system allows providers to list their unused car spaces and make them available to consumers for booking. The platform serves three types of users: **admin**, **provider**, and **consumer**. Admins manage the platform, providers can register their car spaces, and consumers can book available car spaces based on their needs.

---

## **Table of Contents**
- [Technologies used](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

---

## **Technologies**
- Frontend: React for building the user interface.
- Server: Express.js for handling API requests.
- Database: MongoDB for storing contact data.
- Docker: For containerizing the application.
- Documatation: Swagger UI for api documatation.

## **Installation**

### **Prerequisites**
- Node.js v14.x or higher
- npm (Node package manager)
- MongoDB (for NoSQL database)

### **Steps to Install**

1. Clone the repository:

   ```bash
   git clone https://github.com/Even012/anyparking.git

2. Run the app

   Run the app backend
   ```bash
   cd anyparking/backend
   npm install
   node app.js
   ```
   
   Run the app frontend
   ```bash
   cd anyparking/frontend
   npm install
   npm start
   ```
   
4. View the app

   View the app backend
   ```bash
   http://localhost:8888/api-docs/
   ```

   View the app frontend
   ```bash
   http://localhost:3000/
   ```

## **Usage**

### For Providers
- Providers can register their car spaces by providing details such as address, cost per hour/day, availability, and bank account details.
- They can also update or delete the details of their registered car spaces.

### For Consumers
- Consumers can search for available car spaces by entering a location or browsing through listed spaces.
- They can view the details of each car space, such as its address, availability, and price per hour/day.
- Consumers can book a car space by specifying the duration of their booking.
- Payments can be made online after booking. (to do)
- Consumers can view, like, and cancel their bookings at any time.
- The system automatically recommends new car spaces based on the consumer’s past bookings and preferences. (to do)

### For Admins (to do)
- Admins can manage all registered car spaces.
- They can view, update, and delete car space details as necessary.
- Admins can also oversee all bookings and payments.


## **Features**
### User Roles: 
- Three user types (Admin, Provider, Consumer), each with different access levels.
### Car Space Management:
- Providers can register, update, and delete car spaces.
- Admins have full control over all registered car spaces.
### Booking Management:
- Consumers can browse available car spaces and book them for a specific time.
- The system calculates total booking costs based on hourly/daily rates.
- Consumers can cancel bookings within a certain time period.
### Billing and Payments:
- Consumers can pay for bookings online.
- The system deducts a 15% service fee and transfers the remaining payment to the provider’s bank account.
- Automatic bill generation for consumers.
### Car Space Recommendations: 
- Personalized recommendations based on past bookings.
### Security:
- User authentication (admin, provider, consumer) for sensitive data updates.
- Data validation to ensure availability of car spaces during booking.
- Feedback System: Consumers can leave feedback by “liking” a car space they have used.
- Auto-Cancel: Reservations automatically cancel if not confirmed within a specific time window.
