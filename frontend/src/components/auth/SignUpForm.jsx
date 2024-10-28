// src/components/SignUpForm.js

import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Adjust the import according to your structure
import { Loader } from "lucide-react";

const SignUpForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState(""); // State for gender

    const { signUp, loading } = useAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();
        await signUp({ name, username, email, password, gender }); // Include gender in signUp
    };

    return (
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                required
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full"
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
            />
            <input
                type="password"
                placeholder="Password (6+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
            />

            {/* Gender Selection */}
            <div className="flex flex-col gap-2">
                <label className="label">Gender:</label>
                <div className="flex items-center gap-4">
                    <label>
                        <input
                            type="radio"
                            value="male"
                            checked={gender === "male"}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-2"
                        />
                        Male
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="female"
                            checked={gender === "female"}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-2"
                        />
                        Female
                    </label>
                </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full text-white">
                {loading ? <Loader className="size-5 animate-spin" /> : "Agree & Join"}
            </button>
        </form>
    );
};

export default SignUpForm;
