export type LocalRepository = {
  readonly repositoryId: string;
  readonly name: string;
  readonly path: string;
  readonly hooks: boolean;
  readonly monorepo: boolean
};

