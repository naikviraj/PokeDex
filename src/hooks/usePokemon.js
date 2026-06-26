import { useQuery } from '@tanstack/react-query';

const BASE = 'https://pokeapi.co/api/v2';

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
};

export const usePokemonList = (offset = 0, limit = 20) =>
  useQuery({
    queryKey: ['pokemon-list', offset, limit],
    queryFn: async () => {
      const data = await fetchJSON(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
      const details = await Promise.all(
        data.results.map(p => fetchJSON(`${BASE}/pokemon/${p.name}`))
      );
      return { results: details, next: data.next, count: data.count };
    },
    staleTime: 5 * 60 * 1000,
  });

export const usePokemonDetail = (nameOrId) =>
  useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => fetchJSON(`${BASE}/pokemon/${nameOrId}`),
    enabled: !!nameOrId,
    staleTime: 10 * 60 * 1000,
  });

export const usePokemonSpecies = (nameOrId) =>
  useQuery({
    queryKey: ['pokemon-species', nameOrId],
    queryFn: () => fetchJSON(`${BASE}/pokemon-species/${nameOrId}`),
    enabled: !!nameOrId,
    staleTime: 10 * 60 * 1000,
  });

export const useEvolutionChain = (url) =>
  useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: () => fetchJSON(url),
    enabled: !!url,
    staleTime: 10 * 60 * 1000,
  });

export const useAllPokemonNames = () =>
  useQuery({
    queryKey: ['all-pokemon-names'],
    queryFn: () => fetchJSON(`${BASE}/pokemon?limit=1302`).then(d => d.results),
    staleTime: 30 * 60 * 1000,
  });

export const usePokemonByType = (type) =>
  useQuery({
    queryKey: ['pokemon-by-type', type],
    queryFn: async () => {
      const data = await fetchJSON(`${BASE}/type/${type}`);
      const slice = data.pokemon.slice(0, 24);
      const details = await Promise.all(
        slice.map(p => fetchJSON(`${BASE}/pokemon/${p.pokemon.name}`))
      );
      return details;
    },
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
  });

export const usePokemonByRegion = (offset, limit) =>
  useQuery({
    queryKey: ['pokemon-by-region', offset, limit],
    queryFn: async () => {
      const data = await fetchJSON(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
      const details = await Promise.all(
        data.results.map(p => fetchJSON(`${BASE}/pokemon/${p.name}`))
      );
      return details;
    },
    enabled: offset !== null && limit !== null,
    staleTime: 10 * 60 * 1000,
  });

export const useRandomPokemon = (id) =>
  useQuery({
    queryKey: ['random-pokemon', id],
    queryFn: () => fetchJSON(`${BASE}/pokemon/${id}`),
    enabled: !!id,
    staleTime: 0,
  });
