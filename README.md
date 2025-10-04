# Algebra Academy Online

## 🎓 About the Project

Complete mathematics tutoring booking system with secure Stripe payment integration, administrative dashboard, and intelligent reservation system.

## 📁 Project Structure

```
algebra-academy-online/
├── src/                    # React application source code
├── supabase/              # Edge functions and database
├── docs/                  # Documentation (organized by category)
│   ├── guides/           # User and admin guides
│   ├── troubleshooting/  # Problem resolution docs
│   └── deployment/       # Deployment instructions
├── scripts/              # Utility scripts and automation
│   ├── sql/             # Database scripts and maintenance
│   └── deployment/      # Build and deploy automation
├── public/              # Static assets
└── utils/               # Utility functions
```

## 🚀 How to Test the Payment System

### 1. **Start the Development Server**

```sh
npm run dev
```

The server will be available at: http://localhost:8080 (or next available port)

### 2. **Navigate Through the System**

- Access the homepage
- Click "Book Now" or "Schedule Lesson"
- Choose one of the services:
  - **Primary School** - £25
  - **Secondary School** - £30
  - **A-level** - £35

### 3. **Configure Your Booking**

- Select lesson type (Single Lesson or Recurring)
- Choose a date (for Single Lessons: between 7 days and 24 hours before)
- Select an available time slot
- Fill in student information

### 4. **Checkout Process - STRIPE TEST**

- Click "Proceed to Payment"
- **Verify that the Stripe form appears**
- **Use Stripe test data:**
  ```
  Card Number: 4242 4242 4242 4242
  Expiry: 12/34
  CVC: 123
  Name: Any name
  ```

### 5. **Payment Confirmation**

- After entering the data, click "Pay Now"
- You'll be redirected to the success page
- The booking will be saved to the database

## 🛠️ Testable Features

### ✅ **Booking System**

- Date validation (Single lessons: 7 days to 24h before)
- Double booking prevention
- Dynamic available time slots

### ✅ **Secure Payments**

- Complete Stripe integration
- Automatic refunds for administrators
- Recurring payment support

### ✅ **Administrative Dashboard**

- View all bookings
- Cancel and refund lessons
- User and permission management

### ✅ **Authentication**

- Login/registration system with Supabase
- Role-based access control (admin/tutor/student)
- Personalized dashboards by user type

## 💳 Additional Stripe Test Data

| Scenario  | Card Number         | Result           |
| --------- | ------------------- | ---------------- |
| Success   | 4242 4242 4242 4242 | Payment approved |
| Decline   | 4000 0000 0000 0002 | Card declined    |
| 3D Secure | 4000 0000 0000 3220 | Requires auth    |

**All test mode payments are free and won't generate real charges!**

## 🔧 Troubleshooting

### Common Issues

- **Stripe form not appearing**: Check if `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- **Payment fails**: Verify `STRIPE_SECRET_KEY` is configured in Supabase Edge Functions
- **Booking validation errors**: Single lessons must be booked 7 days to 24 hours in advance
- **Permission errors**: Ensure user roles are properly assigned in the database

### Support

For issues or questions about the payment system, check:

1. Browser console for JavaScript errors
2. Supabase Edge Function logs for backend errors
3. Stripe Dashboard for payment status

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 📚 Documentation

The project documentation is now organized in the `/docs` directory:

- **[/docs/guides/](docs/guides/)** - User and admin operational guides
- **[/docs/troubleshooting/](docs/troubleshooting/)** - Problem resolution documentation
- **[/docs/deployment/](docs/deployment/)** - Deployment and configuration instructions
- **[/scripts/sql/](scripts/sql/)** - Database scripts and maintenance tools

Each directory contains its own README with detailed information about contents and usage.

## 🛠️ Development Tools

### Database Scripts

All SQL scripts are organized in `/scripts/sql/` with categories:

- Setup and configuration scripts
- Testing and validation scripts
- Maintenance and cleanup scripts
- Emergency repair scripts

### Utility Scripts

Helper scripts and automation tools are in `/scripts/`:

- Deployment automation
- Configuration management
- Testing utilities

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

⚠️ Security Notice
Never commit real API keys or credentials to this repository.
Always use environment variables stored in a `.env.local` file
and keep it in `.gitignore`.
