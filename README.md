# pantry-tracker

PantryTrack — Full System Documentation
CCE Week Vibe Coding Competition | Team Bangan
TABLE OF CONTENTS

1. System Overview
2. Full Folder Structure
3. System Architecture Diagram
4. How Frontend + Backend + Database Connect
5. Database Design
6. Backend Deep Dive (Spring Boot)
7. Frontend Deep Dive (React + Vite)
8. Step-by-Step Setup Guide
9. API Endpoints Reference
10. What to Memorize for Defense
11. Judging Criteria Breakdown
12. Team Roles

1. System Overview
PantryTrack is a full-stack web application that helps households:

Track food inventory in real time
Monitor expiration dates and receive alerts
Reduce food waste by using items before they expire
Manage shopping lists
Layer	Technology	Port
Frontend	React 19 + Vite + Tailwind CSS	5173
Backend	Spring Boot 3 (Java)	8080
Database	MySQL 8	3306
2. Full Folder Structure
pantry-tracker/
│
├── backend/                                   ← Spring Boot Java Project
│   ├── src/main/java/com/teamBangan/pantrytracker/
│   │   ├── controller/
│   │   │   └── PantryController.java          ← Handles HTTP requests (API)
│   │   ├── model/
│   │   │   └── PantryItem.java                ← Represents one pantry item (maps to DB table)
│   │   ├── repository/
│   │   │   └── PantryRepository.java          ← Talks to the database
│   │   ├── service/
│   │   │   └── PantryService.java             ← Business logic layer
│   │   └── PantryTrackerApplication.java      ← Entry point (main method)
│   ├── src/main/resources/
│   │   ├── db/schema.sql                      ← SQL to create database tables
│   │   └── application.properties             ← DB connection settings
│   └── pom.xml                                ← Maven dependencies
│
└── frontend/                                  ← React + Vite Project
    ├── src/
    │   ├── types/
    │   │   └── pantry.ts                      ← TypeScript type definitions
    │   ├── context/
    │   │   ├── store/
    │   │   │   └── pantryStore.ts             ← State management (data + functions)
    │   │   └── AppContext.tsx                 ← React Context provider
    │   └── views/                             ← All UI (View layer only)
    │       ├── LoginView.tsx                  ← Login landing page
    │       ├── layout/
    │       │   ├── AppLayout.tsx              ← App shell (wraps all pages)
    │       │   ├── Sidebar.tsx                ← Left navigation
    │       │   └── Topbar.tsx                 ← Header (search, alerts, add)
    │       ├── components/
    │       │   ├── AddItemModal.tsx            ← Add/Edit item modal form
    │       │   ├── CategoryIcon.tsx            ← Food category emoji icons
    │       │   ├── ExpirationBadge.tsx         ← Fresh/Expiring/Expired badge
    │       │   └── PantryItemCard.tsx          ← Single item card UI
    │       └── pages/
    │           ├── DashboardPage.tsx           ← Home stats & alerts
    │           ├── InventoryPage.tsx           ← Full item list + filters
    │           ├── ExpiringPage.tsx            ← Items about to expire
    │           ├── ShoppingPage.tsx            ← Shopping list
    │           ├── SettingsPage.tsx            ← User settings
    │           └── NotFoundPage.tsx            ← 404 page
    ├── App.tsx                                ← Root router + auth gate
    ├── index.css                              ← Global styles + theme
    └── package.json                           ← Node dependencies

3. System Architecture Diagram
┌─────────────────────────────────────────────────────────┐
│                   USER'S BROWSER                         │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │           FRONTEND  (React + Vite)               │  │
│   │           http://localhost:5173                  │  │
│   │                                                  │  │
│   │  LoginView ──► AppLayout ──► Pages               │  │
│   │                  │                               │  │
│   │              Sidebar + Topbar                    │  │
│   │                  │                               │  │
│   │  Dashboard | Inventory | Expiring | Shopping     │  │
│   │  Settings                                        │  │
│   └─────────────────────┬────────────────────────────┘  │
└─────────────────────────│───────────────────────────────┘
                          │  HTTP Requests (fetch / axios)
                          │  GET, POST, PUT, DELETE
                          ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND  (Spring Boot / Java)               │
│              http://localhost:8080                       │
│                                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐ │
│  │  Controller  │──►│   Service    │──►│ Repository  │ │
│  │              │   │              │   │             │ │
│  │ REST API     │   │ Business     │   │ JPA / SQL   │ │
│  │ /api/pantry  │   │ Logic Layer  │   │ Queries     │ │
│  └──────────────┘   └──────────────┘   └──────┬──────┘ │
└────────────────────────────────────────────────│────────┘
                                                 │  JDBC
                                                 ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE  (MySQL 8)                         │
