import React, { useState, useEffect } from "react";
import { Student } from "../types/Tstudent";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", grade: "", major: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setStudents(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost:8000/students/${id}`, {
        method: "DELETE",
      }).then(() => {
        setStudents(students.filter((student) => student.id !== id));
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      grade: student.grade,
      major: student.major,
    });
  };

  const handleSave = (id: number) => {
    const studentToEdit = students.find((student) => student.id === id);
    if (!studentToEdit) {
      console.error("Student not found.");
      return;
    }

    const { name, grade, major } = formData;
  
    if (!/^[A-Za-z][A-Za-z0-9\s]*$/.test(name) || name.length < 3) {
      alert('Name should not start with a number and should have at least 3 characters.');
      return;
    }
  
    const existingStudent = students.find((student) => student.id !== id && student.name === name && student.grade === grade && student.major === major);
    if (existingStudent) {
      alert('A student with the same name, grade, and major already exists.');
      return;
    }
  
    if (!grade || !major) {
      alert('Please select both grade and major.');
      return;
    }
  
    fetch(`http://localhost:8000/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedStudent) => {
        setStudents(students.map((student) => (student.id === id ? updatedStudent : student)));
        setEditingId(null);
      })
      .catch((error) => {
        console.error("Error updating student:", error);
        alert('Failed to update student. Please try again later.');
      });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const { name, grade, major } = formData;
  
    // Validation: Name should not start with a number and should have more than 2 letters
    if (!/^[A-Za-z][A-Za-z0-9\s]*$/.test(name) || name.length < 3) {
      alert('Name should not start with a number and should have at least 3 characters.');
      return;
    }
  
    // Validation: Grade and Major should not match for the same name
    const existingStudent = students.find(student => student.name === name && student.grade === grade && student.major === major);
    if (existingStudent) {
      alert('A student with the same name, grade, and major already exists.');
      return;
    }
  
    // Validation: Grade and Major should be selected
    if (!grade || !major) {
      alert('Please select both grade and major.');
      return;
    }
  
    // Fetching existing students data to determine the last used ID
    fetch("http://localhost:8000/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch student data.');
        }
        return response.json();
      })
      .then((students) => {
        const lastId = students.length > 0 ? parseInt(students[students.length - 1].id) : 0;
        const newStudentData = {
          id: lastId + 1,
          name,
          grade,
          major
        };
  
        // Posting new student data to the server
        fetch("http://localhost:8000/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStudentData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to create student.');
            }
            return response.json();
          })
          .then((newStudent) => {
            setStudents([...students, newStudent]);
            setFormData({ name: "", grade: "", major: "" });
            setShowForm(false);
          })
          .catch((error) => {
            console.error("Error creating student:", error);
            alert('Failed to create student. Please try again later.');
          });
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        alert('Failed to fetch student data. Please try again later.');
      });
  };
  
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
          className="bg-blue-300 text-black px-4 py-2 rounded shadow hover:bg-blue-900 hover:text-white transition"
        >
          {showForm ? "Cancel" : "Add New Student"}
        </button>
      </div>

      {showForm && (
        <div className="max-w-md mx-auto mb-4 bg-blue-100 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
          <h2 className="text-lg font-semibold mb-2">Create New Student</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <div>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
              >
                {["Select Grade","A", "B", "C", "D", "E", "F"].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="default">Select major</option>
                <option value="Computer science">Computer science</option>
                <option value="Information Science">Information Science</option>
                <option value="Electronics and communication">
                  Electronics and communication
                </option>
                <option value="Electrical and electronics">
                  Electrical and electronics
                </option>
                <option value="Mechanical engineering">
                  Mechanical engineering
                </option>
                <option value="Civil engineering">Civil engineering</option>
                <option value="Construction technology">
                  Construction technology
                </option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Industrial production">
                  Industrial production
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-green-500 hover:text-black transition"
            >
              Save
            </button>
          </form>
        </div>
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
              className={
                index % 2 === 0
                  ? "bg-gray-50 hover:bg-gray-150"
                  : "bg-white hover:bg-gray-100"
              }
            >
              <td className="px-4 py-2 border-b border-gray-200">
                {student.id}
              </td>
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
                    {["A", "B", "C", "D", "E"].map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
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
                    <option value="">Select Major</option>
                    <option value="Computer science">Computer science</option>
                    <option value="Information Science">
                      Information Science
                    </option>
                    <option value="Electronics and communication">
                      Electronics and communication
                    </option>
                    <option value="Electrical and electronics">
                      Electrical and electronics
                    </option>
                    <option value="Mechanical engineering">
                      Mechanical engineering
                    </option>
                    <option value="Civil engineering">Civil engineering</option>
                    <option value="Construction technology">
                      Construction technology
                    </option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Industrial production">
                      Industrial production
                    </option>
                  </select>
                ) : (
                  student.major
                )}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 flex justify-end space-x-2">
                {editingId === student.id ? (
                  <button
                    onClick={() => handleSave(student.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover
                transition"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-300 text-black px-4 py-2 rounded shadow hover:bg-red-800 hover:text-white transition
                transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-blue-300 text-black px-4 py-2 rounded shadow hover:bg-blue-900 hover:text-white transition
                transition"
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
