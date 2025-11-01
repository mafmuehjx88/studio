# **App Name**: AT Game HUB

## Core Features:

- Authentication: User authentication via email/password with username validation. Includes login, registration, AuthGuard, and AdminGuard.
- Game Top-up: Display available game items with category filters and allow users to purchase with their wallet balance, including Game/Server ID input and insufficient balance alerts.
- Purchase Notification: Send a Telegram notification on successful purchase that includes Order ID, Game Name, Username, User ID, Server ID, Item Name, Payment Method, Order Time, via the `sendTelegramNotification` function.
- Wallet Management: Display current wallet balance, enable top-ups, and process top-up requests, allowing manual top-ups and displaying requests with admin approval capabilities.
- Top-up Request Notification: Notify admin via Telegram Bot API with a message containing Top-up ID, Username, Amount, and Request Time, accompanied by the payment screenshot when a user submits a top-up request.
- Admin Configuration: Enable admins to manually top-up user wallets, approve top-up requests, send announcements to users, and customize the marquee text displayed on the homepage.
- Data Access Control: Secure Firestore data with rules restricting user data access to owners, enabling public read access for product data with admin-only modification rights, and granting admins full access to all user data, leveraging collectionGroup for order listing.

## Style Guidelines:

- Color palette: Dark mode theme with background (#300A0A) for sleekness, foreground (#FCFCFC) for readability, and primary (#2E86AB) for interactive elements. Colors were chosen to create an atmosphere of elegance and high performance, which complements the user's core needs. 
- Font: 'Poppins' (sans-serif) for a geometric and contemporary feel across the entire application. Note: currently only Google Fonts are supported.
- Mobile-first layout with a max-width of 768px for main content areas to ensure optimal viewing on smaller screens.
- Fixed footer with Home, Orders, Wallet, and Profile navigation items for easy access.
- Header with 'AT Game HUB' title on the left and user wallet balance on the right, providing quick access to essential information.