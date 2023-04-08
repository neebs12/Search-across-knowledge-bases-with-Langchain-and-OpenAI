export type Metadata = {
  namespace: string;
  filename: string;
  link: string;
};

export type NewDocumentType = {
  pageContent: string;
  metadata: Metadata;
};

export type ExtendedMetadata = Metadata & {
  id: string;
};

export type NewDocumentTypeChunked = Omit<NewDocumentType, "metadata"> & {
  metadata: ExtendedMetadata;
};
