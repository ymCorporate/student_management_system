import React, { useState, useEffect } from 'react';
import { Student } from '../types/Tstudent';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', grade: '', major: '' });

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

  const handleCreate = () =>{
    
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      grade: e.target.value,
    });
  };

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      major: e.target.value,
    });
  };

  return (
    <div className="container mx-auto">
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Student ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Grade</th>
            <th className="px-4 py-2">Major</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.id}</td>
              <td className="border px-4 py-2">
                {editingId === student.id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border px-2 py-1"
                  />
                ) : (
                  student.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === student.id ? (
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleGradeChange}
                    className="border px-2 py-1"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                ) : (
                  student.grade
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === student.id ? (
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleMajorChange}
                    className="border px-2 py-1"
                  >
                    <option value="Computer science">Computer science</option>
                    <option value="Information Science">Information Science</option>
                    <option value="Electronics and communication">Electronics and communication</option>
                    <option value="Electrical and electronics">Electrical and electronics</option>
                    <option value="Mechanical engineering">Mechanical engineering</option>
                    <option value="Civil engineering">Civil engineering</option>
                    <option value="Contruction technology">Contruction technology</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Industrial production">Industrial production</option>
                  </select>
                ) : (
                  student.major
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === student.id ? (
                  <button
                    onClick={() => handleSave(student.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
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