│              localhost:3306                              │
│              pantry_tracker_db                           │
│                                                          │
│   ┌──────────┐   ┌───────────────┐   ┌──────────────┐  │
│   │  users   │   │  pantry_items │   │ shopping_list│  │
│   └──────────┘   └───────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────────┘

4. How Frontend + Backend + Database Connect
The Request Flow (Step-by-Step)
User clicks "Add Item" in browser
        │
        ▼
React Frontend sends HTTP POST to:
http://localhost:8080/api/pantry
with JSON body: { name, quantity, category, expirationDate }
        │
        ▼
Spring Boot PantryController.java receives the request
@PostMapping → createItem(@RequestBody PantryItem item)
        │
        ▼
PantryService.java processes the request
saveItem(item) → validates and prepares data
        │
        ▼
PantryRepository.java sends SQL to MySQL
pantryRepository.save(item) → INSERT INTO pantry_items (...)
        │
        ▼
MySQL stores the row in pantry_items table
        │
        ▼
Response returns up the chain:
MySQL → Repository → Service → Controller → JSON Response
        │
        ▼
React Frontend receives the saved item
Updates the UI in real time (useState / useEffect)

CORS — Why It's Needed
The frontend (port 5173) and backend (port 8080) are on different ports. Browsers block this by default. The @CrossOrigin annotation in PantryController.java tells Spring Boot: "allow requests from http://localhost:5173".

@CrossOrigin(origins = "http://localhost:5173")

5. Database Design
Entity Relationship Diagram (ERD)
users
─────────────────────────────
PK  id          BIGINT  AUTO_INCREMENT
    name        VARCHAR(100)   NOT NULL
    email       VARCHAR(150)   UNIQUE NOT NULL
    password    VARCHAR(255)   NOT NULL
    avatar      VARCHAR(255)
    created_at  TIMESTAMP      DEFAULT NOW()
pantry_items
─────────────────────────────
PK  id              BIGINT   AUTO_INCREMENT
FK  user_id         BIGINT   → users.id  (CASCADE DELETE)
    name            VARCHAR(255)  NOT NULL
    category        ENUM(Produce, Dairy, Meat & Seafood,
                         Grains & Bread, Canned Goods,
                         Frozen, Beverages, Snacks,
                         Condiments, Spices, Other)
    quantity        DECIMAL(10,2)  DEFAULT 1.0
    unit            VARCHAR(50)    DEFAULT 'pcs'
    expiration_date DATE
    purchase_date   DATE           NOT NULL
    notes           TEXT
    added_at        TIMESTAMP      DEFAULT NOW()
    updated_at      TIMESTAMP      ON UPDATE NOW()
shopping_list
─────────────────────────────
PK  id         BIGINT  AUTO_INCREMENT
FK  user_id    BIGINT  → users.id  (CASCADE DELETE)
    name       VARCHAR(255)   NOT NULL
    category   VARCHAR(100)
    quantity   DECIMAL(10,2)  DEFAULT 1.0
    unit       VARCHAR(50)
    checked    BOOLEAN        DEFAULT FALSE
    added_at   TIMESTAMP      DEFAULT NOW()

