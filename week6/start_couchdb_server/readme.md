# Start the database server.

```bash
  docker build -t couchdb .
  docker run -d --name couchdb_container -p 5984:5984 couchdb
  localhost:5984/_utils/
```

# Mango Queries in CouchDB

Mango is a query language in CouchDB that provides a simple way to retrieve documents using **JSON-based** queries, similar to MongoDB. It allows filtering documents without writing MapReduce functions.

---

## **1. Combination Operators**

These operators help combine multiple conditions.

- **`$and`** → Matches documents where all conditions are true.

  ```json
  {
    "selector": {
      "$and": [
        {
          "age": {
            "$gt": 25
          }
        },
        {
          "city": "Toronto"
        }
      ]
    }
  }
  ```

- **`$or`** → Matches documents where at least one condition is true.

  ```json
  {
    "selector": {
      "$or": [
        {
          "age": {
            "$lt": 18
          }
        },
        { "city": "New York" }
      ]
    }
  }
  ```

- **`$not`** → Matches documents where the condition is false.

  ```json
  {
    "selector": {
      "age": {
        "$not": {
          "$gte": 18
        }
      }
    }
  }
  ```

- **`$nor`** → Matches documents where none of the conditions are true.

  ```json
  {
    "selector": {
      "$nor": [
        {
          "age": {
            "$gt": 50
          }
        },
        { "city": "London" }
      ]
    }
  }
  ```

- **`$all`** → Matches arrays containing all specified elements.

  ```json
  {
    "selector": {
      "tags": {
        "$all": ["sports", "news"]
      }
    }
  }
  ```

- **`$elemMatch`** → Matches documents containing at least one array element that meets conditions.
  ```json
  {
    "selector": {
      "grades": {
        "$elemMatch": {
          "math": {
            "$gt": 80
          }
        }
      }
    }
  }
  ```

---

## **2. Condition Operators**

These are used for comparing field values.

- **`$lt`** → Less than

  ```json
  {
    "selector": {
      "age": {
        "$lt": 30
      }
    }
  }
  ```

- **`$lte`** → Less than or equal to

  ```json
  {
    "selector": {
      "age": {
        "$lte": 30
      }
    }
  }
  ```

- **`$eq`** → Equal to

  ```json
  {
    "selector": {
      "status": {
        "$eq": "active"
      }
    }
  }
  ```

- **`$ne`** → Not equal to

  ```json
  {
    "selector": {
      "status": {
        "$ne": "inactive"
      }
    }
  }
  ```

- **`$gte`** → Greater than or equal to

  ```json
  {
    "selector": {
      "age": {
        "$gte": 18
      }
    }
  }
  ```

- **`$gt`** → Greater than
  ```json
  {
    "selector": {
      "age": {
        "$gt": 40
      }
    }
  }
  ```

---

## **3. Object Operators**

Used to check the existence or type of fields.

- **`$exists`** → Checks if a field exists in the document.

  ```json
  {
    "selector": {
      "phone": {
        "$exists": true
      }
    }
  }
  ```

- **`$type`** → Matches documents where the field is of a specific type (e.g., `"string"`, `"number"`).
  ```json
  {
    "selector": {
      "age": {
        "$type": "number"
      }
    }
  }
  ```

---

## **4. Array Operators**

Used to query arrays.

- **`$in`** → Matches documents where the field value is in a given array.

  ```json
  {
    "selector": {
      "city": {
        "$in": ["New York", "Toronto", "London"]
      }
    }
  }
  ```

- **`$nin`** → Matches documents where the field value is **not** in a given array.

  ```json
  {
    "selector": {
      "city": {
        "$nin": ["Paris", "Berlin"]
      }
    }
  }
  ```

- **`$size`** → Matches documents where an array field has a specific length.
  ```json
  {
    "selector": {
      "tags": {
        "$size": 3
      }
    }
  }
  ```

---

## **5. Miscellaneous Operators**

Additional operators for advanced queries.

- **`$mod`** → Matches numbers that satisfy `value % divisor == remainder`.

  ```json
  {
    "selector": {
      "age": {
        "$mod": [2, 0]
      }
    }
  }
  ```

  (Finds even numbers)

- **`$regex`** → Matches fields using regular expressions.
  ```json
  {
    "selector": {
      "name": {
        "$regex": "^J"
      }
    }
  }
  ```
  (Finds names that start with "J")

---

### **Example: Complex Mango Query**

```json
{
  "selector": {
    "$and": [
      {
        "age": {
          "$gte": 25
        }
      },
      {
        "status": {
          "$eq": "active"
        }
      },
      {
        "tags": {
          "$all": ["developer", "remote"]
        }
      }
    ]
  }
}
```

🔹 **Finds active users who are at least 25 years old and have both "developer" and "remote" tags.**

---

# MapReduce in CouchDB

CouchDB uses **MapReduce** to create indexes for querying large datasets efficiently. MapReduce consists of **two functions**:

1. **Map Function** → Emits key-value pairs from documents.
2. **Reduce Function** → Aggregates emitted values (optional).

---

## **1. Understanding the Map Function**

Consider a CouchDB database named `users` with the following documents:

```json
{
  "_id": "user_1",
  "name": "Alice",
  "age": 25,
  "city": "New York"
}
```

```json
{
  "_id": "user_2",
  "name": "Bob",
  "age": 30,
  "city": "Toronto"
}
```

We define a **Map function** to retrieve users by city:

```js
function (doc) {
  emit(doc.city, doc.name);
}
```

### **How It Works**

- This function will emit a key-value pair:
  ```json
  { "New York": "Alice" }
  { "Toronto": "Bob" }
  ```
- These results are stored in a **view**, making queries faster.

---

## **2. Querying the View**

Save the **Map function** inside a CouchDB **design document**:

```json
{
  "_id": "_design/users",
  "views": {
    "by_city": {
      "map": "function (doc) { emit(doc.city, doc.name); }"
    }
  }
}
```

### **Querying the View**

Use a GET request to query all users by city:

```sh
curl http://localhost:5984/users/_design/users/_view/by_city
```

🔹 **Response:**

```json
{
  "rows": [
    { "key": "New York", "value": "Alice" },
    { "key": "Toronto", "value": "Bob" }
  ]
}
```

---

## **3. Adding a Reduce Function**

The **Reduce function** is used to **aggregate** results.

### **Example: Counting Users per City**

---

```json
{
  "_id": "_design/users",
  "views": {
    "count_by_city": {
      "map": "function (doc) { emit(doc.city, 1); }",
      "reduce": "function (keys, values, rereduce) { return sum(values); }"
    }
  }
}
```

- The **Map function** emits `emit(doc.city, 1)`, producing:

  ```json
  { "New York": 1 }
  { "Toronto": 1 }
  ```

- The **Reduce function** aggregates counts, resulting in:
  ```json
  { "New York": 5, "Toronto": 3 }
  ```

### **Querying for User Counts**

```sh
curl http://localhost:5984/users/_design/count_by_city/_view/count_by_city?group=true
```

🔹 **Response:**

```json
{
  "rows": [
    { "key": "New York", "value": 5 },
    { "key": "Toronto", "value": 3 }
  ]
}
```
