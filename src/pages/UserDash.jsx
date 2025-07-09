import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const UserDash = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [projects, setProjects] = useState([])
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [requests, setRequests] = useState([])

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
        const token = localStorage.getItem('token');
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

      <div className="absolute top-4 left-4 z-40">
        <Logo />
      </div>

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        <Button
          variant="outline"
          className="bg-zinc-700 p-2"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {showMenu ? <X /> : <Menu />}
        </Button>

        <div
          className={`mt-2 flex flex-col gap-2 p-4 bg-zinc-900 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out origin-top-right ${
            showMenu ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
          }`}
        >
          <Button
            className="bg-zinc-600 text-white"
            onClick={() => {
              setShowCreateModal(true)
              setShowMenu(false)
            }}
          >
            Create Project
          </Button>
          <Button
            className="bg-zinc-600 text-white"
            onClick={() => {
              setShowJoinModal(true)
              setShowMenu(false)
            }}
          >
            Join Project
          </Button>
          <Button
            className="bg-zinc-600 text-white"
            onClick={() => {
              fetchJoinRequests()
              setShowRequestsModal(true)
              setShowMenu(false)
            }}
          >
            Requests
          </Button>
          <Button className="bg-red-600 text-white" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="pt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(projects) && projects.map((proj) => (
          <div
            key={proj._id}
            onClick={() => navigate(`/projects/${proj._id}`)}
            className={`rounded-xl p-4 bg-zinc-100 text-zinc-800 shadow-md border-2 ${
              proj.isAdmin ? 'border-red-500' : 'border-green-500'
            }`}
          >
            <h3 className="text-lg font-semibold mb-1">{proj.projectName}</h3>
             <p className="text-sm text-gray-500 mb-2">
      Project ID: <span className="font-mono">{proj.projectId}</span>
    </p>
            <p className="text-sm text-zinc-600">Admin: {proj.adminName}</p>
          </div>
        ))}
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
              className="mb-4 border-zinc-600"
            />
            <div className="flex justify-between">
              <Button className="bg-zinc-600 text-white" onClick={handleJoin}>Submit</Button>
              <Button
                className="bg-zinc-600 text-white hover:bg-zinc-800"
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
