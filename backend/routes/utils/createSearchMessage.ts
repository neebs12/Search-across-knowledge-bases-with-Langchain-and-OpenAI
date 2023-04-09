const createSearchMessage = (
  namespaceNamePair: {
    name: string;
    namespace: string;
  }[]
) => {
  let message = "";
  if (namespaceNamePair.length === 0) {
    message = "no relevant knowledge base found ...";
  } else {
    message = `searching ... ${namespaceNamePair
      .map((pair) => {
        return pair.name;
      })
      .join(", ")}`;
  }
  return `${message}`;
};

export default createSearchMessage;
