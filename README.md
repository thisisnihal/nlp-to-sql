# NLP-Driven SQL Query Generator



## Overview



This project is an NLP-driven system that dynamically selects the most relevant tables from a database schema based on a user's natural language (NL) query. Due to time constraints, we have integrated the Google Gemini API instead of training our own model for NL-to-SQL conversion. However, in the future, we plan to develop and train a custom model to improve accuracy and control. The system utilizes a React frontend, a FastAPI backend, and the Google Gemini API to convert natural language into SQL queries.



## Features



- **Natural Language Understanding**: Parses NL queries to determine the required data.

- **Schema Filtering**: Analyzes a provided database schema (JSON format) and selects only the most relevant tables.

- **Optimized Output**: Returns a refined subset of tables and their schema to enhance the efficiency of NL-to-SQL conversion.

- **Integration with Google Gemini API**: Leverages AI to generate SQL queries based on user input.



## Tech Stack



- **Frontend**: React.js

- **Backend**: FastAPI (Python)

- **AI Model**: Google Gemini API (planned transition to custom model)

- **Database Schema Format**: JSON



## Database Schema



The database consists of two primary tables:



### 1. `Demographics`



| Column     | Type   | Description        |

| ---------- | ------ | ------------------ |

| EmployeeID | INT    | Unique employee ID |

| Name       | STRING | Employee name      |

| Age        | INT    | Age of employee    |

| Gender     | STRING | Gender of employee |



### 2. `Salary`



| Column     | Type | Description                         |

| ---------- | ---- | ----------------------------------- |

| EmployeeID | INT  | Foreign key linking to Demographics |

| Salary     | INT  | Salary of the employee              |



## Installation



### Prerequisites



- Node.js & npm

- Python & pip

- FastAPI



### Setup



#### Clone the Repository



```sh

$ git clone https://github.com/thisisnihal/nlp-to-sql.git

$ cd nlp-to-sql

```



#### Backend Setup (FastAPI)



```sh

$ cd backend

$ pip install -r requirements.txt

$ uvicorn main:app --reload

```



#### Frontend Setup (React)



```sh

$ cd frontend

$ npm install

$ npm start

```



## Usage



1. **User submits an NL query** through the React frontend.

2. **FastAPI backend processes the request**:

   - Parses the NL query.

   - Scans the JSON database schema.

   - Filters out irrelevant tables.

   - Sends the refined schema to the Google Gemini API.

3. **Google Gemini API generates the SQL query** based on the filtered schema.

4. **The generated SQL query is returned** to the frontend for display or execution.



## API Endpoints



### 1. Query Processing



**Endpoint**: `POST /query`

**Payload**:



```json

{

  "query": "Find all employees older than 40."

}

```



**Response**:



```json

{

  "relevant_tables": [

    {

      "name": "Demographics",

      "columns": ["EmployeeID", "Name", "Age"]

    }

  ]

} 

```



### 2. Generate SQL Query



**Endpoint**: `POST /generate_query`

**Payload**:



```json

{

  "tables": [ ...filtered schema... ],

  "query": "Find all employees older than 40."

}

```



**Response**:



```json

{

  "sql_query": "SELECT Name, Age FROM Demographics WHERE Age > 40"

}

```



## Deployment



You can access the deployed version of the application at:



🔗 [Live Demo](https://nlptosql-alpha.vercel.app/)



🔗 [GitHub Repository](https://github.com/thisisnihal/nlp-to-sql)



## Future Improvements



- Enhance schema filtering using vector embeddings.

- Implement support for additional database systems.

- Currently, we are using the Google Gemini API to convert NLP to SQL. Due to time constraints, we opted for an external model instead of training our own. In the future, we plan to develop a custom NLP-to-SQL model to enhance performance, accuracy, and control.



### License



This project is licensed under the MIT License.