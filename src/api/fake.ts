// API fake: gera dados determinísticos e simula latência de rede.

export interface User {
  id: number
  name: string
  email: string
  city: string
  role: 'Admin' | 'Editor' | 'Viewer'
  active: boolean
  createdAt: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  rating: number
}

export type OrderStatus = 'Pendente' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado'

export interface Order {
  id: number
  userId: number
  customer: string
  items: { productId: number; name: string; qty: number; price: number }[]
  total: number
  status: OrderStatus
  date: string
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// PRNG com seed para os dados serem iguais a cada reload
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]!
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

const firstNames = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Larissa', 'Marcos', 'Natália', 'Otávio', 'Paula', 'Rafael', 'Sofia', 'Thiago', 'Vitória', 'Lucas']
const lastNames = ['Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Lima', 'Carvalho', 'Ferreira', 'Rodrigues', 'Almeida', 'Costa', 'Gomes', 'Ribeiro', 'Martins']
const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Recife', 'Fortaleza', 'Brasília', 'Florianópolis']
const roles = ['Admin', 'Editor', 'Viewer'] as const

const categories = ['Eletrônicos', 'Livros', 'Casa', 'Esporte', 'Moda']
const productNames: Record<string, string[]> = {
  Eletrônicos: ['Fone Bluetooth', 'Teclado Mecânico', 'Mouse Gamer', 'Monitor 27"', 'Webcam HD', 'Carregador USB-C', 'Smartwatch', 'Caixa de Som'],
  Livros: ['Clean Code', 'O Hobbit', 'Dom Casmurro', 'Sapiens', 'Duna', 'Refactoring', '1984', 'O Alquimista'],
  Casa: ['Cafeteira', 'Luminária', 'Jogo de Panelas', 'Liquidificador', 'Tapete', 'Organizador', 'Almofada', 'Vaso'],
  Esporte: ['Tênis de Corrida', 'Bola de Futebol', 'Halteres 5kg', 'Tapete de Yoga', 'Garrafa Térmica', 'Bicicleta', 'Corda de Pular', 'Mochila'],
  Moda: ['Camiseta Básica', 'Calça Jeans', 'Jaqueta', 'Boné', 'Óculos de Sol', 'Relógio', 'Bolsa', 'Tênis Casual'],
}
const statuses: OrderStatus[] = ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado']

function randomDate(daysBack: number) {
  const d = new Date(2026, 9, 23)
  d.setDate(d.getDate() - int(0, daysBack))
  return d.toISOString().slice(0, 10)
}

const users: User[] = Array.from({ length: 87 }, (_, i) => {
  const first = pick(firstNames)
  const last = pick(lastNames)
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${first}.${last}${i + 1}@exemplo.com`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
    city: pick(cities),
    role: pick(roles),
    active: rand() > 0.2,
    createdAt: randomDate(720),
  }
})

const products: Product[] = categories.flatMap((category) =>
  productNames[category]!.map((name) => ({
    id: 0,
    name,
    category,
    price: Math.round((rand() * 900 + 20) * 100) / 100,
    stock: int(0, 150),
    rating: Math.round((rand() * 2 + 3) * 10) / 10,
  })),
).map((p, i) => ({ ...p, id: i + 1 }))

const orders: Order[] = Array.from({ length: 140 }, (_, i) => {
  const user = pick(users)
  const items = Array.from({ length: int(1, 4) }, () => {
    const p = pick(products)
    return { productId: p.id, name: p.name, qty: int(1, 3), price: p.price }
  })
  return {
    id: 1000 + i,
    userId: user.id,
    customer: user.name,
    items,
    total: Math.round(items.reduce((s, it) => s + it.qty * it.price, 0) * 100) / 100,
    status: pick(statuses),
    date: randomDate(180),
  }
}).sort((a, b) => b.date.localeCompare(a.date))

const delay = <T>(value: T, ms = int(200, 600)) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms))

function paginate<T>(list: T[], page: number, pageSize: number): Page<T> {
  const start = (page - 1) * pageSize
  return { items: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

const matches = (text: string, q: string) => text.toLowerCase().includes(q.trim().toLowerCase())

export const api = {
  getUsers({ q = '', role = '', page = 1, pageSize = 10 } = {}) {
    const list = users.filter((u) => (!q || matches(u.name, q) || matches(u.email, q)) && (!role || u.role === role))
    return delay(paginate(list, page, pageSize))
  },
  getUser(id: number) {
    return delay(users.find((u) => u.id === id) ?? null)
  },
  getProducts({ q = '', category = '' } = {}) {
    return delay(products.filter((p) => (!q || matches(p.name, q)) && (!category || p.category === category)))
  },
  getProduct(id: number) {
    return delay(products.find((p) => p.id === id) ?? null)
  },
  getOrders({ status = '', userId = 0, page = 1, pageSize = 15 } = {}) {
    const list = orders.filter((o) => (!status || o.status === status) && (!userId || o.userId === userId))
    return delay(paginate(list, page, pageSize))
  },
  getOrder(id: number) {
    return delay(orders.find((o) => o.id === id) ?? null)
  },
  getStats() {
    const valid = orders.filter((o) => o.status !== 'Cancelado')
    return delay({
      users: users.length,
      activeUsers: users.filter((u) => u.active).length,
      products: products.length,
      orders: orders.length,
      revenue: Math.round(valid.reduce((s, o) => s + o.total, 0) * 100) / 100,
      recentOrders: orders.slice(0, 5),
    })
  },
  categories,
  statuses,
  roles,
}

export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const dateBr = (iso: string) => iso.split('-').reverse().join('/')
