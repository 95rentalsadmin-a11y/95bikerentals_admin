# 95 Bike Rentals - Admin Panel Wireframes

This document outlines the layout and UX for the admin panel.

## Brand Colors

- Primary: `#00bcd4` (turquoise-blue)
- Success: `#00c853` (mint-green)
- Warning: `#ff9800` (orange)
- Danger: `#e91e63` (hot-pink)
- Background: `#f8fafc` (slate-50)
- Sidebar: `#0f172a` (slate-900)

---

## 1. Login Page

A centered, card-based login screen on a dark gradient background.

```
+------------------------------------------+
|                                          |
|            [bike icon]                   |
|         95 Bike Rentals                  |
|            Admin Panel                   |
|                                          |
|   Username: [ admin              ]      |
|   Password: [ ••••••              ]      |
|                                          |
|   [        Sign In               ]      |
|                                          |
+------------------------------------------+
```

- Fields: username, password
- Demo credentials: `admin / admin`
- On success: redirect to `/`

---

## 2. Layout (Authenticated)

A classic sidebar + top header + content area layout.

```
+--------------------------------------------------+
| 95 Bike Rentals |  Dashboard      [bell] [Admin] |
| Admin Panel    |                                  |
|                 +----------------------------------+
| [Dashboard]     |                                  |
| [Bookings]      |       PAGE CONTENT               |
| [Bikes]         |                                  |
| [Customers]     |                                  |
|                 |                                  |
| [Logout]        |                                  |
+--------------------------------------------------+
```

- Sidebar: fixed width, dark background, active item highlighted in turquoise
- Header: page title, notifications, user avatar
- Content: scrollable main area with white cards on slate background

---

## 3. Dashboard Page

Overview cards + quick activity panel.

```
+--------------------------------------------------+
| [Total Bookings] [Active Rentals] [Available Bikes] [Revenue] |
|                                                              |
| +------------------------+ +-----------------------+        |
| | Recent Activity        | | Quick Actions         |        |
| | • New booking #B-1024  | | [Add New Bike]        |        |
| | • Booking completed    | | [Pending Bookings]    |        |
| | • Bike returned late   | | [Generate Report]     |        |
| | • New bike added       | | [Manage Customers]    |        |
| +------------------------+ +-----------------------+        |
+--------------------------------------------------+
```

- 4 stat cards with icons and brand colors
- Recent activity feed
- Quick action buttons

---

## 4. Bookings Page

A searchable and filterable table of all bookings.

```
+--------------------------------------------------+
| All Bookings    [Search by name/phone] [All Status]|
+--------------------------------------------------+
| ID      | Bike            | Customer    | Duration | Amount | Status | Actions |
| B-1024  | Honda Activa    | Rahul S.    | 24h      | ₹580   | pending | [eye][check][x] |
| B-1023  | Honda Shine     | Priya M.    | 48h      | ₹1160  | confirmed | ... |
| B-1022  | Aether 450X     | Arun K.     | 8h       | ₹600   | completed | ... |
+--------------------------------------------------+
```

- Columns: booking ID, bike, customer, duration, amount, status, actions
- Status badges: pending (yellow), confirmed (green), cancelled (red), completed (slate)
- Actions: view, confirm, cancel
- Filters: search by name/phone, status dropdown

---

## 5. Bikes Page

A grid of bike cards with availability toggle.

```
+--------------------------------------------------+
| [Search bikes]              [+ Add New Bike]     |
+--------------------------------------------------+
| +----------------+  +----------------+  +----------------+ |
| |   [bike image] |  |   [bike image] |  |   [bike image] | |
| | Honda Activa   |  | Honda Shine    |  | Aether 450X    | |
| | scooter        |  | motorcycle     |  | electric       | |
| | [tag] [tag]    |  | [tag] [tag]    |  | [tag] [tag]    | |
| | ₹580/day   [edit] [toggle] |  | ... |  | ... |  |
| +----------------+  +----------------+  +----------------+ |
+--------------------------------------------------+
```

- Cards: image placeholder, name, category, feature tags, daily rate
- Availability badge and toggle switch
- Edit action

---

## 6. Customers Page

A table of registered customers with booking history.

```
+--------------------------------------------------+
| Customers                                        |
+--------------------------------------------------+
| Customer    | Contact            | ID Proof      | Bookings | Actions     |
| Rahul S.    | 9876543210         | Aadhaar       | 5        | [View History] |
| Priya M.    | 9123456789         | DL            | 3        | [View History] |
| Arun K.     | 9988776655         | Passport      | 8        | [View History] |
+--------------------------------------------------+
```

- Columns: customer name, phone/email, ID proof, total bookings
- Action: view full booking history

---

## Future Enhancements

- Admin user management (superadmin vs admin roles)
- Revenue charts and analytics dashboard
- Bulk booking status updates
- Customer verification workflow
- Bike maintenance logs
- Dark mode toggle
