export const metadata = {
  title: 'OpenSolve NG',
  description: 'Open-Source Gemma 4 Past Question Solver',
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
