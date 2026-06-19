import { Cidade } from '../dados';
import { banco, proximoId, setBanco, setProximoId } from './bancoDados';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

const api = {
  get: async (path: string) => {
    await delay();
    const matchId = path.match(/\/cidades\/(.+)/);
    if (matchId) {
      const item = banco.find(c => c.id === matchId[1]);
      if (!item) throw new Error('Not found');
      return { data: item };
    }
    return { data: [...banco] };
  },
  post: async (_path: string, body: Partial<Cidade>) => {
    await delay();
    const nova: Cidade = { ...body as Cidade, id: String(proximoId) };
    setProximoId(proximoId + 1);
    setBanco([...banco, nova]);
    return { data: nova };
  },
  put: async (path: string, body: Partial<Cidade>) => {
    await delay();
    const id = path.split('/').pop();
    setBanco(banco.map(c => c.id === id ? { ...c, ...body } : c));
    return { data: banco.find(c => c.id === id) };
  },
  delete: async (path: string) => {
    await delay();
    const id = path.split('/').pop();
    setBanco(banco.filter(c => c.id !== id));
    return { data: {} };
  },
};

export default api;
