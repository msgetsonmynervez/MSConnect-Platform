import * as React from "react"

// --- ACCESSIBLE BUTTON ---
export const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    style={{
      padding: '1rem 2rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderRadius: '12px',
      backgroundColor: '#3C5A51',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      margin: '0.5rem'
    }}
    {...props}
  />
)

// --- ACCESSIBLE CARD ---
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    backgroundColor: '#EEF2F4',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid #D1D5DB',
    marginBottom: '1rem',
    width: '100%'
  }}>
    {children}
  </div>
)

// --- ACCESSIBLE INPUT ---
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    style={{
      width: '100%',
      padding: '1rem',
      fontSize: '1.1rem',
      borderRadius: '8px',
      border: '2px solid #D1D5DB',
      marginBottom: '1rem'
    }}
    {...props}
  />
)
