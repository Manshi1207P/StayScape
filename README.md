# 🏡 StayScape

StayScape is a full-stack stays-listing web app inspired by Airbnb. Hosts can publish properties with photos, and guests can browse, search, and review them. Each listing page shows its location on an interactive map.

Built with **Node.js, Express, MongoDB, and EJS** using an MVC-style structure.

## ✨ Features

- **Authentication**: sign up, log in, and log out with Passport (local strategy). Passwords are hashed and salted. Sessions are stored in MongoDB.
- **Listings CRUD**: create, view, edit, and delete listings (title, description, price, location, country, image).
- **Image uploads**: photos go to Cloudinary through Multer. If you don't upload one, a default image is used.
- **Search**: case-insensitive search across title, location, and country.
- **Reviews and ratings**: logged-in users can leave a star rating and a comment. Only the author can delete their own review.
- **Interactive map**: locations are geocoded with the Mapbox API and shown with Mapbox GL on each listing page. If no `MAP_TOKEN` is set, the app still works without maps.
- **Authorization**: only a listing's owner can edit or delete it. Only a review's author can delete it.
- **Validation and error handling**: Joi schema validation, a central error handler, a custom 404 page, and flash messages.
- **Cascade delete**: deleting a listing also deletes its reviews.
- **Seed script**: loads sample listings and a demo host account.

## 🛠 Tech Stack

| Layer | Technologies |
| --- | --- |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Views | EJS, ejs-mate (layouts), Bootstrap 5, CSS |
| Auth | Passport, passport-local, passport-local-mongoose, express-session, connect-mongo |
| Uploads | Multer, Cloudinary, multer-storage-cloudinary |
| Maps | Mapbox GL JS, Mapbox SDK (geocoding) |
| Validation | Joi |
| Other | connect-flash, method-override, dotenv |

## 📁 Project Structure

```
StayScape/
├── app.js                # App entry point: config, sessions, passport, routes, error handling
├── cloudConfig.js        # Cloudinary + Multer storage setup
├── middleware.js         # isLoggedIn, isOwner, isReviewAuthor, validators
├── schema.js             # Joi validation schemas
├── controllers/          # Route handlers (listing, reviews, users)
├── models/               # Mongoose models (Listing, Review, User)
├── routes/               # Express routers (listing, review, user)
├── views/                # EJS templates (layouts, includes, listings, users, error)
├── public/               # Static assets (css, js, including map.js)
├── utils/                # wrapAsync, ExpressError, geocode helper
└── init/                 # Seed data and seeding script
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A MongoDB database (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)
- A [Mapbox](https://www.mapbox.com/) access token (optional, for maps and geocoding)

### Installation

```bash
git clone https://github.com/<your-username>/StayScape.git
cd StayScape
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/stayscape
SECRET=your_session_secret

# Cloudinary (image uploads)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Mapbox (optional: maps and geocoding)
MAP_TOKEN=your_mapbox_access_token

# Optional
PORT=8080
SEED_USER_PASSWORD=password_for_demo_host_account
```

> `.env` is git-ignored. Never commit your secrets.

### Seed the database (optional)

```bash
npm run seed
```

This clears existing listings and reviews, creates a demo host user (`stayscape_host`), and inserts the sample listings. If `SEED_USER_PASSWORD` isn't set, a random password is generated.

### Run the app

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080).

## 🔗 Routes

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| GET | `/listings` | All listings | – |
| GET | `/listings/search?q=` | Search listings | – |
| GET | `/listings/new` | New listing form | Logged in |
| POST | `/listings` | Create a listing | Logged in |
| GET | `/listings/:id` | Listing details, reviews, map | – |
| GET | `/listings/:id/edit` | Edit form | Owner |
| PUT | `/listings/:id` | Update a listing | Owner |
| DELETE | `/listings/:id` | Delete a listing | Owner |
| POST | `/listings/:id/reviews` | Add a review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review author |
| GET/POST | `/signup` | Register | – |
| GET/POST | `/login` | Log in | – |
| GET | `/logout` | Log out | – |

## 🗄 Data Models

- **User**: `email`, plus `username`, hashed `password` and `salt` from passport-local-mongoose
- **Listing**: `title`, `description`, `image {url, filename}`, `price`, `location`, `country`, `geometry` (GeoJSON Point), `owner` (User), `reviews` (Review[])
- **Review**: `comment`, `rating` (1–5), `createdAt`, `author` (User)

## 🔒 Security Notes

- Passwords are hashed and salted by passport-local-mongoose.
- Session cookies are `httpOnly` and signed with `SECRET`.
- Search input is regex-escaped to prevent regex injection.
- Map popups are built with DOM nodes, so listing titles can't inject markup.
- Secrets live in environment variables, not in the code.

## 🌱 Possible Improvements

- Booking and availability calendar
- Listing categories and filters (price, rating)
- Pagination
- Automated tests

## 👩‍💻 Author

**Kumari Manshi**

## 📄 License

This project is licensed under the ISC License.
