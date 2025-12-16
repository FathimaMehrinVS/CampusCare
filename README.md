# CampusCare – Lost and Found Management System

CampusCare is a simple, web-based **Lost and Found Management System** designed for college campuses. It provides a centralized platform where students and campus members can report found items and browse available items to reclaim their lost belongings.

This project is built as a lightweight single-page web application with a cloud-based backend, focusing on ease of use, accessibility, and minimal setup.

---

## 📌 Project Overview

* **Project Name:** CampusCare – Lost and Found Management System
* **Type:** Web Application (Single Page Application)
* **Purpose:** To help students report found items and search for lost items within a campus environment
* **Backend-as-a-Service:** Supabase
* **Frontend Styling:** Tailwind CSS

---

## 🎯 Key Features

### 1. Report a Found Item

Users who find an item on campus can submit its details through a form.

* Item Name (required)
* Location Found (required)
* Description
* Image URL (optional)
* Contact Email (required)

Once submitted, the item is stored in the database with the status **Available**.

---

### 2. Browse Available Items

Users who have lost an item can browse a public list of all available found items.

* Items are displayed in a grid or list view
* Most recently reported items appear first
* Each item shows:

  * Name
  * Image or placeholder
  * Location found
  * Description
  * Finder’s contact email

---

### 3. Claim an Item

When an item has been returned to its owner:

* Users can click **“Mark as Claimed”**
* Confirmation is required before updating
* Claimed items are removed from the public listing

---

## 👥 User Roles

There is no formal authentication system. Any user can act as:

* **Finder:** Reports a found item
* **Seeker:** Browses and claims items

Users are expected to act in good faith and provide accurate information.

---

## 🛠 Tech Stack

### Frontend

* HTML (single-page structure)
* Vanilla JavaScript
* Tailwind CSS for styling

### Backend

* Supabase (Backend-as-a-Service)
* PostgreSQL database
* Supabase JavaScript Client

---

## 🗄 Database Schema

**Table:** `found_items`

| Field Name    | Description                   |
| ------------- | ----------------------------- |
| id            | Unique identifier             |
| item_name     | Name of the item              |
| description   | Item description              |
| location      | Location where item was found |
| image_url     | URL of item image             |
| contact_email | Finder’s email                |
| status        | Available / Claimed           |
| found_date    | Date item was reported        |

---

## 🔒 Security & Privacy

* Public read and insert access via Supabase
* Row Level Security (RLS) used to protect data integrity
* No delete access for unauthorized users
* All communication occurs over HTTPS
* User-provided text is sanitized to prevent XSS attacks

⚠️ **Note:** Contact emails are publicly visible to enable item recovery.

---

## ⚙ Operating Environment

* Any modern web browser (Chrome, Firefox, Edge, Safari)
* JavaScript enabled
* Stable internet connection
* No local server or installation required

---

## 🚫 Limitations

The system does **not**:

* Support user authentication or login
* Provide real-time chat or messaging
* Manage physical handover of items

---

## 📈 Non-Functional Requirements

* Page load time under 3 seconds
* Form submission under 2 seconds
* Responsive design for mobile and desktop
* Easy to maintain due to single-file frontend

---

## 📚 References

* Supabase Documentation
* Tailwind CSS Documentation

---

## ✨ Team Members

* Christo Berly
* Christo E Mathew
* Esha Byju Nair
* Fathima Mehrin V S

---

## 📄 License

This project is developed for academic purposes as part of a campus-based software project.
