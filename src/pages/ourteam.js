"use client";

import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Pankaj Pratap Singh",
    role: "Full Stack Developer",
    image: "/team/pankaj.jpeg",
    bio: "Specializes in building scalable MERN & Next.js applications.",
  },
  {
    name: "Abhikesh",
    role: "UI/UX Designer",
    image: "/team/abhishekh.png",
    bio: "Passionate about creating beautiful and user-friendly designs.",
  },
  {
    name: "Abhikesh Kumar",
    role: "Backend Engineer",
    image: "/team/ab.png",
    bio: "Expert in Node.js, APIs, and secure backend architectures.",
  },
  {
    name: "Sherya Singh",
    role: "Full Stack Developer",
    image: "/team/sherya.jpg",
    bio: "Specializes in building scalable MERN & Next.js applications.",
  },
  {
    name: "Prahalad",
    role: "UI/UX Designer",
    image: "/team/prahalad.jpg",
    bio: "Passionate about creating beautiful and user-friendly designs.",
  },
  {
    name: "Shivam Kumar",
    role: "Backend Engineer",
    image: "/team/shivam.jpg",
    bio: "Expert in Node.js, APIs, and secure backend architectures.",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-800 mb-4"
        >
          Meet Our Team
        </motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          A passionate group of developers and designers working together to
          create impactful digital experiences.
        </p>

        {/* Team Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-purple-600 font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
