import { Chewy } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { UserProvider } from "../context/UserContext";

const chewy = Chewy({
  variable: "--font-chewy",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${chewy.variable} antialiased`}
      >
        <UserProvider>
          <Nav />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
