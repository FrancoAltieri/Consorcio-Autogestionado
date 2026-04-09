// Mock data para el prototipo

export interface Socio {
  id: string;
  nombre: string;
  departamento: string;
  porcentaje: number;
  email: string;
  telefono: string;
}

export interface Gasto {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  monto: number;
  socioId: string;
  aprobado: boolean;
}

export interface Pago {
  id: string;
  fecha: string;
  socioId: string;
  monto: number;
  mes: string;
  metodo: string;
}

export interface BalanceSocio {
  socioId: string;
  gastosRealizados: number;
  pagosPagados: number;
  debeAportar: number;
  mora: number;
  estado: 'al dia' | 'debe' | 'a favor';
}

export const socios: Socio[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    departamento: 'Depto 1A',
    porcentaje: 16.67,
    email: 'juan@example.com',
    telefono: '+54 11 1234-5678',
  },
  {
    id: '2',
    nombre: 'María García',
    departamento: 'Depto 2B',
    porcentaje: 16.67,
    email: 'maria@example.com',
    telefono: '+54 11 2345-6789',
  },
  {
    id: '3',
    nombre: 'Carlos López',
    departamento: 'Depto 3C',
    porcentaje: 16.67,
    email: 'carlos@example.com',
    telefono: '+54 11 3456-7890',
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    departamento: 'Depto 4D',
    porcentaje: 16.67,
    email: 'ana@example.com',
    telefono: '+54 11 4567-8901',
  },
  {
    id: '5',
    nombre: 'Roberto Díaz',
    departamento: 'Depto 5E',
    porcentaje: 16.67,
    email: 'roberto@example.com',
    telefono: '+54 11 5678-9012',
  },
  {
    id: '6',
    nombre: 'Laura Fernández',
    departamento: 'Depto 6F',
    porcentaje: 16.65,
    email: 'laura@example.com',
    telefono: '+54 11 6789-0123',
  },
];

export const gastos: Gasto[] = [
  {
    id: '1',
    fecha: '2026-03-01',
    concepto: 'Reparación de bomba de agua',
    categoria: 'Mantenimiento',
    monto: 45000,
    socioId: '1',
    aprobado: true,
  },
  {
    id: '2',
    fecha: '2026-03-05',
    concepto: 'Servicio de jardinería - Marzo',
    categoria: 'Jardinería',
    monto: 30000,
    socioId: '2',
    aprobado: true,
  },
  {
    id: '3',
    fecha: '2026-03-08',
    concepto: 'Pintura de hall de entrada',
    categoria: 'Mejoras',
    monto: 75000,
    socioId: '3',
    aprobado: true,
  },
  {
    id: '4',
    fecha: '2026-03-10',
    concepto: 'Electricista - Reparación luces',
    categoria: 'Mantenimiento',
    monto: 18000,
    socioId: '4',
    aprobado: true,
  },
  {
    id: '5',
    fecha: '2026-03-15',
    concepto: 'Limpieza profunda escaleras',
    categoria: 'Limpieza',
    monto: 22000,
    socioId: '5',
    aprobado: true,
  },
  {
    id: '6',
    fecha: '2026-03-18',
    concepto: 'Compra de productos de limpieza',
    categoria: 'Insumos',
    monto: 8500,
    socioId: '1',
    aprobado: true,
  },
  {
    id: '7',
    fecha: '2026-03-20',
    concepto: 'Plomero - Arreglo de canilla',
    categoria: 'Mantenimiento',
    monto: 12000,
    socioId: '6',
    aprobado: false,
  },
];

export const pagos: Pago[] = [
  {
    id: '1',
    fecha: '2026-03-05',
    socioId: '1',
    monto: 35000,
    mes: 'Febrero 2026',
    metodo: 'Transferencia',
  },
  {
    id: '2',
    fecha: '2026-03-07',
    socioId: '2',
    monto: 35000,
    mes: 'Febrero 2026',
    metodo: 'Efectivo',
  },
  {
    id: '3',
    fecha: '2026-03-10',
    socioId: '3',
    monto: 35000,
    mes: 'Febrero 2026',
    metodo: 'Transferencia',
  },
  {
    id: '4',
    fecha: '2026-03-12',
    socioId: '5',
    monto: 35000,
    mes: 'Febrero 2026',
    metodo: 'Transferencia',
  },
];

export function calcularBalance(): BalanceSocio[] {
  const gastosAprobados = gastos.filter(g => g.aprobado);
  const totalGastos = gastosAprobados.reduce((sum, g) => sum + g.monto, 0);
  
  return socios.map(socio => {
    const gastosRealizados = gastosAprobados
      .filter(g => g.socioId === socio.id)
      .reduce((sum, g) => sum + g.monto, 0);
    
    const pagosPagados = pagos
      .filter(p => p.socioId === socio.id)
      .reduce((sum, p) => sum + p.monto, 0);
    
    const debeAportar = totalGastos * (socio.porcentaje / 100);
    const saldo = pagosPagados + gastosRealizados - debeAportar;
    
    let mora = 0;
    let estado: 'al dia' | 'debe' | 'a favor' = 'al dia';
    
    if (saldo < 0) {
      mora = Math.abs(saldo) * 0.05; // 5% de mora
      estado = 'debe';
    } else if (saldo > 100) {
      estado = 'a favor';
    }
    
    return {
      socioId: socio.id,
      gastosRealizados,
      pagosPagados,
      debeAportar,
      mora,
      estado,
    };
  });
}
