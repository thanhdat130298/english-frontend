"use client"
import axios from 'axios';
import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    axios.get('https://652384bbf43b1793841587ee.mockapi.io/tickets')
  }, [])
  return <h1>🔐 222 Page</h1>;
}
