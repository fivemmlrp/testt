import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MemeHub",
  description: "Win and trade memes on MemeHub!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWalletProvider>
          <header>
            <nav className="navbar">
              <div className="container">
                <a href="#home" className="logo">
                  MemeHub
                </a>
                <ul className="nav-links">
                  <li>
                    <a href="#home">Home</a>
                  </li>
                  <li>
                    <a href="#how-to">How To Win</a>
                  </li>
                  {/* Uncomment these links as needed */}
                  {/* <li><a href="#meme-shop">Meme Shop</a></li> */}
                  {/* <li><a href="#about">About</a></li> */}
                  {/* <li><a href="#payout">Payout</a></li> */}
                </ul>
              </div>
            </nav>
          </header>

          <main className="main-container">{children}</main>

          <footer className="footer">
            <p>&copy; {new Date().getFullYear()} MemeHub. All rights reserved.</p>
          </footer>
        </AppWalletProvider>
      </body>
    </html>
  );
}