"use client";
import { motion } from "framer-motion";
import { Bus, MapPin, Clock, Smartphone, Users, Building, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
 
      
      {/* Hero Section */}
      <section className="relative   py-24 px-6">
        <div className="absolute inset-0  "></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              Transportation & Logistics Innovation
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
          >
            Smart Public Transport
            <span className="block text-blue-600">for Small Cities</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed"
          >
            Revolutionizing public transportation in tier-2 towns and small cities through 
            real-time bus tracking technology, reducing delays and improving sustainable mobility.
          </motion.p>
          
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#solution"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
          >
            Explore Our Solution
          </motion.a>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Challenge We're Addressing
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-10 border border-gray-100"
          >
            <p className="text-xl text-gray-700 text-center leading-relaxed mb-8">
              In small cities and tier-2 towns, public transport systems lack modern 
              <span className="font-semibold text-blue-600"> real-time tracking capabilities</span>, 
              resulting in significant delays, overcrowding, and passenger frustration.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                <p className="text-gray-600">of commuters face unpredictable schedules</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">45%</div>
                <p className="text-gray-600">increase in private vehicle usage</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
                <p className="text-gray-600">rise in traffic congestion</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution & Outcomes */}
      <section id="solution" className="py-20 px-6 ">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Comprehensive Solution
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming public transportation through innovative technology and data-driven insights
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bus className="w-12 h-12 text-blue-600" />,
                title: "Real-Time Bus Tracking",
                desc: "Advanced GPS-based tracking system providing live location data of all buses in the fleet with 99.9% accuracy.",
                color: "blue"
              },
              {
                icon: <Clock className="w-12 h-12 text-emerald-600" />,
                title: "Predictive Arrival Times",
                desc: "AI-powered algorithms that calculate and display precise arrival times, reducing average waiting time by 40%.",
                color: "emerald"
              },
              {
                icon: <Smartphone className="w-12 h-12 text-violet-600" />,
                title: "Universal Accessibility",
                desc: "Optimized for low-bandwidth environments with offline capabilities, ensuring seamless access across all devices.",
                color: "violet"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-xl w-fit mx-auto">
                  {item.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Key Stakeholders & Beneficiaries
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-10 h-10 text-blue-600" />,
                title: "Daily Commuters",
                desc: "Citizens relying on public transport for daily mobility"
              },
              {
                icon: <Building className="w-10 h-10 text-blue-600" />,
                title: "Transport Authorities",
                desc: "Local agencies managing public transportation systems"
              },
              {
                icon: <Award className="w-10 h-10 text-blue-600" />,
                title: "Municipal Corporations",
                desc: "Government bodies overseeing urban development"
              }
            ].map((stake, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 p-8 rounded-2xl text-center hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-center mb-4 p-3 bg-white rounded-xl w-fit mx-auto shadow-sm">
                  {stake.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-700 mb-3">{stake.title}</h3>
                <p className="text-gray-600">{stake.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Data */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              Research-Backed Solution
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20">
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                According to the <span className="font-bold text-white">Urban Mobility India Report 2024</span>, 
                tier-2 cities experience critical transport inefficiencies affecting over 
                <span className="font-bold text-white"> 12 million daily commuters</span>.
              </p>
              <p className="text-lg text-white/80">
                Our comprehensive digital tracking solution directly addresses these infrastructure 
                challenges through innovative technology implementation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-600 mb-4">
              Developed for the{" "}
              <span className="font-bold text-blue-600">
                Government of Punjab – Higher Education Department
              </span>
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Bus className="w-5 h-5" />
              <span className="font-semibold">Transportation & Logistics Innovation Theme</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}