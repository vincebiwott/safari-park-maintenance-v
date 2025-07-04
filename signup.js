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
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '2rem' }}>
      <h2>📝 User Sign-Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full Name" onChange={handleChange} required /><br /><br />
        <input name="nickname" placeholder="Nickname" onChange={handleChange} required /><br /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br /><br />

        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Technician">Technician</option>
        </select><br /><br />

        {formData.role === 'Technician' && (
          <select name="tech_category" onChange={handleChange} required>
            <option value="">Select Technician Type</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="HVAC">HVAC</option>
            <option value="Carpenter">Carpenter</option>
          </select>
        )}<br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
