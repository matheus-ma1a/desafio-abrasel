'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { User } from '@/types/types'

export default function AdminPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('/api/users')
        setUsers(response.data)
      } catch (err) {
        console.error('Erro ao carregar lista de usuários:', err)
        setError('Erro ao carregar lista de usuários')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'admin') {
      fetchUsers()
    }
  }, [session])

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(`/api/users/${userId}`)

      if (response.status === 200) {
        setUsers(users.filter(user => user.id !== userId))
        setDeleteConfirm(null)
      } else {
        const error = response.data?.error || 'Erro ao excluir usuário'
        setError(error)
      }
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err)
      const errorMessage = err.response?.data?.error || 'Erro ao excluir usuário'
      setError(errorMessage)
      setDeleteConfirm(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await axios.put(`/api/users/${session?.user.id}`, { name: editName })
      setSuccess('Dados atualizados com sucesso')
    } catch (error) {
      setError('Erro ao atualizar dados')
    }
  }

  const handleEdit = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setEditingUserId(userId)
      setEditName(user.name)
    }
  }

  const handleSaveEdit = async (userId: string) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, {
        name: editName,
      })

      if (response.status === 200) {
        setUsers(users.map(user => (user.id === userId ? { ...user, name: editName } : user)))
        setSuccess('Nome atualizado com sucesso')
        setEditingUserId(null)
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err)
      setError('Erro ao atualizar usuário')
    }
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditName('')
  }



  if (session?.user?.role !== 'admin') {
    return (
      <div className="text-center mt-10 text-red-600">
        Acesso negado. Esta página é apenas para administradores.
      </div>
    )
  }

  if (loading) {
    return <div className="text-center mt-10">Carregando...</div>
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Painel do Administrador</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CEP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingUserId === user.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      />
                      <button
                        onClick={() => handleSaveEdit(user.id)}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cep || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.state || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {deleteConfirm === user.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : editingUserId === user.id ? (
                    <div className="flex space-x-2"></div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                        disabled={user.role === 'admin' && user.id === session.user.id}
                      >
                        Excluir
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                        disabled={user.role === 'admin' && user.id === session.user.id}
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}