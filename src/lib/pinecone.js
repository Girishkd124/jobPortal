import { Pinecone } from '@pinecone-database/pinecone';

let pinecone = null;

export const initPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
        apiKey: "pcsk_6WJqwg_Pg2bqesPgMYk7ywVYLgj3KDwQMvG5rDyieDvQE7HEuWTZXMy22bJBc9WyKW5ewm",
    });
  }
  return pinecone;
};
