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
  const [editMode, setEditMode] = useState(false);
  const [newNotice, setNewNotice] = useState('');
  const [editTasksMode, setEditTasksMode] = useState(false);
  const [newTask, setNewTask] = useState('');
  const token = localStorage.getItem('token');
 const [editDescMode, setEditDescMode] = useState(false);
 const [editedDescription, setEditedDescription] = useState('');


  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(
        `https://trackxback.onrender.com/user/projects/${projectId}/tasks`,
        { task: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => [...prev, newTask]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to add task', error);
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
    }
  };

  const handleAddNotice = async () => {
    if (!newNotice.trim()) return;
    try {
      await axios.post(
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
      await axios.delete(
        `https://trackxback.onrender.com/user/projects/${projectId}/notices/${index}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotices(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete notice:', error);
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const res = await axios.get(`https://trackxback.onrender.com/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const project = res.data;
        setProjectName(project.projectName);
        setDescription(project.description);
        setMembers(project.members);
        setNotices(project.notices || []);
        setTasks(project.tasks || []);
        setIsAdmin(project.isAdmin);
        setUsername(project.username || 'User');
      } catch (err) {
        console.error('Failed to fetch project data', err);
      }
    };
    fetchProjectData();
  }, [projectId, token]);

  return (
    <div className="bg-zinc-900 min-h-screen text-white w-screen pb-10 px-2">
      <header className="w-full py-4 px-4 bg-zinc-800 shadow-lg flex justify-between items-center">
        <Logo />
        <h2 className="text-xl font-medium text-white">Hi, {username} !</h2>
      </header>

      <main className="pt-10 max-w-5xl mx-auto space-y-10">
        <section className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-md">
          <div className="bg-zinc-700 p-6 rounded-xl shadow-md">
  <h1 className="text-2xl font-bold mb-2">{projectName}</h1>

  {!editDescMode ? (
    <div className="flex justify-between items-start">
      <p className="text-zinc-300 mb-4">{description || 'No description provided.'}</p>
      {isAdmin && (
        <Button
          className="bg-blue-600 text-white text-sm ml-4 px-3 py-1"
          onClick={() => {
            setEditDescMode(true);
            setEditedDescription(description);
          }}
        >
          Edit
        </Button>
      )}
    </div>
  ) : (
    <div className="mb-4 space-y-2">
      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        className="w-full text-black p-2 rounded border border-gray-300"
        rows={3}
      />
      <div className="flex gap-2">
        <Button
          className="bg-green-600 text-white px-3 py-1"
          onClick={async () => {
            try {
              await axios.put(
                `https://trackxback.onrender.com/user/projects/${projectId}/description`,
                { description: editedDescription },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setDescription(editedDescription);
              setEditDescMode(false);
            } catch (err) {
              console.error("Failed to update description", err);
              alert("Update failed");
            }
          }}
        >
          Save
        </Button>
        <Button
          className="bg-zinc-500 text-white px-3 py-1"
          onClick={() => {
            setEditDescMode(false);
            setEditedDescription('');
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )}

  <Button className="bg-zinc-600  hover:bg-zinc-700 text-white mt-2" onClick={() => setShowMembersModal(true)}>
    Members
  </Button>
</div>

         
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white text-zinc-900 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📢 Notices</h2>
              {isAdmin && !editMode && (
                <Button className="text-sm bg-blue-600 hover:bg-blue-700" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              )}
              {isAdmin && editMode && (
                <Button className="text-sm bg-red-600 hover:bg-red-700" onClick={() => setEditMode(false)}>
                  Done
                </Button>
              )}
            </div>

            <ul className="list-disc pl-5 space-y-2">
              {notices.map((notice, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{notice}</span>
                  {isAdmin && editMode && (
                    <button onClick={() => handleDeleteNotice(idx)} className="text-red-500 text-sm ml-2">
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isAdmin && editMode && (
              <div className="mt-4">
                <textarea
                  value={newNotice}
                  onChange={(e) => setNewNotice(e.target.value)}
                  className="w-full border border-zinc-400 rounded p-2 text-sm"
                  rows={2}
                  placeholder="Add a notice"
                />
                <div className="mt-2 flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddNotice}>
                    Add
                  </Button>
                  <Button className="bg-zinc-600 hover:bg-zinc-700 text-white" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white text-zinc-900 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📝 Tasks</h2>
              {isAdmin && !editTasksMode && (
                <Button className="text-sm bg-green-600 hover:bg-green-700" onClick={() => setEditTasksMode(true)}>
                  Edit
                </Button>
              )}
              {isAdmin && editTasksMode && (
                <Button className="text-sm bg-red-600 hover:bg-red-700" onClick={() => setEditTasksMode(false)}>
                  Done
                </Button>
              )}
            </div>

            <ul className="space-y-2">
              {tasks.map((task, idx) => (
                <li key={idx} className="flex justify-between border-b pb-2">
                  <span>{task}</span>
                  {isAdmin && editTasksMode && (
                    <button className="text-sm text-red-600" onClick={() => handleDeleteTask(idx)}>
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
                  placeholder="New Task"
                  className="flex-1 px-3 py-1 text-sm border rounded border-zinc-400"
                />
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddTask}>
                  Add
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={() => setShowMembersModal(false)}>
          <div className="bg-white text-zinc-800 p-6 rounded-xl shadow-xl w-80 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4 text-center">Project Members</h2>
            <ul className="space-y-2 text-center">
              {members.map((member, idx) => (
                <li key={idx} className="border-b pb-1">{member}</li>
              ))}
            </ul>
            <div className="mt-4 text-center">
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
