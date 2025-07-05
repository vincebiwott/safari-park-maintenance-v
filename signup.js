// /pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    nickname: '',
    role: '',
    tech_category: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password, full_name, nickname, role, tech_category } = formData;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('users').insert([
      {
        email,
        full_name,
        nickname,
        role,
        tech_category: role === 'Technician' ? tech_category : null,
        approved: false,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      alert('Signup successful! Please wait for admin approval.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">📝 Safari Park User Sign-Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          />
          <input
            name="nickname"
            placeholder="Nickname"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          />

          <select
            name="role"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Role</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Technician">Technician</option>
          </select>

          {formData.role === 'Technician' && (
            <select
              name="tech_category"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Technician Type</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="HVAC">HVAC</option>
              <option value="Carpenter">Carpenter</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
