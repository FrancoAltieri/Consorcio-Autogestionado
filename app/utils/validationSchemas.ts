import { z } from 'zod';

// Esquema para Login
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('El email no tiene un formato válido'),
    password: z
        .string()
        .min(1, 'La contraseña es obligatoria'),
});

// Esquema para Register
export const registerSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre es obligatorio')
        .regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios'),
    telefono: z
        .string()
        .min(1, 'El teléfono es obligatorio')
        .refine((value) => {
            const phoneRegex = /^\+\d{1,3}\s?\d{1,4}\s?\d{1,4}\s?\d{1,4}$/;
            return phoneRegex.test(value);
        }, 'El teléfono debe tener un formato internacional válido (ej: +54 9 11 1234 5678)'),
    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('El email no tiene un formato válido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^[A-Z]/, 'La contraseña debe comenzar con una mayúscula')
        .regex(/\d/, 'La contraseña debe contener al menos un número')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe contener al menos un símbolo especial'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;