Key Design Decisions
DECIMAL(10,2) for quantity — supports values like 1.5 lbs, 2.25 kg
ENUM for category — enforces only valid categories in the DB
ON DELETE CASCADE — deleting a user removes all their items
ON UPDATE CURRENT_TIMESTAMP — tracks when an item was last modified
updated_at auto-update — real-time tracking without extra code
6. Backend Deep Dive (Spring Boot)
MVC Pattern Explained
Layer	File	Responsibility
Model	PantryItem.java	Defines the data shape; maps to the DB table via @Entity
View	(Frontend handles this)	React renders the UI
Controller	PantryController.java	Receives HTTP requests, returns JSON responses
Service	PantryService.java	Contains business logic (validation, transformations)
Repository	PantryRepository.java	Talks directly to the database using Spring Data JPA
Key Annotations to Know
Annotation	Where	What it Does
@SpringBootApplication	Main class	Starts everything — enables auto-config, scanning, JPA
@RestController	Controller	Marks class as an API handler; responses are JSON
@RequestMapping("/api/pantry")	Controller	Sets the base URL path for all methods in this class
@CrossOrigin	Controller	Allows the frontend (different port) to call this API
@GetMapping	Method	Handles GET requests → reading data
@PostMapping	Method	Handles POST requests → creating data
@DeleteMapping("/{id}")	Method	Handles DELETE requests → removing data
@RequestBody	Parameter	Converts incoming JSON into a Java object
@PathVariable	Parameter	Extracts {id} from the URL
@Entity	Model class	Links the Java class to a database table
@Table(name="pantry_items")	Model class	Names the DB table
@Id	Model field	Marks the primary key
@GeneratedValue	Model field	Auto-increments the ID
@Column(nullable=false)	Model field	Adds a NOT NULL constraint
@Service	Service class	Marks it as a Spring-managed service bean
@Repository	Repository interface	Marks it as a Spring-managed repository bean
@Autowired	Field	Injects the dependency automatically (dependency injection)
application.properties Explained
# Connects to MySQL at localhost, port 3306, database: pantry_tracker_db
spring.datasource.url=jdbc:mysql://localhost:3306/pantry_tracker_db
# MySQL root credentials
spring.datasource.username=root
spring.datasource.password=563565
# Hibernate will auto-update the DB schema to match your @Entity classes
spring.jpa.hibernate.ddl-auto=update
# Print SQL queries in the console (useful for debugging)
spring.jpa.show-sql=true

7. Frontend Deep Dive (React + Vite)
Component Hierarchy
App.tsx
└── AppProvider (Context)
    └── AuthenticatedApp
        ├── LoginView          (shown when not logged in)
        └── AppLayout          (shown after login)
            ├── Sidebar
            ├── Topbar
            └── [Active Page]
                ├── DashboardPage
                ├── InventoryPage  ← AddItemModal
                ├── ExpiringPage
                ├── ShoppingPage
                └── SettingsPage

State Management Flow
pantryStore.ts  (all data + functions)
       │
       ▼
AppContext.tsx  (wraps the whole app, makes data available everywhere)
       │
       ▼
useApp() hook  (any component calls this to read/update data)
       │
       ▼
React re-renders the UI automatically when state changes

Key Frontend Concepts
Concept	Where Used	Purpose
useState	pantryStore.ts	Holds items, shoppingList, currentUser in memory
useCallback	pantryStore.ts	Memoizes functions so they don't recreate every render
useMemo	InventoryPage.tsx	Caches filtered/sorted items, recomputes only when needed
useContext	AppContext.tsx	Shares state across all components without prop drilling
useEffect	App.jsx	Fetches data from backend when user logs in
wouter	App.tsx	Client-side routing (replaces React Router)
@tanstack/react-query	App.tsx	Server state management for API calls
8. Step-by-Step Setup Guide
PREREQUISITES (Install These First)
Software	Version	Download
Java JDK	17 or 21	https://adoptium.net
Maven	3.9+	Comes with Spring Boot wrapper (mvnw)
MySQL	8.0+	https://dev.mysql.com/downloads/installer/
Node.js	18+	https://nodejs.org
VS Code	Latest	Optional — any editor works
STEP 1 — Set Up the Database
Open MySQL Workbench or MySQL Command Line
Log in with: mysql -u root -p (password: 563565)
Run the schema file:
CREATE DATABASE IF NOT EXISTS pantry_tracker_db;
USE pantry_tracker_db;
-- Run the full contents of schema.sql

Or paste the entire schema.sql content and execute it.

Verify it worked:
SHOW TABLES;
-- Should show: users, pantry_items, shopping_list

STEP 2 — Run the Backend
Open a terminal in the backend/ folder:

# Navigate to backend
cd C:\Users\MCJUPI\pantry-tracker\backend
# Option A — Use Maven Wrapper (recommended, no Maven install needed)
./mvnw spring-boot:run
# Option B — Windows
mvnw.cmd spring-boot:run
# Option C — If Maven is installed globally
mvn spring-boot:run

Success message to look for:

Started PantryTrackerApplication in 3.2 seconds (JVM running for 3.8)

Test it works — open browser and go to:

http://localhost:8080/api/pantry

Should return: [] (empty JSON array)

STEP 3 — Run the Frontend
Open a second terminal in the frontend/ folder:

# Navigate to frontend
cd C:\Users\MCJUPI\pantry-tracker\frontend
# Install dependencies (only needed first time)
npm install
# Start the dev server
npm run dev

Success message to look for:

VITE v5.x.x  ready in 300ms
➜  Local: http://localhost:5173/

Open browser: http://localhost:5173

STEP 4 — Verify Full Connection
Open http://localhost:5173 → Login page appears ✅
Sign in → Dashboard loads ✅
Click "Add Item" → Fill form → Save
Check database:
SELECT * FROM pantry_items;
-- Your new item should appear here ✅

