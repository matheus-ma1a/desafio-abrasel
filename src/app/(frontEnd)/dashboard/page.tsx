'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { UserData } from '@/types/types'
import InputComponent from '@/app/(frontEnd)/components/input'

export default function DashboardPage() {
  const { data: session } = useSession()


  const [userData, setUserData] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    cep: '',
    state: '',
    city: ''
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${session?.user.id}`)
        setUserData(response.data)
        setFormData({
          name: response.data.name,
          cep: response.data.cep || '',
          state: response.data.state || '',
          city: response.data.city || ''
        })
      } catch (error) {
        setError('Erro ao carregar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchUserData()
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const fetchCep = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`/api/cep?cep=${cep}`)
        setFormData({
          ...formData,
          state: response.data.state,
          city: response.data.city
        })
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setFormData({ ...formData, cep: value })
    fetchCep(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      await axios.put(`/api/users/${session?.user.id}`, formData)
      setSuccess('Dados atualizados com sucesso')
    } catch (error) {
      setError('Erro ao atualizar dados')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="text-center mt-10">Carregando...</div>
  }

  return (
    <div className="max-w-2xl text-center mx-auto mt-10">
      <h3 className="text-2xl font-bold mb-20">🎉 Bem-vindo ao seu Dashboard, {userData?.name}!</h3>
      <h3 className="text-xl font-bold mb-6">Meus Dados</h3>

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

      <div className="bg-white text-start shadow-md rounded flex px-8 py-6 ">
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Nome:</strong> {userData?.name}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {userData?.email}
          </p>
          {userData?.cep && (
            <p className="text-gray-700">
              <strong>Cidade:</strong> {userData?.city}
            </p>
          )}
          {userData?.state && (
            <p className="text-gray-700">
              <strong>Estado:</strong> {userData?.state}
            </p>
          )}
          {userData?.cep && (
            <p className="text-gray-700">
              <strong>Cep:</strong> {userData?.cep}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}