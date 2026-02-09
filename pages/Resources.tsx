import React from 'react';
import { BookOpen, Video, FileText, Globe, ExternalLink } from 'lucide-react';
import { Resource } from '../types';

const resources: Resource[] = [
  { title: "CS50: Introduction to Computer Science", type: "Course", url: "https://pll.harvard.edu/course/cs50-introduction-computer-science", category: "Computer Science" },
  { title: "Khan Academy Engineering", type: "Video", url: "https://www.khanacademy.org/science/electrical-engineering", category: "Engineering Basics" },
  { title: "Roadmap.sh - Developer Roadmaps", type: "Article", url: "https://roadmap.sh", category: "Career" },
  { title: "MIT OpenCourseWare", type: "Course", url: "https://ocw.mit.edu/", category: "General Engineering" },
  { title: "GeeksforGeeks Data Structures", type: "Article", url: "https://www.geeksforgeeks.org/data-structures/", category: "Computer Science" },
  { title: "Coursera: AI for Everyone", type: "Course", url: "https://www.coursera.org/learn/ai-for-everyone", category: "AI/ML" },
  { title: "NPTEL Online Courses", type: "Video", url: "https://nptel.ac.in/", category: "Academic" },
  { title: "Arduino Project Hub", type: "Article", url: "https://create.arduino.cc/projecthub", category: "Electronics" },
];

const Resources: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="w-5 h-5 text-red-500" />;
      case 'Course': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-orange-500" />;
      default: return <Globe className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Resource Hub</h1>
        <p className="text-slate-500">Handpicked materials to accelerate your learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, idx) => (
          <a 
            key={idx}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                  {res.category}
                </span>
                {getIcon(res.type)}
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {res.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium group-hover:text-indigo-500">
               Access Resource <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Resources;