COMMON ERRORS & FIXES
Error	Cause	Fix
Access to fetch blocked by CORS	CORS not configured	Verify @CrossOrigin(origins = "http://localhost:5173") is in PantryController
Connection refused on port 8080	Backend not running	Run mvnw spring-boot:run first
Unknown database 'pantry_tracker_db'	DB not created	Run schema.sql in MySQL
Access denied for user 'root'	Wrong password	Update spring.datasource.password in application.properties
Port 5173 already in use	Another process	Run npm run dev -- --port 5174
Module not found	Missing packages	Run npm install again
java.lang.ClassNotFoundException: com.mysql.cj.jdbc.Driver	MySQL connector missing	Check pom.xml has mysql-connector-j dependency
9. API Endpoints Reference
Base URL: http://localhost:8080

Method	Endpoint	Description	Request Body	Response
GET	/api/pantry	Get all pantry items	None	[PantryItem, ...]
POST	/api/pantry	Add a new item	{ name, quantity, category, expirationDate }	PantryItem
DELETE	/api/pantry/{id}	Delete item by ID	None	void
Example Request (POST)
POST http://localhost:8080/api/pantry
Content-Type: application/json
{
  "name": "Whole Milk",
  "quantity": 1.0,
  "category": "Dairy",
  "expirationDate": "2026-05-10"
}

Example Response
{
  "id": 1,
  "name": "Whole Milk",
  "quantity": 1.0,
  "category": "Dairy",
  "expirationDate": "2026-05-10"
}

10. What to Memorize for Defense
The "Elevator Pitch" (Say this when asked "what is your project?")
"PantryTrack is a full-stack web application built with React on the frontend and Spring Boot on the backend, connected to a MySQL database. It allows users to manage their home food inventory in real time, track expiration dates to reduce food waste, and manage shopping lists. The system follows the MVC architecture pattern."

Key Technical Questions & Answers
Q: What is MVC and how does your project use it?

MVC stands for Model-View-Controller. In our project:

Model is PantryItem.java — it defines the data structure and maps to the database table.
View is our React frontend — it renders the user interface.
Controller is PantryController.java — it handles HTTP requests and returns JSON responses. We also have a Service layer (PantryService.java) for business logic and a Repository (PantryRepository.java) for database access.
Q: What is CORS and why do you need it?

CORS stands for Cross-Origin Resource Sharing. Our frontend runs on port 5173 and our backend runs on port 8080. Browsers block requests between different ports by default as a security measure. We solved this by adding @CrossOrigin(origins = "http://localhost:5173") on our controller, which tells Spring Boot to accept requests from our frontend.

Q: What is Spring Data JPA / what does the Repository do?

Spring Data JPA is a framework that eliminates the need to write SQL manually. By extending JpaRepository<PantryItem, Long>, our PantryRepository automatically gets methods like findAll(), save(), deleteById(), and findById(). Hibernate (under the hood) translates these into SQL queries and communicates with MySQL.

Q: What is @Autowired?

It's Spring's Dependency Injection. Instead of creating objects manually with new, Spring automatically injects the correct instance. For example, @Autowired PantryRepository repo means Spring finds the repository bean and gives it to the controller automatically.

Q: Why use React Context / what is it?

React Context is a way to share state (data) across all components without passing props manually through every level. Our AppContext.tsx wraps the entire app, so any component — whether it's the Dashboard or the Shopping List — can access and update pantry data with just useApp().

Q: What does spring.jpa.hibernate.ddl-auto=update do?

It tells Hibernate to automatically update the database schema to match our Java @Entity classes when the app starts. So if we add a new field to PantryItem.java, Hibernate will add that column to the table automatically without us writing SQL.

Q: How does data flow from clicking "Add Item" to the database?

User fills the form in React → addItem() is called in pantryStore.ts
A fetch() / HTTP POST is sent to http://localhost:8080/api/pantry
PantryController.createItem() receives the JSON and converts it to a PantryItem Java object
PantryService.saveItem() is called for any business logic
PantryRepository.save() executes INSERT INTO pantry_items ... in MySQL
The saved item (with its new ID) is returned as JSON to the frontend
React updates the UI in real time
Q: What database did you use and why MySQL?

We used MySQL 8 because it is widely used in enterprise applications, integrates seamlessly with Spring Boot via the mysql-connector-j driver, and supports all the data types we needed — including DECIMAL for quantities, ENUM for categories, and DATE for expiration tracking.

