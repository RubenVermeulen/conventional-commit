const typeCache: { [label: string]: boolean } = {};

function type<T>(label: T | ''): T {
  // this actually checks whether your action type
  // name is unique!
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

export const ActionTypes = {
  REPOSITORIES_SET: type<'REPOSITORIES_SET'>('REPOSITORIES_SET'),
  REPOSITORIES_CLEAR: type<'REPOSITORIES_CLEAR'>('REPOSITORIES_CLEAR'),
  REPOSITORIES_ADD: type<'REPOSITORIES_ADD'>('REPOSITORIES_ADD'),
  REPOSITORIES_REMOVE: type<'REPOSITORIES_REMOVE'>('REPOSITORIES_REMOVE'),
};
