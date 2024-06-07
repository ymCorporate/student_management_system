import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import StudentList from './components/list';
import Footer from './components/footer';

const App: React.FC=()=>{
  return (
    <div className="App">
      <Header />
      <StudentList />
      <Footer />
    </div>
  );
}

export default App;
