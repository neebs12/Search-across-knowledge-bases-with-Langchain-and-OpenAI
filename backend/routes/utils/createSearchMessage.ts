const createSearchMessage = (
  namespaceNamePair: {
    name: string;
    namespace: string;
  }[]
) => {
  if (namespaceNamePair.length === 0) {
    return "no results found";
  } else {
    return `searching ... ${namespaceNamePair
      .map((pair) => {
        return pair.name;
      })
      .join(", ")}`;
  }
};

export default createSearchMessage;
