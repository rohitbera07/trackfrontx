import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical } from 'lucide-react';

const UserDash = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [projects, setProjects] = useState([])
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [requests, setRequests] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
const [showEditModal, setShowEditModal] = useState(false);
const [editingProjectId, setEditingProjectId] = useState(null);
const [editingProjectName, setEditingProjectName] = useState('');


  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://trackxback.onrender.com/user/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setProjects(res.data?.projects || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      }
    }

    fetchProjects()
  }, [token])

    const handleDeleteProject = async (projectId) => {
  if (!window.confirm("Are you sure you want to delete this project?")) return;
  try {
    await axios.delete(`https://trackxback.onrender.com/user/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Project deleted");
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  } catch (err) {
    console.error("Delete failed", err);
    toast.error("Delete failed");
  }
};

const handleUpdateProjectName = async () => {
  try {
    await axios.put(`https://trackxback.onrender.com/user/projects/${editingProjectId}`, {
      projectName: editingProjectName,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Project name updated");
    setShowEditModal(false);
    setProjects((prev) =>
      prev.map((p) =>
        p._id === editingProjectId ? { ...p, projectName: editingProjectName } : p
      )
    );
  } catch (err) {
    toast.error("Update failed");
  }
};

  const fetchJoinRequests = async () => {
    try {
      const res = await axios.get('https://trackxback.onrender.com/user/requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRequests(res.data?.requests || [])
    } catch (err) {
      console.error('Error fetching join requests', err)
    }
  }

  const handleCreate = async () => {
    try {
      await axios.post(
        'https://trackxback.onrender.com/user/projects',
        { projectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setShowCreateModal(false)
      setProjectName('')
      window.location.reload()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleRequest = async (requestId, projectId, accepted) => {
    try {
      console.log(accepted,requestId)
      await axios.post(
        `https://trackxback.onrender.com/user/projects/${projectId}/requests/${requestId}`,
        { decision: accepted ? 'accepted' : 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchJoinRequests()
    } catch (err) {
      console.error('Error updating request', err)
    }
  }

  const handleJoin = async () => {
    try {
      
      await axios.post(
        'https://trackxback.onrender.com/user/projects/join',
        { projectId: projectCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setShowJoinModal(false)
      setProjectCode('')
      window.location.reload()
    } catch (error) {
      console.error('Error joining project:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
     <div className="relative bg-zinc-800 min-h-screen text-white w-screen px-4 pb-10 overflow-x-hidden">
      {showMenu && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        />
      )}
      <div className="fixed top-4 left-4 z-50">
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 transition-colors duration-300 shadow-lg"
          onClick={() => setShowMenu(prev => !prev)}
        >
          {showMenu ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        <div
          className={`mt-3 flex flex-col gap-2 transition-all duration-300 ease-in-out transform origin-top-right ${
            showMenu ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={() => {
              setShowCreateModal(true)
              setShowMenu(false)
            }}
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 shadow-md w-fit self-end"
          >
            Create Project
          </button>
          <button
            onClick={() => {
              setShowJoinModal(true)
              setShowMenu(false)
            }}
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 shadow-md w-fit self-end"
          >
            Join Project
          </button>
          <button
            onClick={() => {
              fetchJoinRequests()
              setShowRequestsModal(true)
              setShowMenu(false)
            }}
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 shadow-md w-fit self-end"
          >
            Requests
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md w-fit self-end"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-40">
        <Logo />
      </div>

      <div className="absolute top-4 right-4 z-40">
        <Logo />
      </div>

     

<div className="pt-28 mx-2">
  <div className="bg-zinc-600 rounded-xl shadow-md divide-y divide-zinc-500">
    {Array.isArray(projects) && projects.length === 0 && (
      <p className="p-4 text-center text-zinc-300">No Projects Found Yet!</p>
    )}

    {Array.isArray(projects) &&
      projects.map((proj) => (
        <div
          key={proj._id}
          className="group flex items-center justify-between p-4 hover:bg-zinc-700 cursor-pointer relative"
        >
          {/* Clicking here navigates */}
          <div
            onClick={() => navigate(`/projects/${proj._id}`)}
            className="grid grid-cols-1 md:grid-cols-3 gap-y-1 md:gap-x-4 flex-grow w-full pr-4"
          >
            <span className="text-lg font-semibold truncate">{proj.projectName}</span>
            <span className="text-sm text-gray-300 font-mono truncate">ID: {proj.projectId}</span>
            <span className="text-sm text-zinc-200 truncate">Admin: {proj.adminName}</span>
          </div>

          {/* Three-dot menu (only for Admin) */}
          {proj.isAdmin && (
            <div className="relative z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row navigation
                  setActiveMenu((prev) => (prev === proj._id ? null : proj._id));
                }}
                className="p-2 rounded-full hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
              >
                <MoreVertical size={20} />
              </button>

              {/* Dropdown Menu */}
              {activeMenu === proj._id && (
                <div
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown click from triggering row
                  className="absolute right-0 mt-2 w-36 bg-white text-sm text-zinc-800 rounded-md shadow-xl border border-zinc-300"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-zinc-100"
                    onClick={() => {
                      setActiveMenu(null);
                      alert(`Update clicked for ${proj.projectName}`);
                      // TODO: Replace with update modal or route
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    onClick={() => {
                      setActiveMenu(null);
                      handleDeleteProject(proj._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
  </div>
</div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-zinc-700">Create Project</h2>
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mb-4 border-zinc-600 text-zinc-800"
            />
            <div className="flex justify-between">
              <Button className="bg-zinc-600 text-white" onClick={handleCreate}>Submit</Button>
              <Button
                className="bg-zinc-600 text-white hover:bg-zinc-800"
                variant="ghost"
                onClick={() => {
                  setShowCreateModal(false)
                  setProjectName('')
                }}
              >Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-zinc-700">Join Project</h2>
            <Input
              placeholder="Enter Project Code"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              className="mb-4 text-zinc-600 border-zinc-600"
            />
            <div className="flex justify-between">
              <Button className="bg-zinc-600 text-white" onClick={handleJoin}>Submit</Button>
              <Button
                className="bg-zinc-600 text-white hover:text-white hover:bg-zinc-800"
                variant="ghost"
                onClick={() => {
                  setShowJoinModal(false)
                  setProjectCode('')
                }}
              >Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {showRequestsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowRequestsModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[320px] max-h-[80vh] overflow-y-auto shadow-xl text-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-zinc-700">Join Requests</h2>
            {requests.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No pending requests</p>
            ) : (
              requests.map((req) => (
                <div  className="mb-4 border border-zinc-300 rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium text-zinc-700 mb-2">
                    {req.username} wants to join your <span className="font-semibold">{req.projectName}</span> project!
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>   handleRequest(req.requestId, req.projectId, true)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequest(req.requestId, req.projectId, false)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDash
