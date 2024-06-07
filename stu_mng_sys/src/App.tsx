import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import StudentList from './components/list';

const App: React.FC=()=>{
  return (
    <div className="App">
      <Header/>
      <StudentList/>
    </div>
  );
}

export default App;
