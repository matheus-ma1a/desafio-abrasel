import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Email inválido'),
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(50, 'A senha deve ter no máximo 50 caracteres'),
  cep: z.string()
    .length(8, 'CEP deve ter 8 dígitos')
    .regex(/^\d+$/, 'CEP deve conter apenas números'),
  state: z.string()
    .min(2, 'Estado é obrigatório'),
  city: z.string()
    .min(2, 'Cidade é obrigatória')
})

export type RegisterFormData = z.infer<typeof registerSchema>