Q: Explain your database design decisions.

We used DECIMAL(10,2) for quantity to support fractional amounts like 1.5 lbs.
We used ENUM for category to enforce data integrity — only valid categories can be stored.
We used ON DELETE CASCADE foreign keys so deleting a user automatically removes all their pantry items.
We added updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP for real-time tracking of when items were last modified.
11. Judging Criteria Breakdown
Criteria	Weight	How We Address It
Logic & Functionality	25%	Full CRUD operations (Create, Read, Delete). Real-time expiration tracking with color-coded status. Shopping list with move-to-pantry feature. Filtering, sorting, and search across all inventory.
Database Design	15%	3 normalized tables (users, pantry_items, shopping_list). Foreign keys with CASCADE. ENUM for categories. DECIMAL for quantities. Timestamps for audit trail.
Documentation & Implementation	15%	This document. Clear MVC architecture. Commented code. API reference. Setup guide. ERD diagram.
AI Utilization	10%	AI tools used responsibly for code generation, debugging assistance, and documentation writing while maintaining clear understanding of every line of code.
System Architecture & Code Quality	10%	Strict MVC pattern. Separation of concerns (Controller/Service/Repository). Typed TypeScript frontend. React Context for state. Component-based UI architecture.
Technical Explanation & Defense	10%	Use the Q&A section above. Be able to explain every file, every annotation, every design decision.
Role & Team Collaboration	10%	Frontend Developer, Backend Developer, QA/DevOps — each member owns their layer and can explain it independently.
User Interface & Experience	5%	Clean green theme. Responsive layout. Animated transitions. Real-time expiration badges. Dark mode support.
12. Team Roles
Role	Responsibilities	Key Files to Know
Frontend Developer	React UI, routing, state management, API calls	App.tsx, pantryStore.ts, AppContext.tsx, all views/pages
Backend Developer	Spring Boot API, business logic, database mapping	PantryController.java, PantryService.java, PantryItem.java, PantryRepository.java, application.properties
QA / DevOps	Testing, setup verification, deployment, documentation	schema.sql, pom.xml, package.json, this documentation, running both servers
Quick Reference Card (Print This)
┌────────────────────────────────────────────────────┐
│              PANTRYTRACK QUICK REFERENCE           │
├────────────────────────────────────────────────────┤
│  START ORDER:                                      │
│  1. Start MySQL (check it's running on 3306)       │
│  2. cd backend → mvnw.cmd spring-boot:run          │
│  3. cd frontend → npm run dev                      │
│  4. Open http://localhost:5173                     │
├────────────────────────────────────────────────────┤
│  PORTS:                                            │
│  Frontend  → http://localhost:5173                 │
│  Backend   → http://localhost:8080                 │
│  Database  → localhost:3306                        │
│  DB Name   → pantry_tracker_db                    │
│  DB User   → root  |  DB Pass → 563565            │
├────────────────────────────────────────────────────┤
│  API ENDPOINTS:                                    │
│  GET    /api/pantry       → get all items          │
│  POST   /api/pantry       → create item            │
│  DELETE /api/pantry/{id}  → delete item            │
├────────────────────────────────────────────────────┤
│  KEY PATTERN:                                      │
│  Browser → React → fetch() → Controller           │
│         → Service → Repository → MySQL            │
└────────────────────────────────────────────────────┘

PantryTrack | Team Bangan | CCE Week Vibe Coding Competition


PROGRAM SCREENSHOTS:




LANDING PAGE / LOGIN PAGE
<img width="1280" height="720" alt="XcTDxmJ" src="https://github.com/user-attachments/assets/9d80c629-d34a-4632-b20d-235767b5febd" />

DASHBOARD
<img width="1280" height="720" alt="CHc7e54" src="https://github.com/user-attachments/assets/a7469a12-6a14-4613-8a9e-7a2aec5de1bc" />


<img width="1280" height="720" alt="CHc7e54" src="https://github.com/user-attachments/assets/189f5bed-15ca-44ff-bbde-66e41c5d11da" />


<img width="1280" height="720" alt="CHc7e54" src="https://github.com/user-attachments/assets/dd27db8c-fd83-4670-9c11-4eb1860d752f" />


<img width="1280" height="720" alt="tviSZBx" src="https://github.com/user-attachments/assets/03817c35-3ef2-4984-958d-5c3c8f91a6a4" />


<img width="1280" height="720" alt="ISEnPU5" src="https://github.com/user-attachments/assets/fd270057-323a-4c37-b830-85d19f6dd129" />






