import React,{ useState,useEffect } from 'react';
import { Student } from '../types/Tstudent';

const StudentList : React.FC=()=>{
  const [students,setStudents]=useState<Student[]>([])


  useEffect(()=>{
    fetch('http://localhost:8000/students')
    .then(response=>{
      return response.json()
    })
    .then(data=>setStudents(data))
  },[]);

  return(
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Student List</h1>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Student ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Grade</th>
            <th className="px-4 py-2">Major</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student=>(
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.id}</td>
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.grade}</td>
              <td className="border px-4 py-2">{student.major}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList;