import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./components/Pagination";

interface Item {
  id: number;
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Item[]>(
          "https://jsonplaceholder.typicode.com/users"
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fetched Data</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ul className="space-y-2">
          {currentItems.map((item) => (
            <li key={item.id} className="border p-4 rounded bg-gray-100">
              <h2 className="font-bold">{item.name}</h2>
              <p>{item.email}</p>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default App;
