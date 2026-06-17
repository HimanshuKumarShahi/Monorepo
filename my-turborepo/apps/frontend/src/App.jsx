import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apne Express backend ko call kar rahe hain
    fetch('http://localhost:5000/api/users')
      .then((res) => res.json())
      .then((response) => {
        // FreeAPI ka response structure: response.data.data (array hota hai)
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching from backend:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          User Directory <span className="text-indigo-600">Pro</span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {users.map((user) => (
            <div 
              key={user.login.uuid} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img 
                className="w-full h-48 object-cover" 
                src={user.picture.large} 
                alt={`${user.name.first} ${user.name.last}`} 
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {user.name.first} {user.name.last}
                </h2>
                <div className="space-y-2 mt-3">
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="font-semibold w-16">Email:</span> 
                    <span className="truncate">{user.email}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="font-semibold w-16">Country:</span> 
                    {user.location.country}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="font-semibold w-16">Gender:</span> 
                    <span className="capitalize">{user.gender}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;