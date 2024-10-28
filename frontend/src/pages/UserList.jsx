// src/components/UserList.js
import React from 'react';

const UserList = ({ users, onUserSelect }) => {
    return (
        <div className="user-list">
            {users.length > 0 ? ( // Check if users array has elements
                users.map((user) => (
                    <div
                        key={user._id}
                        className="user-item cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => onUserSelect(user._id)} // Pass the selected user ID
                    >
                        {user.name} {/* Adjust this to match your user object structure */}
                    </div>
                ))
            ) : (
                <p>No users available</p> // Display message when no users are available
            )}
        </div>
    );
};

export default UserList;
