import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const ProjectDash = () => {
  const { projectId } = useParams();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [editMode, setEditMode] = useState(false);  // <-- THIS LINE
const [newNotice, setNewNotice] = useState('');
const [editTasksMode, setEditTasksMode] = useState(false);
const [newTask, setNewTask] = useState('');

const handleAddTask = async () => {
  if (!newTask.trim()) {
    alert("Please enter a task");
    return;
  }
  try {
    const res = await axios.post(
      `https://trackxback.onrender.com/user/projects/${projectId}/tasks`,
      { task: newTask },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks(prev => [...prev, newTask]);  // optimistic update
    setNewTask('');
  } catch (error) {
    console.error('Failed to add task', error);
    alert("Failed to add task");
  }
};

const handleDeleteTask = async (index) => {
  try {
    await axios.delete(
      `https://trackxback.onrender.com/user/projects/${projectId}/tasks/${index}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks(prev => prev.filter((_, i) => i !== index));
  } catch (error) {
    console.error('Failed to delete task', error);
    alert("Failed to delete task");
  }
};

const handleAddNotice = async () => {
  if (!newNotice.trim()) return;

  try {
    const res = await axios.post(
      `https://trackxback.onrender.com/user/projects/${projectId}/notices`,
      { notice: newNotice },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNotices((prev) => [...prev, newNotice]);
    setNewNotice('');
  } catch (error) {
    console.error('Failed to add notice:', error);
  }
};
const handleDeleteNotice = async (index) => {
  try {
    const res = await axios.delete(
      `https://trackxback.onrender.com/user/projects/${projectId}/notices/${index}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updated = [...notices];
    updated.splice(index, 1);
    setNotices(updated);
  } catch (error) {
    console.error('Failed to delete notice:', error);
  }
};


  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        console.log(projectId)
        const res = await axios.get(`https://trackxback.onrender.com/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const project = res.data;
        console.log(res.data);
        setProjectName(project.projectName);
        setDescription(project.description);
        setMembers(project.members);
        setNotices(project.notices || []);
        setTasks(project.tasks || []);
        setIsAdmin(project.isAdmin);
        console.log(project.isAdmin)
        console.log(isAdmin)
        setUsername(project.username || 'User');
      } catch (err) {
        console.error('Failed to fetch project data', err);
      }
    };

    fetchProjectData();
  }, [projectId, token]);

  return (
    <div className="bg-zinc-800 min-h-screen text-white w-screen px-2 pb-10 relative">
      {/* Navbar */}
      <div className="w-full  flex justify-between items-center px-4 bg-zinc-700 shadow-md ">
        <Logo />
        <span className="text-lg font-semibold">Hi, {username}!</span>
      </div>

      {/* Main Content */}
      <div className="pt-24 max-w-5xl mx-auto space-y-8">
        {/* Project Header */}
        <div className="bg-zinc-700 p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-2">{projectName}</h1>
          <p className="text-zinc-300 mb-4">{description}</p>
          <Button className="bg-zinc-600 text-white" onClick={() => setShowMembersModal(true)}>
            Members
          </Button>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notices Card */}
         <div className="bg-zinc-100 text-zinc-800 p-6 rounded-xl shadow-md">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Important Notices</h2>
    {isAdmin && !editMode && (
      <Button
        className="bg-blue-600 text-white px-3 py-1 text-sm"
        onClick={() => setEditMode(true)}
      >
        Edit Notices
      </Button>
    )}
  </div>

  <ul className="list-disc pl-5 space-y-2">
    {notices.map((notice, idx) => (
      <li key={idx} className="flex justify-between items-center">
        <span>{notice}</span>
        {isAdmin && editMode && (
          <button
            onClick={() => handleDeleteNotice(idx)}
            className="text-red-600 text-sm ml-4"
          >
            Delete
          </button>
        )}
      </li>
    ))}
  </ul>

  {/* Admin Notice Editor */}
  {isAdmin && editMode && (
    <div className="mt-4 space-y-3">
      <textarea
        value={newNotice}
        onChange={(e) => setNewNotice(e.target.value)}
        className="w-full border rounded px-3 py-2"
        rows={2}
        placeholder="Add new notice"
      />
      <div className="flex space-x-2">
        <Button className="bg-green-600 text-white px-3 py-1" onClick={handleAddNotice}>
          Add
        </Button>
        <Button
          className="bg-zinc-600 text-white px-3 py-1"
          onClick={() => {
            setNewNotice('');
            setEditMode(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )}
</div>


          {/* Tasks Card */}
          <div className="bg-zinc-100 text-zinc-800 p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
      Tasks Assigned
      {isAdmin && !editTasksMode && (
        <button
          className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          onClick={() => setEditTasksMode(true)}
        >
          Edit
        </button>
      )}
      {isAdmin && editTasksMode && (
        <button
          className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          onClick={() => setEditTasksMode(false)}
        >
          Done
        </button>
      )}
    </h2>

    <ul className="space-y-3">
      {tasks.map((task, idx) => (
        <li key={idx} className="border-b border-zinc-300 pb-2 flex justify-between items-center">
          <span>{task}</span>
          {isAdmin && editTasksMode && (
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => handleDeleteTask(idx)}
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>

    {isAdmin && editTasksMode && (
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="flex-grow px-3 py-1 rounded border border-gray-400"
        />
        <button
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
    )}
  </div>
      </div>
  </div>
      {/* Members Modal */}
      {showMembersModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowMembersModal(false)}
        >
          <div
            className="bg-white text-zinc-800 rounded-xl p-6 w-[300px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-zinc-700">
              Project Members
            </h2>
            <ul className="space-y-2">
              {members.map((member, idx) => (
                <li key={idx} className="border-b pb-1 text-center">
                  {member}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <Button className="bg-zinc-600 text-white" onClick={() => setShowMembersModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDash;
