import React, { useState, useEffect } from 'react';
import { Student } from '../types/Tstudent';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', grade: '', major: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/students')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setStudents(data))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost:8000/students/${id}`, {
        method: 'DELETE',
      }).then(() => {
        setStudents(students.filter(student => student.id !== id));
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({ name: student.name, grade: student.grade, major: student.major });
  };

  const handleSave = (id: number) => {
    fetch(`http://localhost:8000/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then(updatedStudent => {
        setStudents(students.map(student => (student.id === id ? updatedStudent : student)));
        setEditingId(null);
      });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('http://localhost:8000/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then(newStudent => {
        setStudents([...students, newStudent]);
        setFormData({ name: '', grade: '', major: '' });
        setShowForm(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Add New Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
          <div className="mb-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
            >
              {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="Computer science">Computer science</option>
              <option value="Information Science">Information Science</option>
              <option value="Electronics and communication">Electronics and communication</option>
              <option value="Electrical and electronics">Electrical and electronics</option>
              <option value="Mechanical engineering">Mechanical engineering</option>
              <option value="Civil engineering">Civil engineering</option>
              <option value="Construction technology">Construction technology</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Industrial production">Industrial production</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
          >
            Save
          </button>
        </form>
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b-2 border-gray-200">Student ID</th>
            <th className="px-4 py-2 border-b-2 border-gray-200">Name</th>
            <th className="px-4 py-2 border-b-2 border-gray-200">Grade</th>
            <th className="px-4 py-2 border-b-2 border-gray-200">Major</th>
            <th className="px-4 py-2 border-b-2 border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.id}
              className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-100'}
            >
              <td className="px-4 py-2 border-b border-gray-200">{student.id}</td>
              <td className="px-4 py-2 border-b border-gray-200">
                {editingId === student.id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  student.name
                )}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {editingId === student.id ? (
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                ) : (
                  student.grade
                )}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {editingId === student.id ? (
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option value="Computer science">Computer science</option>
                    <option value="Information Science">Information Science</option>
                    <option value="Electronics and communication">Electronics and communication</option>
                    <option value="Electrical and electronics">Electrical and electronics</option>
                    <option value="Mechanical engineering">Mechanical engineering</option>
                    <option value="Civil engineering">Civil engineering</option>
                    <option value="Construction technology">Construction technology</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Industrial production">Industrial production</option>
                  </select>
                ) : (
                  student.major
                )}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 flex justify-end space-x-2">
                {editingId === student.id ? (
                  <button
                    onClick={() => handleSave(student.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
