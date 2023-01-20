export function getIdFromIRI(iri) {
    if (iri) {
      const splittedIRI = iri.split("/");
      return splittedIRI.pop();
    }
  }
  