import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login.js';
import Album from './Album.js';
import Register from './Register.js';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/album" element={<Album />} />      
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

