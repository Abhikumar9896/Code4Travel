import "./globals.css"; 
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chatbot = dynamic(() => import("../components/Chatbot"), {
    ssr: false,
  });
export default function MyApp({ Component, pageProps }) {


    function ScrollToTopButton() {
        const [visible, setVisible] = useState(false);
      
        useEffect(() => {
          const handleScroll = () => {
            setVisible(window.scrollY > 200);
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);
      
        const scrollToTop = () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
      
        return (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-24 cursor-pointer right-8 z-50 p-3   text-black  transition-opacity duration-300  focus:outline-none ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        );
      }

  return (
    <div className="min-h-screen z-40 text-gray-900 antialiased">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Toaster position="top-center" />
       <Navbar />

      <main  >
        <Component {...pageProps} />
      </main>
  
         <Footer />
  
      <ScrollToTopButton />
      <Chatbot />
    </div>
  );
}