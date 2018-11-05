
export const getTools = state => state;
export const getTool = (state, slug) => state.find(t => (t.slug === slug));
