"use client"
import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">NLP to SQL</Link>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <div className={`md:flex space-x-6 ${menuOpen ? "block" : "hidden"} md:block`}>
          <Link href="/about" className="hover:text-blue-400">About</Link>
        </div>
      </div>
    </nav>
  );
};

const Button = ({ onClick, variant = "primary", children }) => {
  const baseStyles = "px-4 py-2 rounded-md text-white font-medium transition-all";
  const variantStyles = variant === "primary" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700";
  
  return <button onClick={onClick} className={`${baseStyles} ${variantStyles}`}>{children}</button>;
};

const Input = ({ type = "text", placeholder, value, onChange }) => {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />;
};

const Card = ({ title, description, children }) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
};


const fetcher = (url) => fetch(url).then((res) => res.json());

const TableTabs = ({ tables }) => {
    const [activeTable, setActiveTable] = useState(tables[0]); 


    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/table/${activeTable}`, fetcher, {
        revalidateOnFocus: false, 
        dedupingInterval: 100000, 
    });

    return (
        <div className="overflow-x-auto" style={{ maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
            {/* Tabs Navigation */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                {tables.map((table) => (
                    <button
                        key={table}
                        onClick={() => setActiveTable(table)}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: activeTable === table ? "#007bff" : "#ddd",
                            color: activeTable === table ? "white" : "black",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    >
                        {table}
                    </button>
                ))}
            </div>

            {/* Error handling */}
            {error && <p style={{ color: "red" }}>Error loading data: {error.message}</p>}

            {/* Loading state */}
            {isLoading && <p>Loading...</p>}

            {/* Table Data Display */}
            {data && data.data && data.data.length > 0 ? (
                <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            {Object.keys(data.data[0]).map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !isLoading && <p>No data available.</p>
            )}
        </div>
    );
};



const SQLQueryConverter = () => {
  const [query, setQuery] = useState("");
  const [sqlResult, setSqlResult] = useState("");

  const handleConvert = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: query })
      });
      const data = await response.json();
      console.log("Fetched data:", data);
      setSqlResult(data.query); 
    } catch (error) {
      console.error("Error converting query:", error);
    }
  };

  return (
    <div className="bg-gray-800 text-black p-6 rounded-lg w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-white mb-4">SQL Query Converter</h2>
      
      <input
        type="text"
        placeholder="fetch all female employees name, salary in increasing order..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-full mb-4 text-black"
      />
      
      <button 
        onClick={handleConvert} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        Convert
      </button>
      
      {sqlResult.length > 0 && (
          <div>
               <pre className="bg-gray-700 text-white p-4 mt-4 rounded overflow-x-auto">
          {sqlResult}
        </pre>
<div>
  <QueryResult query={sqlResult} />
  </div>
          </div>
        
      )}
    </div>
  );
};




function extractTablesFromQuery(query) {
  const pattern = /\b(FROM|JOIN)\s+([a-zA-Z0-9_]+)/g;
  let match;
  const tables = [];

  while ((match = pattern.exec(query)) !== null) {
    tables.push(match[2]); 
  }

  return tables;
}

const QueryResult = ({query}) => {
  const [sqlResult, setSqlResult] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState('table');

  const handleFetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query?sql=${query}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      setSqlResult(data.result);  
      setTables(extractTablesFromQuery(query));  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderTable = () => (
    <div className="overflow-x-auto mt-4">
      <table className="table-auto w-full text-left text-white bg-gray-700 rounded-lg">
        <thead>
          <tr>
            {Object.keys(sqlResult[0] || {}).map((key) => (
              <th key={key} className="px-4 py-2 border-b">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sqlResult.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i} className="px-4 py-2 border-b">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


  const renderJSON = () => (
    <pre className="bg-gray-700 text-white p-4 mt-4 rounded overflow-x-auto">
      {JSON.stringify({ query, result: sqlResult }, null, 2)}
    </pre>
  );

  const renderExtractedTables = () => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">Relevant Tables :</h3>
      <ul className="list-disc ml-6">
        {tables.length > 0 ? (
          tables.map((table, index) => (
            <li key={index}>{table}</li>
          ))
        ) : (
          <li>No relevant tables found</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">SQL Query Result Viewer</h2>

      {/* Query Input */}
      <textarea
        rows="5"
        placeholder="Enter your SQL query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-full mb-4 text-black"
      />

      <button 
        onClick={handleFetchData} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        Fetch Data
      </button>

      <div className="mt-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 ${activeTab === 'table' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded`}
          >
            Table View
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2 ${activeTab === 'json' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded`}
          >
            JSON View
          </button>
          <button
            onClick={() => setActiveTab('extract')}
            className={`px-4 py-2 ${activeTab === 'extract' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded`}
          >
            Relevant Tables
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'table' && renderTable()}
          {activeTab === 'json' && renderJSON()}
          {activeTab === 'extract' && renderExtractedTables()}
        </div>
      </div>
    </div>
  );
};






const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center">Transform Natural Language into SQL Queries</h1>
        <p className="text-center text-gray-400 mt-2">Harness AI to generate SQL queries without complex syntax.</p>
        <div>
          <h1 className='text-3xl text-center mt-10'>Tables</h1>
        <TableTabs tables={["demographics", "salary"]}  />
        </div>
        <div className="mt-6">
          <SQLQueryConverter />
        </div>

        <div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="AI-Powered" description="Our tool converts plain English into precise SQL queries." />
          <Card title="FastAPI Backend" description="Backend powered by FastAPI for rapid query processing." />
        </div>
      </div>
    </div>
  );
};

export default Home;
