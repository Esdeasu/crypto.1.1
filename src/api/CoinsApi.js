const API_KEY =
  "6f443e0447aa9c7a28bd23c279eade013b7ff8712d1b494ca665edc0004c44dd";

export const getCoins = async () => {
  const allCoins = await fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=${API_KEY}`
  );
  const data1 = await allCoins.json();
  const result = Object.keys(data1.Data);
  return result;
};
