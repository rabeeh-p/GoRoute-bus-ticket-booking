import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Lock } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';   

const UserCreating = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Form submitted successfully:', formData);

      axios
        .post('http://127.0.0.1:8000/admin-create-user/', formData)
        .then((response) => {
          console.log('User created successfully:', response.data);

          Swal.fire({
            icon: 'success',
            title: 'User Created Successfully!',
            text: 'The new user has been successfully created.',
          });

          navigate('/admin-home/users-list');
        })
        .catch((error) => {
          console.error('There was an error creating the user:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'There was an error creating the user. Please try again.',
          });
        });
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    const trimmedData = {
      username: formData.username.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone_number.trim(),
      date_of_birth: formData.date_of_birth.trim(),
      gender: formData.gender.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };
  
    if (!trimmedData.username) newErrors.username = 'Username is required';
    if (!trimmedData.first_name) newErrors.first_name = 'First name is required';
    if (!trimmedData.email) newErrors.email = 'Email is required';
    if (!trimmedData.password) newErrors.password = 'Password is required';
    if (trimmedData.password !== trimmedData.confirmPassword) 
      newErrors.confirmPassword = 'Passwords do not match';
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (trimmedData.email && !emailRegex.test(trimmedData.email)) {
      newErrors.email = 'Invalid email format';
    }
  
    if (trimmedData.phone_number && trimmedData.phone_number.length < 10) {
      newErrors.phone_number = 'Phone number should be at least 10 digits';
    }
  
    return newErrors;
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mt-4">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join millions of happy travelers</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {Object.keys(formData).map((field) => (
              <div key={field} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {
                    {
                      username: <User className="h-5 w-5 text-gray-400" />,
                      first_name: <User className="h-5 w-5 text-gray-400" />,
                      last_name: <User className="h-5 w-5 text-gray-400" />,
                      email: <Mail className="h-5 w-5 text-gray-400" />,
                      phone_number: <Phone className="h-5 w-5 text-gray-400" />,
                      date_of_birth: <Calendar className="h-5 w-5 text-gray-400" />,
                      password: <Lock className="h-5 w-5 text-gray-400" />,
                      confirmPassword: <Lock className="h-5 w-5 text-gray-400" />,
                    }[field]
                  }
                </div>
                {field === 'date_of_birth' ? (
                  <input
                    type="date"
                    name={field}
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    value={formData[field]}
                    onChange={handleChange}
                  />
                ) : field !== 'gender' ? (
                  <input
                    type={field.includes('password') ? 'password' : 'text'}
                    name={field}
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder={field
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                ) : (
                  <select
                    name={field}
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    value={formData[field]}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                )}
                {errors[field] && (
                  <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserCreating;
