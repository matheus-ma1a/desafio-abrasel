'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { registerSchema, type RegisterFormData } from './zodSchema'
import InputComponent from '@/app/(frontEnd)/components/input'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    cep: '',
    state: '',
    city: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const fetchCep = async (cep: string, currentFormData: RegisterFormData) => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`/api/cep?cep=${cep}`)
        setFormData({
          ...currentFormData,
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
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, cep: value }
      if (value.length === 8) {
        fetchCep(value, newFormData)
      }
      return newFormData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setErrors({})

    try {
      const validatedData = registerSchema.parse(formData)
      
      await axios.post('/api/users', validatedData)
      router.push('/login?registered=true')
    } catch (error: any) {
      if (error.name === 'ZodError') {

        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof RegisterFormData
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
      } else if (error.response?.status === 409) {
        setError('Este email já está cadastrado')
      } else {
        setError('Ocorreu um erro ao fazer o cadastro')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nome
          </label>
          <InputComponent
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <InputComponent
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Senha
          </label>
          <InputComponent
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="cep">
            CEP
          </label>
          <InputComponent
            id="cep"
            name="cep"
            type="text"
            value={formData.cep}
            onChange={handleCepChange}
            maxLength={8}
          />
          {errors.cep && (
            <p className="text-red-500 text-xs italic">{errors.cep}</p>
          )}
        </div>
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
              Estado
            </label>
            <InputComponent
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              readOnly
            />
            {errors.state && (
              <p className="text-red-500 text-xs italic">{errors.state}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              Cidade
            </label>
            <InputComponent
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              readOnly
            />
            {errors.city && (
              <p className="text-red-500 text-xs italic">{errors.city}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
      
      <p className="text-center">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-blue-500 hover:text-blue-800">
          Faça login
        </Link>
      </p>
    </div>
  )
}