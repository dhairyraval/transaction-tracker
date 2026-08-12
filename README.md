# Transaction Tracker

## Live Demo
Hosted on Render.com
* Live Demo: [here](https://transaction-tracker-xd2i.onrender.com/) (First start may take a few minutes)

## Setup Instructions

### 1. Clone repo using HTTPS
```bash
git clone https://github.com/dhairyraval/transaction-tracker.git
```

### 2. Run the following commands:

```bash
    # move into cloned folder
    cd transaction-tracker

    # install dependencies
    npm run build
```


### 3.Environment Variables Setup

Before running the application, you need to configure your environment variables.

1. Navigate to the `server` directory and create a `.env` file (you can copy the provided template):
   ```bash
   cd server
   cp .env.example .env
   ```

2. Open `.env` and fill in the required values:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGO_URI= <YOUR_MONGODB_CONNECTION_STRING>
   ```

---

Don't have a mongoDB cluster setup? [Click here](https://www.mongodb.com/docs/atlas/)

## MongoDB Schema
```json
date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
```
### Index descriptions:
* ```transactionSchema.index({ date: -1 });```
    * Chronological sorting by date (descending)

* ```transactionSchema.index({ amount: -1 });```
    * Chronological sorting by amount (descending)

* ```transactionSchema.index({ type: 1, date: -1 });```
    * Group by type + sort by date (desc.)
* ```transactionSchema.index({ type: 1, amount: -1 });```
    * Group by type + sort by amount (desc.)

* ```transactionSchema.index({ category: 1, date: -1 });```
    * Group by category + sort by date (desc.)
* ```transactionSchema.index({ category: 1, amount: -1 });```
    * Group by category + sort by amount (desc.)
* ```transactionSchema.index({ description: 'text'});```
    * Searchable index for description - used in search bar

---

## API Endpoints
### Transactions

#### 1. Get All Transactions
* **Endpoint:** `GET /api/transactions/?{params}`
* **Access:** Public
* **Description:** Retrieves all transactions

**Request:**
* `GET .../api/transactions/?limit=10`

**Response (`200 OK`):**
Returns list of transations based on query param filters
```json
{
    "data": [
        {
            "_id": "6a7abd3278f5daa17ee54d0d",
            "date": "2025-08-06T00:00:00.000Z",
            "description": "Ola Cabszzz",
            "amount": 9001,
            "type": "DEBIT",
            "category": "Transport",
            "__v": 0
        }, 
        //{...remainging transactions}  
    ],
    "pagination": {
        "totalItems": 83,
        "totalPages": 9,
        "currPage": 1,
        "limit": 10
    }
}
```
#### 2. Get individual Transaction
* **Endpoint:** `GET /api/transactions/:id`
* **Access:** Public
* **Description:** Retrieves a single transaction

**Request:**
* `GET .../api/transactions/:id`

**Response (`200 OK`):**
Returns requested transaction
```json
{
    "_id": "6a7abd3278f5daa17ee54d0d",
    "date": "2025-08-06T00:00:00.000Z",
    "description": "Ola Cabszzz",
    "amount": 9001,
    "type": "DEBIT",
    "category": "Transport",
    "__v": 0
}
```
#### 3. Upload New Transactions
* **Endpoint:** `POST /api/transactions/upload`
* **Access:** Public
* **Description:** Upload a csv file with a list of transactions

**Request:**
* `POST .../api/transactions/upload`
* form-data: `csvFile: <file>`

**Response (`201 Created`):**
Returns list of uploaded transactions
```json
{
    "message": "Upload complete!",
    "processedLines": 100,
    "savedLines": 87,
    "skippedCount": 13,
    "skippedDetails": [
        {
            "line": 7,
            "reason": "Invalid amount",
            "rowData": {
                "Date": "2025-07-03",
                "Description": "Amazon.in order",
                "Amount": "",
                "Type": "DEBIT",
                "Category": "Shopping"
            }
        },
        {
            "line": 8,
            "reason": "Invalid amount",
            "rowData": {
                "Date": "2025-07-04",
                "Description": "Netflix subscription",
                "Amount": "abc",
                "Type": "DEBIT",
                "Category": "Entertainment"
            }
        },
        //{...info about rest of the lines skipped}
    ]
}
```
#### 4. Edit a Transaction
* **Endpoint:** `PUT /api/transactions/:id`
* **Access:** Public
* **Description:** Edit a single transaction

**Request:**
* `PUT .../api/transactions/:id`
* path variables: `id: 6a7abd3278f5daa17ee54d0d`
* request body: `{
    "amount": 123456,
    "description": "test update"
}`

**Response (`200 OK`):**
Returns updated transaction
```json
{
    "_id": "6a7abd3278f5daa17ee54d0d",
    "date": "2025-08-06T00:00:00.000Z",
    "description": "test update",
    "amount": 123456,
    "type": "DEBIT",
    "category": "Transport",
    "__v": 0
}
```
#### 5. Delete a Transaction
* **Endpoint:** `DELETE /api/transactions/:id`
* **Access:** Public
* **Description:** Deletes a single transaction

**Request:**
* `DELETE .../api/transactions/:id`
* path variables: `id: 6a7abd3278f5daa17ee54d08`

**Response (`200 OK`):**
Returns deleted transaction
```json
{
    "_id": "6a7abd3278f5daa17ee54d08",
    "date": "2025-08-04T00:00:00.000Z",
    "description": "Uber ride",
    "amount": 236.15,
    "type": "DEBIT",
    "category": "Transport",
    "__v": 0
}
```
#### 6. Get Summary of Transactions
* **Endpoint:** `GET /api/summary`
* **Access:** Public
* **Description:** Get concise summary of saved transactions, includes:
    - Total money in
    - Total money out
    - Net difference
    - Totals based on transaction categories
    - Monthly totals
    - List of top 5 biggest transactions
    - Total number of transactions

**Request:**
* `GET .../api/summary/`

**Response (`200 OK`):**
Returns summary of transactions
```json
{
    "totals": {
        "_id": null,
        "totalIn": 186838,
        "totalOut": 329232.9
    },
    "netDiff": -142394.90000000002,
    "categoriesTotals": [
        {
            "_id": "Groceries",
            "totalAmounts": 71401.38
        },
        {
            "_id": "Salary",
            "totalAmounts": 184000
        },
        //{...totals for rest of categories}
    ],
    "monthlyTotals": [
        {
            "_id": {
                "year": 2025,
                "month": 8
            },
            "totalIn": 0,
            "totalOut": 156552.64
        },
        {
            "_id": {
                "year": 2025,
                "month": 7
            },
            "totalIn": 186838,
            "totalOut": 172680.26
        }
    ],
    "expenses": [
        {
            "_id": "6a7abd3278f5daa17ee54d0d",
            "date": "2025-08-06T00:00:00.000Z",
            "description": "test update",
            "amount": 123456,
            "type": "DEBIT",
            "category": "Transport",
            "__v": 0
        },
        //{...remaining top 4 expenses}
    ],
    "totalCount": 169
}
```
#### 7. GET All Categories
* **Endpoint:** `GET /api/categories`
* **Access:** Public
* **Description:** Get an array of all unique transaction categories

**Request:**
* `GET .../api/categories`

**Response (`200 OK`):**
Returns an array of unique transaction categories
```json
{
    "categoryArray": [
        "Entertainment",
        "Groceries",
        "Refund",
        "Rent",
        "Salary",
        "Shopping",
        "Take-out",
        "Transport",
        "Utilities"
    ]
}
```

---

## Known issues & bugs
- Part 2 (API endpoints)
    - Endpoints will handle invalid and missing IDs, but I haven't added express-validators to explicitly validate query params

- Part 3 (FrontEnd)
    - Not using useParams (react-router-dom) on TransactionPage (Page which shows all trasaction in a table)
    - User cannot send query with custom parameters directly to front end (API call works with custom params)
    - Using `// eslint-disable-next-line react-hooks/set-state-in-effect` in `client/src/components/EditModal.jsx` (line 16)
    - Using `// eslint-disable-next-line react-hooks/exhaustive-deps` in `client/src/components/TransactionSearchFilter.jsx` (line 23)



## Time Spent
- Part 1 (Generating CSV script): 1.5 hrs
- Part 2 (MongoDb + Backend + fixing csv imports): 7 hrs
- Part 3 (Frontend): 6 hrs
- Part 4 + Misc.: 2 hrs


## Use of AI Tools
- Used Gemini for code references and scaffolding a lot of the backend controllers
- Gemini + GPT for debugging and learning deployment through Render
