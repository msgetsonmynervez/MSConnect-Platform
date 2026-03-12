import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSymptomData } from '../hooks/useSymptomData';
import { Card } from '../components/ui';

const Progress = () => {
  const { symptoms } = useSymptomData();

  const data = symptoms.map((s: any) => ({
    name: new Date(s.id).toLocaleDateString(),
    intensity: s.intensity || 0
  }));

  return (
    <div style={{ padding: '2rem', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#3C5A51', fontSize: '2.5rem' }}>Symptom Trends</h1>
      <Card>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="intensity" stroke="#3C5A51" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Progress;
