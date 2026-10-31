import './globals.css';

export const metadata = {
  title: 'OpenSolve NG | Gemma 4 AI',
  description: 'Open-Source Past Question Solver for Nigerian Universities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
